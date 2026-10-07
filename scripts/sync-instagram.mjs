#!/usr/bin/env node
/*
 * Sync Akash's public Instagram into the portfolio.
 *
 *   node scripts/sync-instagram.mjs                 new posts + weekly like/comment refresh
 *   node scripts/sync-instagram.mjs --refresh-all   re-read every post (likes, captions, media)
 *
 * Writes data/instagram.json and assets/img/ig/<code>/<n>.webp (+ -t.webp thumbnails).
 * Hand-written titles and categories live in data/curation.json and always win
 * over the automatic guesses stored here under `auto`.
 *
 * Works logged-out: it reads the same server-rendered data a browser gets, so no
 * Instagram account, token or app is needed. Exit code 2 = Instagram refused us.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const USERNAME = 'akshthetics.jpg';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_FILE = path.join(ROOT, 'data/instagram.json');
const IMG_DIR = 'assets/img/ig';
const STATS_EVERY_DAYS = 7;
const STATS_LATEST = 24;
const args = new Set(process.argv.slice(2));
const REFRESH_ALL = args.has('--refresh-all');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);

class Blocked extends Error {}

/* ── HTTP with a tiny cookie jar ─────────────────────────────────────── */
const jar = new Map();
const keepCookies = (res) => {
  for (const c of res.headers.getSetCookie?.() || []) {
    const kv = c.split(';')[0];
    const i = kv.indexOf('=');
    if (i > 0) jar.set(kv.slice(0, i).trim(), kv.slice(i + 1));
  }
};
const KIND_HEADERS = {
  document: {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'sec-fetch-dest': 'document', 'sec-fetch-mode': 'navigate', 'sec-fetch-site': 'none',
    'sec-fetch-user': '?1', 'upgrade-insecure-requests': '1',
  },
  api: {
    accept: '*/*', 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin',
    origin: 'https://www.instagram.com', referer: `https://www.instagram.com/${USERNAME}/`,
  },
  image: {
    accept: 'image/avif,image/webp,image/*,*/*;q=0.8', 'sec-fetch-dest': 'image',
    'sec-fetch-mode': 'no-cors', 'sec-fetch-site': 'cross-site', referer: 'https://www.instagram.com/',
  },
  // what a browser sends when another website shows an Instagram embed in an iframe
  embed: {
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'sec-fetch-dest': 'iframe', 'sec-fetch-mode': 'navigate', 'sec-fetch-site': 'cross-site',
    referer: 'https://trijalpgunaseelan.github.io/',
  },
};
async function http(url, { kind = 'document', method = 'GET', body, headers = {}, tries = 4 } = {}) {
  for (let t = 1; t <= tries; t++) {
    let res;
    try {
      res = await fetch(url, {
        method, body, redirect: 'follow',
        headers: {
          'user-agent': UA, 'accept-language': 'en-US,en;q=0.9',
          'sec-ch-ua': '"Chromium";v="141", "Not?A_Brand";v="8"', 'sec-ch-ua-mobile': '?0', 'sec-ch-ua-platform': '"macOS"',
          ...(kind !== 'image' && jar.size ? { cookie: [...jar].map(([k, v]) => `${k}=${v}`).join('; ') } : {}),
          ...KIND_HEADERS[kind], ...headers,
        },
      });
    } catch (e) {
      if (t === tries) throw e;
      await sleep(3000 * t);
      continue;
    }
    if (kind !== 'image') keepCookies(res);
    if (/\/accounts\/login|\/challenge\//.test(res.url)) throw new Blocked(`login wall at ${url}`);
    if (res.ok) return res;
    if (res.status === 429 || res.status >= 500) { await sleep(5000 * t); continue; }
    const text = await res.text().catch(() => '');
    if (res.status === 401 || res.status === 403) throw new Blocked(`${res.status} at ${url}: ${text.slice(0, 160)}`);
    throw new Error(`${res.status} at ${url}: ${text.slice(0, 160)}`);
  }
  throw new Blocked(`gave up on ${url} after ${tries} tries`);
}

/* fetch() forces "sec-fetch-mode: cors", and Instagram only fills its embed
 * widget for real iframe navigations, so embeds go through plain https. */
function rawGet(url, headers, redirects = 4) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { ...headers, 'accept-encoding': 'gzip, deflate' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects) {
        res.resume();
        resolve(rawGet(new URL(res.headers.location, url).href, headers, redirects - 1));
        return;
      }
      const enc = res.headers['content-encoding'];
      const body = enc === 'gzip' ? res.pipe(zlib.createGunzip()) : enc === 'deflate' ? res.pipe(zlib.createInflate()) : res;
      const chunks = [];
      body.on('data', (c) => chunks.push(c));
      body.on('end', () => resolve({ status: res.statusCode, url, text: Buffer.concat(chunks).toString('utf8') }));
      body.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error(`timeout at ${url}`)));
  });
}
async function embedGet(url, tries = 3) {
  const headers = {
    'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', ...KIND_HEADERS.embed,
  };
  for (let t = 1; t <= tries; t++) {
    const res = await rawGet(url, headers).catch((e) => ({ status: 0, error: e }));
    if (res.url && /\/accounts\/login|\/challenge\//.test(res.url)) throw new Blocked(`login wall at ${url}`);
    if (res.status === 200) return res.text;
    if (res.status === 401 || res.status === 403) throw new Blocked(`${res.status} at ${url}`);
    await sleep(4000 * t);
  }
  throw new Blocked(`gave up on ${url} after ${tries} tries`);
}

/* ── Server-rendered JSON helpers ────────────────────────────────────── */
function jsonBlobs(html) {
  const out = [];
  const re = /<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[1].length < 80) continue;
    try { out.push(JSON.parse(m[1])); } catch { /* not JSON we care about */ }
  }
  return out;
}
function findAll(obj, pred, acc = []) {
  if (obj && typeof obj === 'object') {
    if (!Array.isArray(obj) && pred(obj)) acc.push(obj);
    for (const v of Object.values(obj)) findAll(v, pred, acc);
  }
  return acc;
}
const parseCount = (s) => {
  if (!s) return null;
  const m = String(s).replace(/,/g, '').match(/([\d.]+)\s*([KkMm])?/);
  if (!m) return null;
  return Math.round(parseFloat(m[1]) * (m[2] ? (/k/i.test(m[2]) ? 1e3 : 1e6) : 1));
};

