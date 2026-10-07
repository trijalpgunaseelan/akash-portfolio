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
| 02 Latest | The 10 newest work posts from Instagram, with NEW badges |
| 03 Archive | Every work post, filterable (concerts, film events, portraits, campus…) |
| 04 Services | Photography · Videography · Content & marketing, plus a 4-step process |
| 05 About | Portrait, bio, teams he's shot for, "on the job" photos |
| 06 Creator | His acting/creator reels, short film *Ignored.*, ranked by likes |
| 07 Credits | Every event, role and venue, grouped from Instagram + Behance |
| 08 Contact | WhatsApp, email, Instagram. The brief form sends to his WhatsApp, copies for an Instagram DM, or emails |

Reels play inside the page (Instagram embed); photo posts open every frame in the gallery.

## Preview locally

The page loads `data/*.json`, so open it through a local server (not by double-clicking the file):

```bash
cd akash-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Instagram auto-sync

`.github/workflows/sync-instagram.yml` runs `scripts/sync-instagram.mjs` twice a day (06:00 and 18:00 IST).
It reads Akash's public profile with no login or token, and then:

- adds new posts: every carousel image is downloaded to `assets/img/ig/<code>/` and the details go into `data/instagram.json`
- refreshes like counts weekly
- removes posts he deletes

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

If Instagram ever blocks the sync, the workflow fails (GitHub emails the repo owner) and the site
keeps showing the last good data.

## Contact

Set at the top of `js/main.js` (`CONTACT`) and in the contact section of `index.html`:
WhatsApp **+91 89393 31561**, email **ashthetics.jpg@gmail.com**, Instagram @akshthetics.jpg.
"Send to Akash on WhatsApp" opens WhatsApp with the brief already typed to his number; the visitor taps Send.

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
