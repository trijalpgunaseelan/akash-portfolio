# akshthetics.jpg: Akash M portfolio

A one-page portfolio for **Akash M** (@akshthetics.jpg), a Chennai photographer, videographer and content creator.
It's plain HTML, CSS and JS with no build step. It uses Akash's own brand colours (orange + electric blue from his Behance deck).

Content was taken from his [Behance portfolio](https://www.behance.net/gallery/232862661/Akash-M-Portfolio)
and [Instagram](https://www.instagram.com/akshthetics.jpg/) on 7 Oct 2026.

## Sections

| Section | What's there |
|---|---|
| Hero | Camera-viewfinder slideshow (REC, timecode, focus box) of his best stage shots |
| Stars in frame | Scrolling names: Ilaiyaraaja, Vijay, Yuvan, Samantha, Nayanthara, Nani, Karthi… |
| Stats | 3.2L likes on one reel, 5.5L+ across recent posts, 12+ events |
| Work | 5 photo projects (49 photos) with a full-screen gallery (keyboard + swipe) |
| Reels | Instagram reels/posts; tapping one plays the real post in a pop-up |
| Services | Photography · Videography · Content & marketing, plus a 4-step process |
| About | Portrait, bio, his own quote, "on the job" photos with celebrities |
| Credits | Every event, role and venue |
| Contact | Shoot-brief form that copies the brief and opens his Instagram DM |

## Preview locally

```bash
cd akash-portfolio
python3 -m http.server 8000
# open http://localhost:8000
```

## Before publishing

1. **Show Akash and get his OK.** The photos are his work ("no use without explicit permission" on Behance).
2. **Add his email / WhatsApp** (optional): edit `CONTACT` at the top of `js/main.js`.
   Each one switches on its own button in the contact form.
3. After deploying, change `og:image` in `index.html` to the full URL
   (e.g. `https://akash.netlify.app/assets/og.jpg`) so link previews show the share image.

## Deploy (free)

- **Netlify:** drag the `akash-portfolio` folder onto <https://app.netlify.com/drop>.
- **GitHub Pages:** push the folder to a repo → Settings → Pages → deploy from `main` / root.
- **Vercel:** `npx vercel` inside the folder.

## Editing content

- **Photo projects:** `PROJECTS` and `COUNTS` in `js/main.js`. Images live in
  `assets/img/work/<slug>/01.webp` (full, ≤1600px) and `01-t.webp` (thumb, ≤720px).
- **Reels / posts:** `REELS` in `js/main.js` uses the code from the Instagram URL
  (`instagram.com/p/<code>/`). The thumbnail is `assets/img/ig/<code>.webp`.
- **Credits list, bio, services:** plain text in `index.html`.
- **Hero slideshow:** `SLIDES` in `js/main.js` (`f` = focus-box position in %).