/* ── Instagram reads ─────────────────────────────────────────────────── */
async function loadProfile() {
  const html = await (await http(`https://www.instagram.com/${USERNAME}/`)).text();
  const lsd = html.match(/"LSD",\[\],\{"token":"([^"]+)"/)?.[1];
  const queryId = html.match(/"queryID":"(\d+)","variables":\{"first":12,"username"/)?.[1];
  const conn = jsonBlobs(html)
    .flatMap((b) => findAll(b, (o) => o.polaris_ordered_timeline_connection))
    .map((o) => o.polaris_ordered_timeline_connection)[0];
  if (!conn) throw new Blocked('profile page had no posts (layout changed or blocked)');
  const og = html.match(/<meta (?:property|name)="og:description" content="([^"]+)"/)?.[1] || '';
  const profile = {
    followers: parseCount(og.match(/([\d.,]+[KkMm]?) Followers/)?.[1]),
    following: parseCount(og.match(/([\d.,]+[KkMm]?) Following/)?.[1]),
    posts: parseCount(og.match(/([\d.,]+[KkMm]?) Posts/)?.[1]),
  };
  return { lsd, queryId, conn, profile };
}

async function nextPage(p, cursor) {
  if (!p.lsd || !p.queryId) throw new Blocked('missing lsd/queryId for pagination');
  const body = new URLSearchParams({
    av: '0', __user: '0', __a: '1', lsd: p.lsd, doc_id: p.queryId, server_timestamps: 'true',
    fb_api_req_friendly_name: 'PolarisLoggedOutDesktopWWWProfilePostsTabContentQuery',
    variables: JSON.stringify({ after: cursor, first: 12, username: USERNAME }),
  });
  const res = await http('https://www.instagram.com/api/graphql', {
    kind: 'api', method: 'POST', body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded', 'x-fb-lsd': p.lsd,
      'x-ig-app-id': '936619743392459', 'x-csrftoken': jar.get('csrftoken') || '',
    },
  });
  const text = (await res.text()).replace(/^for \(;;\);/, '');
  let json;
  try { json = JSON.parse(text); } catch { throw new Blocked(`pagination returned non-JSON: ${text.slice(0, 120)}`); }
  const conn = json?.data?.xig_user_by_username?.polaris_ordered_timeline_connection;
  if (!conn) throw new Blocked(`pagination returned no posts: ${text.slice(0, 160)}`);
  return conn;
}

async function listAllPosts(p) {
  const nodes = p.conn.edges.map((e) => e.node);
  let info = p.conn.page_info;
  while (info?.has_next_page) {
    await sleep(1500);
    const c = await nextPage(p, info.end_cursor);
    nodes.push(...c.edges.map((e) => e.node));
    info = c.page_info;
  }
  return nodes;
}

