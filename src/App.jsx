import { useMemo, useRef, useState } from 'react'
import { PatternControls } from './components/controls/PatternControls.jsx'
import { ExportButtons } from './components/export/ExportButtons.jsx'
import { PatternPreview } from './components/preview/PatternPreview.jsx'
import { themes } from './data/themes.js'
import { shapes } from './data/shapes.js'
import { fontModes } from './data/fonts.js'
import { orientations } from './data/orientations.js'
import { densities } from './data/densities.js'
import { repeatModes } from './data/repeatModes.js'
import { sizeMixes } from './data/sizeMixes.js'
import { generatePattern } from './engine/generatePattern.js'

const defaultSettings = {
  text: 'DOMLUR',
  shape: shapes[0].id,
  theme: themes[0].id,
  fontMode: fontModes[0].id,
  orientation: orientations[0].id,
  density: 'balanced',
  sizeMix: 'balanced',
  repeatMode: 'full',
  seed: 12345,
}

function createSeed() {
  if (window.crypto?.getRandomValues) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0]
  }

  return Date.now()
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
      }),
    [patternSettings],
  )

  function updateDraft(key, value) {
    setDraftSettings((settings) => ({
      ...settings,
      [key]: value,
    }))
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
          <ExportButtons svgRef={svgRef} pattern={pattern} />
        </section>

        <PatternControls
          settings={draftSettings}
          onChange={updateDraft}
          onGenerate={handleGenerate}
          themes={themes}
          shapes={shapes}
          fontModes={fontModes}
          orientations={orientations}
          densities={densities}
          sizeMixes={sizeMixes}
          repeatModes={repeatModes}
          onRegenerate={handleRegenerate}
        />
      </div>
    </main>
  )
}

export default App
