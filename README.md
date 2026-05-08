# DOMLUR

DOMLUR is a mobile-first text pattern builder for turning words, names, quotes, and phrases into decorative SVG typography patterns. It runs entirely in the browser and exports the generated pattern as a PNG.

Repository:
https://github.com/brijbh/domlur

## Current Features

- SVG pattern rendering with shape clipping
- Shape options: circle, triangle, diamond, square, rectangle, heart, star, hexagon, badge, arch, speech bubble, and leaf
- Five color themes with preview swatches
- Sans, serif, and combo font modes
- Horizontal, vertical, diagonal, and mixed orientation modes
- Pattern density control
- Composition modes: Balanced, Diagonal, Burst, Edge, and Asymmetric
- Text size mix control
- Creative pattern presets: Clean, Poster, Textile, Minimal, and Chaos
- Fill styles for Soft, Edge, and Bleed pattern behavior
- Background modes for theme, light paper, and transparent output
- Export sizes from 800 x 800 px through 3200 x 3200 px
- Icon-based orientation and density controls
- Icon-based export size control
- Accordion-based control organization for a shorter sidebar
- Mobile-first preview layout with sticky creative actions
- Full text, word, and letter repeat modes
- Seeded regeneration for stable previews until reshuffled
- Surprise Me action for randomized creative settings
- Browser-only PNG export with transparent PNG support
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

## Creative Controls

Pattern presets update density, composition, size mix, orientation, repeat mode, and fill style as a creative starting point. They do not lock the controls, so each setting can still be tweaked manually after choosing a preset.

Composition modes control the spatial arrangement of the pattern. Balanced keeps an even layout, Diagonal creates directional movement, Burst builds from a central focal point, Edge emphasizes the silhouette, and Asymmetric creates a stronger editorial imbalance.

Fill styles control how typography occupies the selected shape. Soft keeps the pattern calmer with more whitespace, Edge emphasizes the outer silhouette, and Bleed pushes type past the shape boundary so the SVG clip path creates a poster-like crop.

Orientation and density use compact icon controls to keep the panel lighter while preserving accessible labels and help text.

Background modes control whether the SVG uses the selected theme background, a light paper background, or no background for transparent PNG export. Export size controls PNG resolution while the SVG design coordinate system remains 800 x 800.

The control panel is organized into Content, Shape, Style, Pattern, and Export accordion sections. On desktop, the controls scroll inside the panel while the main preview remains visible.

Surprise Me keeps the entered text and randomizes the creative controls with weighted combinations for usable minimal, textile, poster, clean, and experimental outputs.

## Static Hosting

DOMLUR is a static React + Vite app that is friendly to GitHub Pages hosting. It does not require authentication, a backend, or a database.