async function loadPost(code) {
  const html = await (await http(`https://www.instagram.com/p/${code}/`)).text();
  const media = jsonBlobs(html).flatMap((b) => findAll(b, (o) => o.code === code && 'taken_at' in o))[0];
  if (!media) throw new Blocked(`post ${code} had no media data`);
  return media;
}

/* ── Embed fallback ─────────────────────────────────────────────────────
 * Instagram sends cloud servers (like GitHub Actions) to a login wall, but it
 * serves its embed widget to everyone. The profile embed carries the 6 newest
 * posts in full; a post embed shows its current like count. */
async function loadProfileEmbed() {
  const html = await embedGet(`https://www.instagram.com/${USERNAME}/embed/`);
  const raw = html.match(/"contextJSON":"((?:[^"\\]|\\.)*)"/)?.[1];
  if (!raw) throw new Blocked('profile embed had no data');
  const ctx = JSON.parse(JSON.parse(`"${raw}"`)).context || {};
  const media = (ctx.graphql_media || []).map((g) => g.shortcode_media).filter(Boolean);
  if (!media.length) throw new Blocked('profile embed listed no posts');
  return {
    media,
    profile: { followers: parseCount(ctx.followers_count), posts: parseCount(ctx.posts_count) },
  };
}

async function likesFromEmbed(code) {
  const html = await embedGet(`https://www.instagram.com/p/${code}/embed/captioned/`);
  const m = html.match(/([\d,]+) likes?\b/);
  return m ? parseCount(m[1]) : null;
}

function fromEmbed(sm) {
  const caption = sm.edge_media_to_caption?.edges?.[0]?.node?.text || '';
  const type = sm.__typename === 'GraphSidecar' ? 'carousel'
    : sm.__typename === 'GraphVideo' || sm.is_video || sm.product_type === 'clips' ? 'reel' : 'photo';
  const items = sm.edge_sidecar_to_children?.edges?.map((e) => e.node) || [sm];
  const best = (n) => n.display_resources?.at(-1)?.config_width > 1000 ? n.display_resources.at(-1).src : n.display_url;
  const location = sm.location?.name || null;
  return {
    record: {
      code: sm.shortcode,
      type,
      takenAt: new Date(sm.taken_at_timestamp * 1000).toISOString(),
      caption,
      likes: sm.like_and_view_counts_disabled ? null : sm.edge_liked_by?.count ?? sm.edge_media_preview_like?.count ?? null,
      comments: sm.edge_media_to_comment?.count ?? sm.edge_media_preview_comment?.count ?? null,
      location,
      coauthors: (sm.coauthor_producers || []).map((u) => u.username).filter((u) => u && u !== USERNAME),
      tagged: (sm.edge_media_to_tagged_user?.edges || []).map((e) => e.node?.user?.username).filter(Boolean),
      auto: { category: autoCategory(caption, type), title: autoTitle(caption, location) },
    },
    sources: items.map((n) => ({ url: best(n), video: !!n.is_video })).filter((s) => s.url),
  };
}

async function syncViaEmbed(db, known, statsDue) {
  const { media, profile } = await loadProfileEmbed();
  log(`Embed mode: profile embed lists the ${media.length} newest posts.`);
  let added = 0;
  for (const sm of media) {
    const { record, sources } = fromEmbed(sm);
    const old = known.get(record.code);
    if (old) {
      // fresh numbers for recent posts come with the embed for free
      known.set(record.code, { ...old, likes: record.likes ?? old.likes, comments: record.comments ?? old.comments });
      continue;
    }
    record.media = await saveImages(record.code, sources);
    known.set(record.code, record);
    added++;
    log(`  + ${record.code} ${record.type} ${record.takenAt.slice(0, 10)} [${record.auto.category}] ${record.auto.title}`);
  }
  if (statsDue) {
    const listed = new Set(media.map((m) => m.shortcode));
    const recent = [...known.values()].sort((a, b) => b.takenAt.localeCompare(a.takenAt))
      .filter((p) => !listed.has(p.code)).slice(0, STATS_LATEST);
    log(`Refreshing likes on ${recent.length} older posts…`);
    for (const p of recent) {
      try {
        const likes = await likesFromEmbed(p.code);
        if (likes != null) known.set(p.code, { ...p, likes });
      } catch (e) {
        if (e instanceof Blocked) throw e;
        console.warn(`  ! ${p.code}: ${e.message}`);
      }
      await sleep(1200);
    }
  }
  return { added, removed: [], profile };
}

