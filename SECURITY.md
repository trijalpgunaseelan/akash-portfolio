# Security

Found a security problem with this site or repository? Please report it privately through
**[GitHub's private vulnerability reporting](https://github.com/trijalpgunaseelan/akash-portfolio/security/advisories/new)**
rather than opening a public issue.

## How the site is protected

- **Static site, no logins, no database.** There is no admin panel or password to steal.
- **Strict browser security headers** (`vercel.json`):
  - a Content-Security-Policy that only allows the site's own scripts, styles, fonts and images, Instagram embeds and the form's email relay
  - no framing by other sites (clickjacking)
  - no MIME sniffing
  - a tight referrer policy and disabled device permissions
- **Self-hosted fonts.** The page loads no third-party scripts or styles.
- **Untrusted data is escaped.** Instagram captions, names and paths are escaped and shape-checked before they reach the page.
- **The brief endpoint (`api/send-brief.js`)** only accepts JSON `POST`s from the site's own domain. It has size limits, a honeypot, and per-visitor, per-number and hourly rate limits. Its WhatsApp keys live in Vercel environment variables, never in the code.
- **Only the website is deployed.** `.vercelignore` keeps scripts, docs and workflows off the live site.
- **GitHub Actions:**
  - least-privilege permissions and actions pinned to commit SHAs
  - workflow inputs are passed as data
  - `npm ci --ignore-scripts`, and the Instagram sync only downloads images from Instagram's CDN
- **Repository:**
  - force-pushes and deletion of `main` are blocked
  - secret scanning with push protection is on
  - Dependabot security alerts and fixes are on
