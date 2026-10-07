/*
 * POST /api/send-brief  (Vercel serverless function)
 *
 * Takes the shoot brief from the website form and delivers it straight to
 * Akash's WhatsApp, so a visitor only presses "Send".
 *
 * Delivery, in order of preference (set in Vercel → Settings → Environment Variables):
 *
 *   1. Meta WhatsApp Cloud API (official). Sends the approved template
 *      `shoot_enquiry` from the business number to Akash. See docs/whatsapp-setup.md.
 *        WHATSAPP_TOKEN            permanent system-user access token
 *        WHATSAPP_PHONE_NUMBER_ID  the sending (business/test) number's ID
 *        WHATSAPP_TEMPLATE         optional, default shoot_enquiry
 *        WHATSAPP_TEMPLATE_LANG    optional, default en
 *        GRAPH_API_VERSION         optional, default v25.0
 *
 *   2. CallMeBot (free gateway to your own number), used if the Cloud API isn't
 *      configured or fails.
 *        CALLMEBOT_APIKEY
 *
 *   AKASH_WHATSAPP   optional recipient, default 918939331561
 *
 * Responses: 200 {ok:true} | 400 invalid | 403 forbidden (not from the site) | 413/415 bad request
 *            | 429 too-many | 503 not-configured | 502 gateway.
 * The page also emails every brief, so a failure here never loses an enquiry.
 */
const LIMITS = { name: 80, phone: 20, type: 60, city: 120, need: 120, msg: 600 };
const MAX_BODY = 8 * 1024;
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 3;                       // briefs per visitor per 10 minutes
const PER_PHONE_DAY = 3;                // briefs per WhatsApp number per day
const PER_HOUR_TOTAL = 30;              // ceiling for everything this instance sends in an hour
const recent = new Map();               // key → timestamps (best effort, per warm instance)
const hit = (key, windowMs, max) => {
  const now = Date.now();
  const list = (recent.get(key) || []).filter((t) => now - t < windowMs);
  if (list.length >= max) return false;
  list.push(now);
  recent.set(key, list);
  return true;
};

/* Only the portfolio itself may call this endpoint: its production domain,
 * this deployment's own URLs, preview deployments of this project, and
 * localhost during development. Extra domains: SITE_ORIGINS=a.com,b.com */
const OWN_PREVIEW = /^akash-portfolio-[a-z0-9]+-trijal-p-gs-projects\.vercel\.app$/;
function allowedOrigin(origin) {
  let u;
  try { u = new URL(origin); } catch { return false; }
  const own = [
    'akshthetics.vercel.app', 'akash-portfolio-trijal-p-gs-projects.vercel.app',
    process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL,
    ...String(process.env.SITE_ORIGINS || '').split(','),
  ].filter(Boolean).map((h) => h.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase());
  if (u.protocol === 'https:' && (own.includes(u.hostname) || OWN_PREVIEW.test(u.hostname))) return true;
  return process.env.VERCEL_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(u.hostname);
}

const oneLine = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const prettyDate = (iso) => {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? new Date(`${iso}T00:00:00Z`) : null;
  return d && !isNaN(d) ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'TBC';
};
const recipient = () => String(process.env.AKASH_WHATSAPP || '918939331561').replace(/\D/g, '');

/* ── 1. Meta WhatsApp Cloud API ───────────────────────────────────────── */
async function viaCloudApi(b) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return null;
  const version = process.env.GRAPH_API_VERSION || 'v25.0';
  const base = process.env.GRAPH_API_URL || 'https://graph.facebook.com';
  // Template parameters may not contain line breaks, tabs or 4+ spaces in a row.
  const params = [b.name, `+${b.phone}`, b.type, b.date, b.city, b.need, b.details]
    .map((t) => ({ type: 'text', text: oneLine(t, 600).replace(/ {4,}/g, ' ') || '-' }));
  const payload = {
    messaging_product: 'whatsapp',
    to: recipient(),
    type: 'template',
    template: {
      name: process.env.WHATSAPP_TEMPLATE || 'shoot_enquiry',
      language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
      components: [
        { type: 'body', parameters: params },
        { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: b.phone }] },
      ],
    },
  };
  try {
    const r = await fetch(`${base}/${version}/${phoneId}/messages`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.messages?.[0]?.id) return true;
    console.error('WhatsApp Cloud API refused:', r.status, JSON.stringify(j.error || j).slice(0, 400));
  } catch (e) {
    console.error('WhatsApp Cloud API unreachable:', e.message);
  }
  return false;
}

