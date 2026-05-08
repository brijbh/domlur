import { useMemo, useRef, useState } from 'react'
import { PatternControls } from './components/controls/PatternControls.jsx'
import { ExportButtons } from './components/export/ExportButtons.jsx'
import { PatternPreview } from './components/preview/PatternPreview.jsx'
import { themes } from './data/themes.js'
import { shapes } from './data/shapes.js'
import { backgroundModes } from './data/backgroundModes.js'
import { borders } from './data/borders.js'
import { fontModes } from './data/fonts.js'
import { orientations } from './data/orientations.js'
import { densities } from './data/densities.js'
import { compositions } from './data/compositions.js'
import { flows } from './data/flows.js'
import { exportSizes } from './data/exportSizes.js'
import { fillStyles } from './data/fillStyles.js'
import { layoutModes } from './data/layoutModes.js'
import { presets } from './data/presets.js'
import { repeatModes } from './data/repeatModes.js'
import { renderingModes } from './data/renderingModes.js'
import { sizeMixes } from './data/sizeMixes.js'
import { generatePattern } from './engine/generatePattern.js'

const defaultSettings = {
  text: 'DOMLUR',
  shape: shapes[0].id,
  theme: themes[0].id,
  backgroundMode: 'theme',
  border: 'off',
  layout: 'fullBleed',
  fontMode: fontModes[0].id,
  orientation: orientations[0].id,
  preset: 'clean',
  density: 'balanced',
  composition: 'balanced',
  flow: 'free',
  rendering: 'clean',
  sizeMix: 'balanced',
  repeatMode: 'full',
  fillStyle: 'soft',
  exportSize: 'small',
  seed: 12345,
}

function createSeed() {
  if (window.crypto?.getRandomValues) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0]
  }

  return Date.now()
}

