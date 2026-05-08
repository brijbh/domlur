You are working inside the DOMLUR project.

Project path:
C:\dev\domlur

Current state:
This is a fresh React + Vite app. The browser is still showing the default Vite “Get started” screen, which means the starter app has not yet been replaced with the DOMLUR app UI and logic.

Goal:
Build the first working version of DOMLUR.

DOMLUR is a mobile-first text pattern builder. It is a static app that will be hosted on GitHub Pages. It must not require authentication, a backend, or a database.

Core user flow:
1. User enters text in a textbox.
2. User selects a shape:
   - Circle
   - Triangle
   - Diamond
   - Square
   - Rectangle
3. User selects a color theme made of 5 colors.
4. User selects font family mode:
   - Sans Only
   - Serif Only
   - Sans + Serif Combo
5. User selects text orientation:
   - Horizontal
   - Vertical
   - Diagonal
   - All
6. User clicks Generate Pattern.
7. The app generates a text pattern using the entered text and selected settings.
8. User can download a PNG.
9. Vector PDF export is premim version and should appear as a disabled / “Coming soon” premium feature.

Important:
Do not add authentication.
Do not add a database.
Do not add paid integration yet.
Do not add routing.
Do not add unnecessary libraries unless required.
Use SVG as the rendering engine.
The app should work fully in the browser.
The app should be mobile-first but should also look good on desktop.

Please replace the default Vite starter UI completely.

Expected implementation:
Create or update the following structure as needed:
If these folders or files do not exist, create them.

src/
  App.jsx
  main.jsx
  styles/
    main.css
  data/
    themes.js
    shapes.js
    fonts.js
    orientations.js
  components/
    controls/
      PatternControls.jsx
    preview/
      PatternPreview.jsx
    export/
      ExportButtons.jsx
  engine/
    generatePattern.js
    exportUtils.js

Design direction:
The UI should feel clean, modern, warm, creative, and mobile-first.

Visual tone:
- Warm off-white / paper-like background
- Saffron/orange as primary accent
- Dark navy or charcoal for strong actions
- Rounded cards
- Soft shadows
- Clean form controls
- Large readable preview area

Suggested colors:
- Primary saffron: #FF6633
- Blue accent: #22AAFF
- Deep navy: #12355B
- Warm background: #F6EFE7
- Card background: rgba(255, 255, 255, 0.86)
- Soft border: rgba(70, 45, 20, 0.12)

Layout:
Desktop:
- Two-column layout
- Left column: controls
- Right column: preview + export buttons

Mobile:
- Preview should appear first
- Controls should appear below
- Export buttons should stack full width

App header / branding:
Use:
DOMLUR

Subtitle:
Text Pattern Builder

Intro text:
Turn words, names, quotes, and phrases into decorative text patterns.

Controls:
Text input:
- Use a textarea
- Placeholder: “Enter a word, name, quote, or phrase”
- Default text: DOMLUR
- Max length: 35 characters | Premium version will have 100

Shape selector:
- Circle
- Triangle
- Diamond
- Square
- Rectangle

Color themes:
Create at least these five themes in src/data/themes.js:

1. Saffron Sky
colors:
#FF6633
#FFB347
#FFF3D6
#22AAFF
#12355B

2. Earth Clay
colors:
#7C4A33
#B87333
#E6C79C
#3A2D28
#F8F1E7

3. Indigo Ink
colors:
#1E1B4B
#3730A3
#6366F1
#C7D2FE
#F8FAFC

4. Festival Bright
colors:
#FF3D00
#FFCA28
#00BFA5
#7C4DFF
#FFFFFF

5. Minimal Mono
colors:
#111111
#444444
#888888
#DDDDDD
#FFFFFF

Show a small five-dot / five-pill preview of the selected color theme.

Font family modes:
- Sans Only: Inter, Arial, Helvetica, sans-serif
- Serif Only: Georgia, Times New Roman, serif
- Sans + Serif Combo: Inter, Georgia, serif

Text orientation:
- Horizontal
- Vertical
- Diagonal
- All

Buttons:
Primary button:
Generate Pattern

Export buttons:
- Download PNG
- Vector PDF — Coming Soon

The PDF button should be disabled for now.

Pattern rendering:
Use SVG.

The pattern engine should:
1. Create an 800 x 800 SVG coordinate system.
2. Create a grid of candidate points.
3. Check whether each point is inside the selected shape.
4. Render the user text repeatedly at valid points.
5. Rotate text according to orientation.
6. Cycle colors from the selected theme.
7. Cycle fonts according to selected font family mode.
8. Use readable bold text.
9. Use the fifth color in the selected theme as the background color.

Shape logic:
Circle:
A point is inside when it falls within radius.

Square:
A centered square.

Rectangle:
A centered wide rectangle.

Diamond:
Use abs(dx) + abs(dy) <= limit.

Triangle:
Use a simple centered triangle where width increases from top to bottom.

Text orientation logic:
Horizontal:
rotation 0

Vertical:
rotation 90

Diagonal:
rotation -35

All:
cycle through 0, 90, -35, 35

PNG export:
Implement browser-only PNG export:
1. Serialize SVG.
2. Draw it to a canvas.
3. Export canvas as PNG.
4. Trigger download as domlur-pattern.png.

The PNG export should work from the rendered SVG preview.

Files to update:
Replace the default src/App.jsx completely.
Replace default styling completely.
Remove unused default Vite CSS imports if needed.
Make sure src/main.jsx imports the correct CSS or App CSS path.

Important code-quality requirements:
- Keep the code simple and readable.
- Use React functional components.
- Avoid over-engineering.
- Keep rendering logic inside src/engine/generatePattern.js.
- Keep export logic inside src/engine/exportUtils.js.
- Keep data arrays in src/data.
- Add helpful console.error only for export failure.
- Ensure npm run build succeeds.

Also update README.md:
Include:
- DOMLUR description
- How to run locally
- How to build
- Note that it is a static GitHub Pages-friendly app
- Note that no auth or database is required

After implementing:
Run:
npm run build

Fix any errors until the build passes.

Final response:
Summarize changed files.
Mention whether npm run build passed.
Do not redesign beyond the requested scope.
Do not add backend/payment integration.