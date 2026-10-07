#!/usr/bin/env node
/*
 * Helper for the WhatsApp Cloud API side of the one-click brief (api/send-brief.js).
 *
 *   WHATSAPP_TOKEN=… WHATSAPP_PHONE_NUMBER_ID=… WHATSAPP_WABA_ID=… node scripts/whatsapp-setup.mjs <command>
 *
 *   check            token + sender number look right
 *   hello            send Meta's pre-approved hello_world template to Akash (setup smoke test)
 *   create-template  submit the `shoot_enquiry` template for approval
 *   status           show the template's approval status
 *   test             send a sample brief with the real template (once it's APPROVED)
 *
 * AKASH_WHATSAPP (default 918939331561) is the recipient. GRAPH_API_VERSION defaults to v25.0.
 */
const {
  WHATSAPP_TOKEN: TOKEN, WHATSAPP_PHONE_NUMBER_ID: PHONE_ID, WHATSAPP_WABA_ID: WABA_ID,
  AKASH_WHATSAPP = '918939331561', GRAPH_API_VERSION = 'v25.0', GRAPH_API_URL = 'https://graph.facebook.com',
} = process.env;
const TEMPLATE = process.env.WHATSAPP_TEMPLATE || 'shoot_enquiry';
const LANG = process.env.WHATSAPP_TEMPLATE_LANG || 'en';
const TO = AKASH_WHATSAPP.replace(/\D/g, '');
const SAMPLE = ['Priya (CIT Media Club)', '+91 98765 43210', 'College fest', '14 Nov 2026', 'CIT, Chennai',
  'Photography, Videography', 'Takshashila night 2, need reels the same night'];

export const TEMPLATE_DEFINITION = {
  name: TEMPLATE,
  language: LANG,
  category: 'UTILITY',
  components: [
    { type: 'HEADER', format: 'TEXT', text: 'New shoot enquiry' },
    {
      type: 'BODY',
      text: 'You have a new shoot enquiry from your portfolio website.\n\n'
        + 'Name: {{1}}\nWhatsApp: {{2}}\nEvent: {{3}}\nDate: {{4}}\nVenue: {{5}}\nNeed: {{6}}\nDetails: {{7}}\n\n'
        + 'Tap the button below to reply to them on WhatsApp.',
      example: { body_text: [SAMPLE] },
    },
    { type: 'FOOTER', text: 'akshthetics.jpg portfolio' },
    {
      type: 'BUTTONS',
      buttons: [{ type: 'URL', text: 'Reply on WhatsApp', url: 'https://wa.me/{{1}}', example: ['https://wa.me/919876543210'] }],
    },
  ],
};

async function graph(path, { method = 'GET', body } = {}) {
  const r = await fetch(`${GRAPH_API_URL}/${GRAPH_API_VERSION}/${path}`, {
    method,
    headers: { authorization: `Bearer ${TOKEN}`, ...(body ? { 'content-type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = j.error || {};
    throw new Error(`${r.status} ${e.type || ''} ${e.code || ''}: ${e.error_user_msg || e.message || JSON.stringify(j)}`);
  }
  return j;
}
const need = (...vars) => {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length) { console.error(`Set ${missing.join(', ')} first.`); process.exit(1); }
};
const sendTemplate = (name, lang, components) => graph(`${PHONE_ID}/messages`, {
  method: 'POST',
  body: { messaging_product: 'whatsapp', to: TO, type: 'template', template: { name, language: { code: lang }, ...(components ? { components } : {}) } },
});

const commands = {
  async check() {
    need('WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID');
    const p = await graph(`${PHONE_ID}?fields=display_phone_number,verified_name,quality_rating,code_verification_status`);
    console.log('Sender number:', p.display_phone_number, '·', p.verified_name, '· quality', p.quality_rating || '-');
    if (WABA_ID) {
      const w = await graph(`${WABA_ID}?fields=name,currency,timezone_id`);
      console.log('WhatsApp Business Account:', w.name || WABA_ID);
    }
    console.log('Recipient (Akash):', `+${TO}`);
  },
  async hello() {
    need('WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID');
    const r = await sendTemplate('hello_world', 'en_US');
    console.log('hello_world sent to', `+${TO}`, '→ message id', r.messages?.[0]?.id);
  },
  async 'create-template'() {
    need('WHATSAPP_TOKEN', 'WHATSAPP_WABA_ID');
    const r = await graph(`${WABA_ID}/message_templates`, { method: 'POST', body: TEMPLATE_DEFINITION });
    console.log(`Template "${TEMPLATE}" submitted: id ${r.id}, status ${r.status}, category ${r.category}`);
  },
  async status() {
    need('WHATSAPP_TOKEN', 'WHATSAPP_WABA_ID');
    const r = await graph(`${WABA_ID}/message_templates?name=${TEMPLATE}&fields=name,status,category,language,rejected_reason`);
    if (!r.data?.length) return console.log(`No template named "${TEMPLATE}" yet.`);
    for (const t of r.data) console.log(`${t.name} (${t.language}) · ${t.status} · ${t.category}${t.rejected_reason && t.rejected_reason !== 'NONE' ? ` · rejected: ${t.rejected_reason}` : ''}`);
  },
  async test() {
    need('WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID');
    const r = await sendTemplate(TEMPLATE, LANG, [
      { type: 'body', parameters: SAMPLE.map((text) => ({ type: 'text', text })) },
      { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: '919876543210' }] },
    ]);
    console.log(`Sample brief sent to +${TO} → message id`, r.messages?.[0]?.id);
  },
};

const cmd = process.argv[2];
if (!commands[cmd]) {
  console.log(`Usage: node scripts/whatsapp-setup.mjs <${Object.keys(commands).join(' | ')}>`);
  process.exit(cmd ? 1 : 0);
}
commands[cmd]().catch((e) => { console.error(`${cmd} failed: ${e.message}`); process.exit(1); });