function createSeededRandom(seed) {
  let value = seed % 2147483647

  if (value <= 0) {
    value += 2147483646
  }

  return function random() {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function pickRandom(random, items) {
  return items[Math.floor(random() * items.length)]
}

function pickWeighted(random, options) {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0)
  let threshold = random() * totalWeight

  for (const option of options) {
    threshold -= option.weight

    if (threshold <= 0) {
      return option.value
    }
  }

  return options[options.length - 1].value
}

function App() {
  const [draftSettings, setDraftSettings] = useState(defaultSettings)
  const [patternSettings, setPatternSettings] = useState(defaultSettings)
  const svgRef = useRef(null)

  const pattern = useMemo(
    () =>
      generatePattern({
        ...patternSettings,
        theme: themes.find((theme) => theme.id === patternSettings.theme) ?? themes[0],
        fontMode:
          fontModes.find((mode) => mode.id === patternSettings.fontMode) ?? fontModes[0],
        density:
          densities.find((density) => density.id === patternSettings.density) ?? densities[1],
        border: borders.find((border) => border.id === patternSettings.border) ?? borders[0],
      }),
    [patternSettings],
  )

  const selectedExportSize =
    exportSizes.find((exportSize) => exportSize.id === draftSettings.exportSize) ?? exportSizes[0]

  function updateDraft(key, value) {
    setDraftSettings((settings) => ({
      ...settings,
      [key]: value,
    }))
  }

  function handlePresetSelect(presetId) {
    const preset = presets.find((item) => item.id === presetId)

    if (!preset) {
      return
    }

    const nextSettings = {
      ...draftSettings,
      ...preset.settings,
      preset: presetId,
      text: draftSettings.text.trim() || 'DOMLUR',
      seed: createSeed(),
    }

    setDraftSettings(nextSettings)
    setPatternSettings(nextSettings)
  }

  function handleGenerate(event) {
    event.preventDefault()
    setPatternSettings({
      ...draftSettings,
      text: draftSettings.text.trim() || 'DOMLUR',
      seed: createSeed(),
    })
  }

  function handleRegenerate() {
    setPatternSettings((settings) => ({
      ...settings,
      seed: createSeed(),
    }))
  }

  function handleSurprise() {
    const seed = createSeed()
    const random = createSeededRandom(seed)
    const presetId = pickWeighted(random, [
      { value: 'clean', weight: 1.1 },
      { value: 'poster', weight: 1.25 },
      { value: 'textile', weight: 1 },
      { value: 'minimal', weight: 0.85 },
      { value: 'chaos', weight: 0.8 },
    ])
    const preset = presets.find((item) => item.id === presetId) ?? presets[0]
    const nextSettings = {
      ...draftSettings,
      ...preset.settings,
      preset: presetId,
      text: draftSettings.text.trim() || 'DOMLUR',
      shape: pickRandom(random, shapes).id,
      theme: pickRandom(random, themes).id,
      backgroundMode: pickWeighted(random, [
        { value: 'theme', weight: 0.72 },
        { value: 'light', weight: 0.2 },
        { value: 'transparent', weight: 0.08 },
      ]),
      border: pickWeighted(random, [
        { value: 'off', weight: 0.7 },
        { value: 'thin', weight: 0.15 },
        { value: 'medium', weight: 0.1 },
        { value: 'bold', weight: 0.05 },
      ]),
      layout: random() < 0.38 ? pickRandom(random, layoutModes).id : preset.settings.layout,
      fontMode: pickRandom(random, fontModes).id,
      orientation: random() < 0.38 ? pickRandom(random, orientations).id : preset.settings.orientation,
      density: random() < 0.34 ? pickRandom(random, densities).id : preset.settings.density,
      composition: random() < 0.42 ? pickRandom(random, compositions).id : preset.settings.composition,
      flow: random() < 0.48 ? pickRandom(random, flows).id : preset.settings.flow,
      rendering: random() < 0.44 ? pickRandom(random, renderingModes).id : preset.settings.rendering,
      sizeMix: random() < 0.34 ? pickRandom(random, sizeMixes).id : preset.settings.sizeMix,
      repeatMode: random() < 0.28 ? pickRandom(random, repeatModes).id : preset.settings.repeatMode,
      fillStyle: random() < 0.34 ? pickRandom(random, fillStyles).id : preset.settings.fillStyle,
      seed,
    }

    if (presetId === 'chaos') {
      nextSettings.fillStyle = pickWeighted(random, [
        { value: 'bleed', weight: 0.72 },
        { value: 'edge', weight: 0.2 },
        { value: 'soft', weight: 0.08 },
      ])
    }

    if (presetId === 'minimal') {
      nextSettings.backgroundMode = pickWeighted(random, [
        { value: 'light', weight: 0.55 },
        { value: 'theme', weight: 0.4 },
        { value: 'transparent', weight: 0.05 },
      ])
    }

    setDraftSettings(nextSettings)
    setPatternSettings(nextSettings)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <img className="brand-logo" src="/logo.svg" alt="DOMLUR" />
        </div>
        <p>Turn words, names, quotes, and phrases into decorative text patterns.</p>
      </header>

      <div className="app-layout">
        <section className="preview-column" aria-label="Pattern preview and exports">
          <PatternPreview pattern={pattern} svgRef={svgRef} />
          <ExportButtons svgRef={svgRef} pattern={pattern} exportSize={selectedExportSize} />
        </section>

        <PatternControls
          settings={draftSettings}
          onChange={updateDraft}
          onGenerate={handleGenerate}
          backgroundModes={backgroundModes}
          borders={borders}
          themes={themes}
          shapes={shapes}
          fontModes={fontModes}
          orientations={orientations}
          densities={densities}
          compositions={compositions}
          flows={flows}
          fillStyles={fillStyles}
          layoutModes={layoutModes}
          exportSizes={exportSizes}
          presets={presets}
          sizeMixes={sizeMixes}
          repeatModes={repeatModes}
          renderingModes={renderingModes}
          onPresetSelect={handlePresetSelect}
          onRegenerate={handleRegenerate}
          onSurprise={handleSurprise}
        />
      </div>
    </main>
  )
}

export default App
