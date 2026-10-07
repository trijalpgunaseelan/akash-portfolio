# akshthetics.jpg: Akash M portfolio

A one-page portfolio for **Akash M** (@akshthetics.jpg), a Chennai photographer, videographer and content creator.
It's plain HTML, CSS and JS with no build step. It uses Akash's own brand colours (orange + electric blue from his Behance deck).

The Selected work section comes from his [Behance portfolio](https://www.behance.net/gallery/232862661/Akash-M-Portfolio).
Everything else (latest posts, archive, creator reels, stats, credits) is built from his
[Instagram](https://www.instagram.com/akshthetics.jpg/) and **updates itself**. See *Instagram auto-sync* below.

## Sections

| Section | What's there |
|---|---|
| Hero | Camera-viewfinder slideshow (REC, timecode, focus box) of his best stage shots |
| Stars in frame | Scrolling names: Ilaiyaraaja, Vijay, Yuvan, Samantha, Nayanthara, Nani, Karthi… |
| Stats | Most-liked post, total likes, events covered (computed from Instagram) |
| 01 Selected work | 5 Behance photo projects (49 photos) with a full-screen gallery |
| 02 Client works | Commissioned shoots: collabs with clients and "shot for @…" posts, with client filters |
| 03 Latest | The 10 newest work posts from Instagram, with NEW badges |
| 04 Archive | Every work post, filterable (concerts, film events, portraits, campus…) |
| 05 Services | Photography · Videography · Content & marketing, plus a 4-step process |
| 06 About | Portrait, bio, teams he's shot for, "on the job" photos |
| 07 Creator | His acting/creator reels, short film *Ignored.*, ranked by likes |
| 08 Credits | Every event, role and venue, grouped from Instagram + Behance |
| 09 Contact | WhatsApp, email, Instagram. One Send button delivers the brief to his WhatsApp and inbox |

Reels play inside the page (Instagram embed); photo posts open every frame in the gallery.

## Preview locally

The page loads `data/*.json`, so open it through a local server (not by double-clicking the file):

```bash
cd akash-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Instagram auto-sync

`.github/workflows/sync-instagram.yml` runs `scripts/sync-instagram.mjs` every 3 hours, so a new post shows up on the site within about 3 hours.
It reads Akash's public profile with no login or token, and then:

- adds new posts: every carousel image is downloaded to `assets/img/ig/<code>/` and the details go into `data/instagram.json`
- re-checks a slice of older posts each run (every post about once a day): refreshes likes, and
  **removes posts he deleted** once they're gone on two checks at least 6 hours apart
- keeps itself alive: GitHub stops schedules after 60 quiet days, so a long gap gets a tiny heartbeat commit

It all runs on GitHub's servers. No one's computer needs to be on.

Changes are committed to `main`, so a host that deploys from `main` (Netlify, Vercel, GitHub Pages) updates on its own.
To sync right now: GitHub → **Actions → Sync Instagram → Run workflow**, or locally:

```bash
npm ci --prefix scripts
node scripts/sync-instagram.mjs            # add --refresh-all to re-read every post
```

New posts get an automatic category and title. To polish one, add it to **`data/curation.json`**
(key = the code in `instagram.com/p/<code>/`):

```json
"DdjvAEMo7b5": { "category": "film", "title": "Paradise Press Meet", "who": "Nani",
                 "role": "Photography", "event": "Paradise · Press meet", "venue": "Taj Coromandel, Chennai" }
```

`category` is one of `concert` `film` `celebrity` `portrait` `campus` `brand` `creator` `personal`
(`personal` hides it). `featured: true` puts it first in the archive. The same file holds the
"Stars in frame" names and the credits that aren't on Instagram.

If Instagram ever blocks the sync or changes its pages, the workflow fails (GitHub emails the repo
owner) and the site keeps showing the last good data. To check a post from GitHub's side, run the
workflow with **probe** set to post codes; it reports live/gone and changes nothing.

## Contact & the one-click brief

Contact details: WhatsApp **+91 89393 31561**, email **ashthetics.jpg@gmail.com**, Instagram @akshthetics.jpg
(`CONTACT` in `js/main.js` and the contact section of `index.html`).

The shoot-brief form has one button: **Send to Akash**. The visitor presses it and stays on the page.
Two free deliveries run together, and the brief counts as sent if either one gets through:

- **WhatsApp:** `api/send-brief.js` (Vercel function) messages Akash's WhatsApp. It uses
  [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) (free) once `CALLMEBOT_APIKEY` is set in
  Vercel, or Meta's WhatsApp Cloud API with its free test number (`WHATSAPP_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID`,
  see [docs/whatsapp-setup.md](docs/whatsapp-setup.md)).
- **Email:** the page posts the brief to [FormSubmit](https://formsubmit.co) (free), which emails it to
  **ashthetics.jpg@gmail.com**. The very first brief triggers a one-time **Activate Form** email; click it once.
  (If the site moves to a new domain, FormSubmit asks for activation again.)

If both fail, the visitor sees a short "try again" message. Nobody is redirected to WhatsApp.
Spam guards: a hidden honeypot field, a minimum fill time, input limits, and 3 briefs per 10 minutes per visitor.

## Client works

Built automatically from the same Instagram data. A post counts as client work when it's a work post
(not creator/personal) and either:
- it's a **collab** with an account that isn't Akash's own, his editors or a fan page, or
- its **caption** says it was commissioned ("Shot for @…", "for team @…", "Team @…", "freelancing",
  "opportunity", "trusting me", "personal videographer").

Client names come from those accounts. `data/curation.json → clients` holds the not-a-client list and nice
display names. Per post, `"client": true/false` and `"clients": [...]` override the guess.

## Security

See [SECURITY.md](SECURITY.md) for how the site is locked down (strict security headers, origin-locked
API with rate limits, self-hosted fonts, hardened GitHub Actions) and how to report a problem privately.

## Before publishing

1. **Show Akash and get his OK.** The photos are his work ("no use without explicit permission" on Behance).
2. After deploying, change `og:image` in `index.html` to the full URL
   (e.g. `https://akash.netlify.app/assets/og.jpg`) so link previews show the share image.

## Deploy (free)

Pick a host that deploys from this GitHub repo, so every Instagram sync goes live by itself:

- **GitHub Pages:** repo Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel:** "Import from GitHub" and pick this repo (no build command, publish directory = root).

(Netlify Drop's drag-and-drop works too, but it won't pick up the automatic updates.)

## Editing content

- **Photo projects:** `PROJECTS` and `COUNTS` in `js/main.js`. Images live in
  `assets/img/work/<slug>/01.webp` (full, ≤1600px) and `01-t.webp` (thumb, ≤720px).
- **Instagram posts:** automatic. Edit titles/categories in `data/curation.json` (see above).
- **Bio, services, teams:** plain text in `index.html`.
- **Hero slideshow:** `SLIDES` in `js/main.js` (`f` = focus-box position in %).