/* ── Turning a media object into our record ──────────────────────────── */
const TYPE = { 1: 'photo', 2: 'reel', 8: 'carousel' };
function mediaSources(m) {
  const items = m.carousel_media?.length ? m.carousel_media : [m];
  return items.map((it) => ({
    url: it.image_versions2?.candidates?.[0]?.url || it.display_uri,
    video: it.media_type === 2 || !!it.video_versions,
  })).filter((it) => it.url);
}

async function saveImages(code, sources) {
  const dir = path.join(ROOT, IMG_DIR, code);
  await mkdir(dir, { recursive: true });
  const out = [];
  for (const [i, s] of sources.entries()) {
    const n = i + 1;
    const full = `${IMG_DIR}/${code}/${n}.webp`;
    const thumb = `${IMG_DIR}/${code}/${n}-t.webp`;
    let w, h;
    if (existsSync(path.join(ROOT, full)) && existsSync(path.join(ROOT, thumb))) {
      ({ width: w, height: h } = await sharp(path.join(ROOT, full)).metadata());
    } else {
      const buf = Buffer.from(await (await http(s.url, { kind: 'image' })).arrayBuffer());
      const img = sharp(buf).rotate();
      const info = await img.clone()
        .resize({ width: 1280, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 78 }).toFile(path.join(ROOT, full));
      await img.clone()
        .resize({ width: 480, height: 600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 70 }).toFile(path.join(ROOT, thumb));
      ({ width: w, height: h } = info);
      await sleep(250);
    }
    out.push({ src: full, thumb, w, h, ...(s.video ? { video: true } : {}) });
  }
  return out;
}