/* ── 2. CallMeBot ─────────────────────────────────────────────────────── */
async function viaCallMeBot(b) {
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!apikey) return null;
  const text = [
    '📸 *New shoot enquiry* from your website',
    '',
    `*Name:* ${b.name}`,
    `*WhatsApp:* +${b.phone}`,
    `*Event:* ${b.type}`,
    `*Date:* ${b.date}`,
    `*Venue / city:* ${b.city}`,
    `*Need:* ${b.need}`,
    ...(b.details !== '-' ? ['', `*Details:* ${b.details}`] : []),
    '',
    `Reply: https://wa.me/${b.phone}`,
  ].join('\n');
  const gateway = process.env.CALLMEBOT_URL || 'https://api.callmebot.com/whatsapp.php';
  const url = `${gateway}?phone=${encodeURIComponent(`+${recipient()}`)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(25000) });
    const body = (await r.text()).replace(/<[^>]+>/g, ' ');
    const failed = /invalid|error|wrong|not allowed|blocked|exceeded|limit/i.test(body) && !/queued|sent/i.test(body);
    if (r.ok && !failed) return true;
    console.error('CallMeBot refused:', r.status, body.replace(/\s+/g, ' ').slice(0, 300));
  } catch (e) {
    console.error('CallMeBot unreachable:', e.message);
  }
  return false;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  // No CORS headers: browsers on other websites can't call this endpoint.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'post-only' });
  }
  if (!allowedOrigin(req.headers.origin || '')) return res.status(403).json({ ok: false, error: 'forbidden' });
  const site = req.headers['sec-fetch-site'];
  if (site && site !== 'same-origin') return res.status(403).json({ ok: false, error: 'forbidden' });
  if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) return res.status(415).json({ ok: false, error: 'json-only' });
  if (Number(req.headers['content-length'] || 0) > MAX_BODY) return res.status(413).json({ ok: false, error: 'too-large' });

  const cloudReady = process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!cloudReady && !process.env.CALLMEBOT_APIKEY) return res.status(503).json({ ok: false, error: 'not-configured' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = null; } }
  if (!b || typeof b !== 'object' || Array.isArray(b) || JSON.stringify(b).length > MAX_BODY) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }

  // Bots fill the hidden "website" field or submit instantly: say ok, send nothing.
  const started = Number(b.startedAt);
  if (b.website || (started && Date.now() - started < 3000)) return res.status(200).json({ ok: true });

  const name = oneLine(b.name, LIMITS.name);
  let phone = String(b.phone ?? '').replace(/\D/g, '').slice(0, LIMITS.phone);
  if (phone.length === 10) phone = `91${phone}`;          // Indian mobile without country code
  if (phone.length === 11 && phone.startsWith('0')) phone = `91${phone.slice(1)}`;
  if (!name || phone.length < 10 || phone.length > 15) return res.status(400).json({ ok: false, error: 'invalid' });

  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (!hit(`ip:${ip}`, WINDOW_MS, PER_IP) || !hit(`phone:${phone}`, 864e5, PER_PHONE_DAY) || !hit('all', 3600e3, PER_HOUR_TOTAL)) {
    return res.status(429).json({ ok: false, error: 'too-many' });
  }

  const brief = {
    name,
    phone,
    type: oneLine(b.type, LIMITS.type) || 'Not given',
    date: prettyDate(b.date),
    city: oneLine(b.city, LIMITS.city) || 'TBC',
    need: (Array.isArray(b.need) ? b.need.map((n) => oneLine(n, 40)).filter(Boolean).join(', ') : oneLine(b.need, LIMITS.need)) || 'Not sure yet',
    details: oneLine(b.msg, LIMITS.msg) || '-',
  };

  if (await viaCloudApi(brief)) return res.status(200).json({ ok: true, via: 'whatsapp-cloud' });
  if (await viaCallMeBot(brief)) return res.status(200).json({ ok: true, via: 'callmebot' });
  return res.status(502).json({ ok: false, error: 'gateway' });
};
