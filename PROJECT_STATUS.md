---
app: domlur
status: paused
updated: 2026-05-09
repo: https://github.com/brijbh/domlur
---

## Summary
DOMLUR is a mobile-first, browser-only React + Vite app that turns words, names, quotes, and phrases into decorative SVG typography patterns (shape clipping, themes, flow fields, composition/rendering modes) and exports them as PNG.

## Tech stack
- JavaScript (React 19, JSX — no TypeScript compilation, despite `@types/react` dev deps for editor support)
- Vite 8 (dev server/build), `@vitejs/plugin-react`
- ESLint 10 with `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh`
- No backend/auth — static client-only app; README notes it's friendly to GitHub Pages hosting, though no deploy config is present yet

## Run locally
```
npm install
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # eslint
```

## Recent progress
- Built out a large creative feature set: 12 shape options, 5 color themes, multiple orientation/composition/flow-field/rendering/layout modes, seeded regeneration, a "Surprise Me" randomizer, and PNG export up to 3200x3200.
- Fixed a layout-mode pattern rendering regression.
- Added SEO/social sharing metadata and an official Open Graph preview image (most recent commits).
- No backend/auth — static React + Vite app, README notes it's "friendly to GitHub Pages hosting."

## Next up
- Vector PDF export exists in the UI as a disabled "coming soon" state — not yet implemented.
- No CI/deploy config (no `.github` workflows, no vercel/netlify config) found, so it isn't confirmed live anywhere despite being deploy-ready.

## Blockers
No activity since the last commit (2026-05-09, ~3 months ago) — looks stalled rather than actively worked on.