/* ── Automatic category + title for posts nobody has curated yet ─────── */
const RULES = [
  ['film', /pre[\s-]?release|audio launch|press meet|success meet|pre[\s-]?launch|trailer launch|teaser launch|premie?re|first look/i],
  ['celebrity', /wedding|reception|engagement|sangeet/i],
  ['concert', /concert|live in|musical night|\blive\b.*(show|night)|music|maestro|isaignani|homecoming|#gig/i],
  ['brand', /promotion|promo video|collection|launching our|brand|product shoot|#ad\b/i],
  ['portrait', /portrait|photoshoot|shot (this )?for|shot by @akshthetics/i],
  ['campus', /citchennai|takshashila|immerse_cit|saarang|college|campus|symposium|culturals/i],
  ['creator', /#contentcreator|#actor|vc\s*:-|short film|reelsinstagram/i],
];
function autoCategory(caption, type) {
  const text = caption || '';
  if (/\bpc\s*:-/i.test(text) && !/shot by @akshthetics/i.test(text)) return 'personal';
  for (const [cat, re] of RULES) if (re.test(text)) return cat;
  return type === 'reel' ? 'creator' : 'personal';
}
function autoTitle(caption, location) {
  const text = caption || '';
  // "…at the Mandaadi Audio Launch" → "Mandaadi Audio Launch": the capitalised
  // words (up to three) right before an event phrase name the event.
  const ev = text.match(/pre[\s-]?release|audio launch|press meet|success meet|pre[\s-]?launch|premiere|concert/i);
  if (ev) {
    const before = text.slice(0, ev.index).replace(/[@#][\w.]+/g, ' ').trim().split(/\s+/).slice(-3);
    const name = [];
    for (let i = before.length - 1; i >= 0; i--) {
      const w = before[i].replace(/[^\p{L}\p{N}'’&-]/gu, '');
      if (!/^(\p{Lu}|\d)/u.test(w)) break;
      name.unshift(w.replace(/['’]s$/, ''));
    }
    if (name.length) return `${name.join(' ')} ${ev[0].toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}`;
  }
  const clean = text.split('\n')[0]
    .replace(/[@#][\w.]+/g, '')
    .replace(/[^\p{L}\p{N}\s'’&.,:!?-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = clean.split(' ').slice(0, 6).join(' ').replace(/[.,:!?'’-]+$/, '');
  return words || location || 'New post';
}

function toRecord(m, node, media) {
  const caption = m.caption?.text ?? node?.caption?.text ?? '';
  const type = TYPE[m.media_type] || 'photo';
  const location = m.location?.name || null;
  return {
    code: m.code,
    type,
    takenAt: new Date(m.taken_at * 1000).toISOString(),
    caption,
    likes: m.like_and_view_counts_disabled ? null : m.like_count ?? null,
    comments: m.comment_count ?? null,
    location,
    coauthors: (m.coauthor_producers || []).map((u) => u.username).filter((u) => u && u !== USERNAME),
    tagged: (m.usertags?.in || []).map((t) => t.user?.username).filter(Boolean),
    media,
    auto: { category: autoCategory(caption, type), title: autoTitle(caption, location) },
  };
}

/* Full mode: the profile page + paginated listing + each post page.
 * Works from home/office connections; also detects deleted posts. */
async function syncViaProfile(known, statsDue) {
  if (process.env.IG_FORCE_EMBED) throw new Blocked('IG_FORCE_EMBED is set');
  const prof = await loadProfile();
  const nodes = await listAllPosts(prof);
  log(`Profile lists ${nodes.length} posts (${known.size} already in data).`);

  // Posts that disappeared from Instagram are removed from the site too, but only
  // when the listing looks complete, so a short read never wipes the archive.
  const listed = new Set(nodes.map((n) => n.code));
  const complete = prof.profile.posts ? nodes.length >= prof.profile.posts - 2 : nodes.length > 12;
  const removed = complete ? [...known.keys()].filter((c) => !listed.has(c)) : [];
  for (const code of removed) {
    known.delete(code);
    await rm(path.join(ROOT, IMG_DIR, code), { recursive: true, force: true });
    log(`  removed ${code} (deleted on Instagram)`);
  }

  const newest = nodes.slice(0, STATS_LATEST).map((n) => n.code);
  const toFetch = nodes.filter((n) => !known.has(n.code) || REFRESH_ALL || (statsDue && newest.includes(n.code)));
  log(`Fetching ${toFetch.length} post page(s)…`);

  let added = 0;
  for (const node of toFetch) {
    const old = known.get(node.code);
    try {
      const m = await loadPost(node.code);
      const media = old && !REFRESH_ALL ? old.media : await saveImages(node.code, mediaSources(m));
      const rec = toRecord(m, node, media);
      if (old?.auto && !REFRESH_ALL) rec.auto = old.auto; // keep earlier guesses stable
      known.set(node.code, rec);
      if (!old) { added++; log(`  + ${node.code} ${rec.type} ${rec.takenAt.slice(0, 10)} [${rec.auto.category}] ${rec.auto.title}`); }
    } catch (e) {
      if (e instanceof Blocked) throw e;
      console.warn(`  ! ${node.code}: ${e.message}`);
    }
    await sleep(1200);
  }
  return { added, removed, profile: prof.profile };
}

/* ── Main ────────────────────────────────────────────────────────────── */
async function main() {
  const db = existsSync(DATA_FILE)
    ? JSON.parse(await readFile(DATA_FILE, 'utf8'))
    : { username: USERNAME, profile: {}, statsUpdatedAt: null, posts: [] };
  const before = JSON.stringify(db.posts) + JSON.stringify(db.profile);
  const known = new Map(db.posts.map((p) => [p.code, p]));

  const statsDue = REFRESH_ALL || !db.statsUpdatedAt ||
    Date.now() - Date.parse(db.statsUpdatedAt) > STATS_EVERY_DAYS * 864e5;

  log(`Reading @${USERNAME}…`);
  let result;
  try {
    result = await syncViaProfile(known, statsDue);
  } catch (e) {
    if (!(e instanceof Blocked)) throw e;
    log(`Profile page blocked (${e.message}); falling back to the public embed.`);
    result = await syncViaEmbed(db, known, statsDue);
  }
  const { added, removed, profile } = result;

  db.username = USERNAME;
  db.profile = { ...db.profile, ...Object.fromEntries(Object.entries(profile).filter(([, v]) => v != null)) };
  db.posts = [...known.values()].sort((a, b) => b.takenAt.localeCompare(a.takenAt));
  if (statsDue) db.statsUpdatedAt = new Date().toISOString();

  const changed = JSON.stringify(db.posts) + JSON.stringify(db.profile) !== before;
  if (changed) {
    db.updatedAt = new Date().toISOString();
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(db, null, 1) + '\n');
  }
  log(changed ? `Saved: ${added} new, ${removed.length} removed, ${db.posts.length} total.` : 'No changes.');
  if (process.env.GITHUB_OUTPUT) {
    await writeFile(process.env.GITHUB_OUTPUT, `added=${added}\nremoved=${removed.length}\nchanged=${changed}\n`, { flag: 'a' });
  }
}

main().catch((e) => {
  console.error(e instanceof Blocked ? `Instagram refused the request: ${e.message}` : e);
  process.exit(e instanceof Blocked ? 2 : 1);
});
