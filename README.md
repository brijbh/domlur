# DOMLUR

DOMLUR is a mobile-first text pattern builder for turning words, names, quotes, and phrases into decorative SVG typography patterns. It runs entirely in the browser and exports the generated pattern as a PNG.

Repository:
https://github.com/brijbh/domlur

## Current Features

- SVG pattern rendering with shape clipping
- Shape options: circle, triangle, diamond, square, and rectangle
- Five color themes with preview swatches
- Sans, serif, and combo font modes
- Horizontal, vertical, diagonal, and mixed orientation modes
- Pattern density control
- Text size mix control
- Full text, word, and letter repeat modes
- Seeded regeneration for stable previews until reshuffled
- Browser-only PNG export at 800 x 800 px
- Disabled Vector PDF coming-soon export state

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Static Hosting

DOMLUR is a static React + Vite app that is friendly to GitHub Pages hosting. It does not require authentication, a backend, or a database.
