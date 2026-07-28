# Vimal Yadav — Portfolio

Zero-dependency static site. No build step, no npm install needed.

## Files
- `index.html` — structure & content
- `style.css` — design system (blue/cyan glassmorphism, dark theme)
- `script.js` — loader, hero animation, scroll reveals, counters, project modals, canvas background

## Deploy — pick one

**Netlify Drop (fastest)**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page
3. Live in ~10 seconds

**GitHub Pages**
1. Push these 3 files to a repo (e.g. `vimal9125/portfolio`)
2. Repo → Settings → Pages → Source: `main` branch, `/root`
3. Site goes live at `https://vimal9125.github.io/portfolio`

## Before you publish
- [x] Resume PDF added (`resume.pdf`) — both Resume buttons download it directly
- [x] Real profile photo added (`profile.jpg`) in the About section
- [x] Favicon + app icons added (VY monogram, matches brand gradient)
- [x] Open Graph / Twitter share image added (`og-image.jpg`) — shows a rich preview when the link is shared on LinkedIn/WhatsApp
- [x] Live GitHub stats wired up (languages, repo count, followers, contribution heatmap) — pulls from the public GitHub API on page load, with a graceful "sample data" fallback badge if the API is unreachable
- [x] Certificate gallery with all 22 certificates, real PDF thumbnails
- [x] Copy-to-clipboard toast on email/phone click
- [ ] Double-check project links (GitHub repo URLs currently point to your GitHub profile root — link directly to each repo once they're public)
- [ ] **Real project screenshots** — project cards currently use stylized sparkline mockups, not actual screenshots. Swap in real dashboard/app screenshots or a short GIF once you have them (biggest remaining credibility boost for recruiters)
- [ ] **og:image absolute URL** — once deployed, update `og:image` / `twitter:image` in `index.html` to the full URL (e.g. `https://yourdomain.com/og-image.jpg`) — some platforms (iMessage, Slack) require an absolute URL, relative won't always work
- [ ] Optional: add a testimonial/recommendation if you have a quote from your Cognifyz manager or a LinkedIn recommendation — didn't fabricate one since it needs to be real

## Notes on live GitHub data
Language %, repo count, followers, and the contribution heatmap are fetched live from `api.github.com` and a community contributions API when the page loads. This needs the site to be served over `http(s)` — opening `index.html` directly via `file://` will show the "sample" fallback badge instead (browsers block that fetch locally). Once deployed to Netlify/GitHub Pages it'll show "live".

## Notes
- Fonts load from Google Fonts + Fontshare CDN — needs internet on first load, then cached.
- Respects `prefers-reduced-motion`.
- Fully responsive down to mobile (burger menu under 720px).
