/*
 * POST /api/send-brief  (Vercel serverless function)
 *
 * Takes the shoot brief from the website form and delivers it straight to
 * Akash's WhatsApp through CallMeBot, so a visitor only presses "Send".
 *
 * Environment variables (Vercel → Project → Settings → Environment Variables):
 *   CALLMEBOT_APIKEY  required. Akash gets it by sending
 *                     "I allow callmebot to send me messages" to CallMeBot on WhatsApp.
 *   AKASH_WHATSAPP    optional, default +918939331561
 *
 * Responses: 200 {ok:true} | 400 invalid | 429 too-many | 503 not-configured | 502 gateway.
 * Anything but 200 makes the page fall back to opening WhatsApp with the brief typed out.
 */
const LIMITS = { name: 80, phone: 20, type: 60, city: 120, need: 120, msg: 1000 };
const WINDOW_MS = 10 * 60 * 1000;
const PER_WINDOW = 3;
const recent = new Map(); // ip → timestamps (best effort, per warm instance)

const oneLine = (v, max) => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const multiLine = (v, max) => String(v ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, ' ')
  .replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
const prettyDate = (iso) => {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? new Date(`${iso}T00:00:00Z`) : null;
  return d && !isNaN(d) ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'TBC';
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'post-only' });

  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!apikey) return res.status(503).json({ ok: false, error: 'not-configured' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = null; } }
  if (!b || typeof b !== 'object') return res.status(400).json({ ok: false, error: 'invalid' });

  // Bots fill the hidden "website" field or submit instantly: say ok, send nothing.
  const started = Number(b.startedAt);
  if (b.website || (started && Date.now() - started < 3000)) return res.status(200).json({ ok: true });

  const name = oneLine(b.name, LIMITS.name);
  let phone = String(b.phone ?? '').replace(/\D/g, '').slice(0, LIMITS.phone);
  if (phone.length === 10) phone = `91${phone}`;          // Indian mobile without country code
  if (phone.length === 11 && phone.startsWith('0')) phone = `91${phone.slice(1)}`;
  if (!name || phone.length < 10 || phone.length > 15) return res.status(400).json({ ok: false, error: 'invalid' });

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= PER_WINDOW) return res.status(429).json({ ok: false, error: 'too-many' });
  hits.push(now);
  recent.set(ip, hits);

  const need = Array.isArray(b.need) ? b.need.map((n) => oneLine(n, 40)).filter(Boolean).join(', ') : oneLine(b.need, LIMITS.need);
  const details = multiLine(b.msg, LIMITS.msg);
  const text = [
    '📸 *New shoot enquiry* from your website',
    '',
    `*Name:* ${name}`,
    `*WhatsApp:* +${phone}`,
    `*Event:* ${oneLine(b.type, LIMITS.type) || 'Not given'}`,
    `*Date:* ${prettyDate(b.date)}`,
    `*Venue / city:* ${oneLine(b.city, LIMITS.city) || 'TBC'}`,
    `*Need:* ${need || 'Not sure yet'}`,
    ...(details ? ['', `*Details:* ${details}`] : []),
    '',
    `Reply: https://wa.me/${phone}`,
  ].join('\n');

  const to = process.env.AKASH_WHATSAPP || '+918939331561';
  const gateway = process.env.CALLMEBOT_URL || 'https://api.callmebot.com/whatsapp.php';
  const url = `${gateway}?phone=${encodeURIComponent(to)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(25000) });
    const body = (await r.text()).replace(/<[^>]+>/g, ' ');
    const failed = /invalid|error|wrong|not allowed|blocked|exceeded|limit/i.test(body) && !/queued|sent/i.test(body);
    if (r.ok && !failed) return res.status(200).json({ ok: true });
    console.error('CallMeBot refused:', r.status, body.replace(/\s+/g, ' ').slice(0, 300));
  } catch (e) {
    console.error('CallMeBot unreachable:', e.message);
  }
  return res.status(502).json({ ok: false, error: 'gateway' });
};
