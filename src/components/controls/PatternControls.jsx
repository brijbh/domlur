import { useState } from 'react'

function ThemeDots({ colors }) {
  return (
    <span className="theme-dots" aria-hidden="true">
      {colors.map((color) => (
        <span key={color} style={{ backgroundColor: color }} />
      ))}
    </span>
  )
}

const orientationIcons = {
  horizontal: '/horizontal.svg',
  vertical: '/verticle.svg',
  diagonal: '/diagonal.svg',
  all: '/all.svg',
}

const densityIcons = {
  sparse: '/sparse.svg',
  balanced: '/balanced.svg',
  dense: '/dense.svg',
  max: '/max.svg',
}

const exportSizeIcons = {
  small: '/small.svg',
  medium: '/medium.svg',
  large: '/large.svg',
  ultra: '/ultra.svg',
}

const helpText = {
  shape: 'Choose the outer shape that the text pattern will fill.',
  preset: 'Applies a ready-made creative style. You can still adjust the controls after selecting one.',
  theme: 'Chooses the five-color palette used for text and background.',
  background: 'Controls whether the pattern uses the theme background, a light paper background, or transparent export.',
  fontStyle: 'Changes the type style used in the pattern.',
  orientation: 'Controls the direction and rotation of repeated text.',
  density: 'Controls how tightly text fills the selected shape.',
  composition: 'Controls the overall spatial arrangement and visual flow of the generated pattern.',
  flow: 'Controls the directional movement and rhythm of the generated typography pattern.',
  sizeMix: 'Controls how much variation appears between small, medium, and large text.',
  repeat: 'Controls whether the pattern repeats the full text, individual words, or letters.',
  fillStyle: 'Controls how the pattern uses the shape boundary: soft, edge-focused, or clipped bleed.',
  exportSize: 'Controls the PNG export resolution. Larger sizes create higher-quality images.',
}

function SectionLabel({ label, help }) {
  return (
    <span className="section-label">
      <span>{label}</span>
      <button type="button" className="help-dot" aria-label={`${label} help`}>
        ?
      </button>
      <span className="tooltip" role="tooltip">
        {help}
      </span>
    </span>
  )
}

function AccordionSection({ id, title, isOpen, onToggle, children }) {
  const panelId = `${id}-panel`

  return (
    <section className={`accordion-section ${isOpen ? 'accordion-section-open' : ''}`}>
      <button
        type="button"
        className="accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="accordion-chevron" aria-hidden="true">
          {isOpen ? '-' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="accordion-panel" id={panelId}>
          {children}
        </div>
      )}
    </section>
  )
}

function ShapeIcon({ shapeId }) {
  if (shapeId === 'circle') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="10" />
      </svg>
    )
  }

  if (shapeId === 'triangle') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <polygon points="16,5 28,27 4,27" />
      </svg>
    )
  }

  if (shapeId === 'diamond') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <polygon points="16,4 28,16 16,28 4,16" />
      </svg>
    )
  }

  if (shapeId === 'rectangle') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect x="4" y="9" width="24" height="14" />
      </svg>
    )
  }

  if (shapeId === 'heart') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 27 C9 21 4 17 4 10.5 C4 6.7 6.7 4.2 10.2 4.2 C12.8 4.2 14.8 5.6 16 7.8 C17.2 5.6 19.2 4.2 21.8 4.2 C25.3 4.2 28 6.7 28 10.5 C28 17 23 21 16 27 Z" />
      </svg>
    )
  }

  if (shapeId === 'star') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <polygon points="16,3 19.4,12 29,12 21.2,17.5 24.2,27 16,21.2 7.8,27 10.8,17.5 3,12 12.6,12" />
      </svg>
    )
  }

  if (shapeId === 'hexagon') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <polygon points="16,4 26,10 26,22 16,28 6,22 6,10" />
      </svg>
    )
  }

  if (shapeId === 'badge') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3 C18.2 5 20.7 4 22.1 6.4 C23.4 8.7 26.3 8.8 26.4 11.6 C26.5 14.2 29 15.8 27.2 18.1 C25.6 20.3 26.4 23.1 23.8 24.2 C21.4 25.3 20.4 28 17.6 27.3 C15 26.7 12.8 28.6 10.8 26.6 C8.9 24.8 6 25.3 5.2 22.7 C4.5 20.2 2 18.9 3.2 16.3 C4.4 13.8 2.8 11.5 4.9 9.5 C6.8 7.6 6.9 4.8 9.6 4.4 C12.2 3.8 13.7 1.7 16 3 Z" />
      </svg>
    )
  }

  if (shapeId === 'arch') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 28 V14 C6 8.5 10.5 4 16 4 C21.5 4 26 8.5 26 14 V28 Z" />
      </svg>
    )
  }

  if (shapeId === 'speech') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 6 H27 Q29 6 29 8 V20 Q29 22 27 22 H18 L12 28 L13 22 H5 Q3 22 3 20 V8 Q3 6 5 6 Z" />
      </svg>
    )
  }

  if (shapeId === 'leaf') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 25 C8 10 20 4 29 4 C28 15 21 27 7 28 C10 22 16 16 22 10 C15 14 9 19 5 25 Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="7" y="7" width="18" height="18" />
    </svg>
  )
}

function getFontModeLabel(modeId) {
  if (modeId === 'sans') {
    return 'Sans'
  }

  if (modeId === 'serif') {
    return 'Serif'
  }

  return 'Combo'
}

export function PatternControls({
  settings,
  onChange,
  onGenerate,
  onPresetSelect,
  onRegenerate,
  onSurprise,
  backgroundModes,
  themes,
  shapes,
  fontModes,
  orientations,
  densities,
  compositions,
  flows,
  fillStyles,
  exportSizes,
  presets,
  sizeMixes,
  repeatModes,
}) {
  const selectedTheme = themes.find((theme) => theme.id === settings.theme) ?? themes[0]
  const [openSections, setOpenSections] = useState({
    content: false,
    shape: false,
    style: false,
    pattern: false,
    export: false,
  })

  function toggleSection(sectionId) {
    setOpenSections((sections) => ({
      ...sections,
      [sectionId]: !sections[sectionId],
    }))
  }

  return (
    <form className="controls-card" onSubmit={onGenerate}>
      <div className="controls-scroll">
        <AccordionSection
          id="content"
          title="Content"
          isOpen={openSections.content}
          onToggle={() => toggleSection('content')}
        >
          <label className="field-group">
            <span>Text</span>
            <textarea
              value={settings.text}
              placeholder="Enter a word, name, quote, or phrase"
              maxLength={35}
              onChange={(event) => onChange('text', event.target.value)}
            />
            <small>{settings.text.length}/35 characters | Premium version will have 100</small>
          </label>
        </AccordionSection>

        <AccordionSection
          id="shape"
          title="Shape"
          isOpen={openSections.shape}
          onToggle={() => toggleSection('shape')}
        >
          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Shape" help={helpText.shape} />
            </legend>
            <div className="shape-options">
              {shapes.map((shape) => (
                <label
                  key={shape.id}
                  className="shape-option"
                  title={shape.name}
                  aria-label={shape.name}
                >
                  <input
                    type="radio"
                    name="shape"
                    value={shape.id}
                    checked={settings.shape === shape.id}
                    onChange={(event) => onChange('shape', event.target.value)}
                  />
                  <span>
                    <ShapeIcon shapeId={shape.id} />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </AccordionSection>

        <AccordionSection
          id="style"
          title="Style"
          isOpen={openSections.style}
          onToggle={() => toggleSection('style')}
        >
          <div className="field-group">
            <div className="field-heading">
              <SectionLabel label="Theme" help={helpText.theme} />
            </div>
            <select
              id="theme-control"
              aria-label="Theme"
              value={settings.theme}
              onChange={(event) => onChange('theme', event.target.value)}
            >
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
            <ThemeDots colors={selectedTheme.colors} />
          </div>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Background" help={helpText.background} />
            </legend>
            <div className="compact-options three-options">
              {backgroundModes.map((backgroundMode) => (
                <label key={backgroundMode.id} className="compact-chip">
                  <input
                    type="radio"
                    name="backgroundMode"
                    value={backgroundMode.id}
                    checked={settings.backgroundMode === backgroundMode.id}
                    onChange={(event) => onChange('backgroundMode', event.target.value)}
                  />
                  <span>{backgroundMode.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Font style" help={helpText.fontStyle} />
            </legend>
            <div className="font-mode-options">
              {fontModes.map((mode) => (
                <label
                  key={mode.id}
                  className="font-mode-chip"
                  title={mode.name}
                  aria-label={mode.name}
                >
                  <input
                    type="radio"
                    name="fontMode"
                    value={mode.id}
                    checked={settings.fontMode === mode.id}
                    onChange={(event) => onChange('fontMode', event.target.value)}
                  />
                  <span>{getFontModeLabel(mode.id)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Orientation" help={helpText.orientation} />
            </legend>
            <div className="icon-options four-options">
              {orientations.map((orientation) => (
                <label
                  key={orientation.id}
                  className="icon-chip"
                  title={orientation.name}
                  aria-label={orientation.name}
                >
                  <input
                    type="radio"
                    name="orientation"
                    value={orientation.id}
                    checked={settings.orientation === orientation.id}
                    onChange={(event) => onChange('orientation', event.target.value)}
                  />
                  <span>
                    <img src={orientationIcons[orientation.id]} alt="" aria-hidden="true" />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </AccordionSection>

        <AccordionSection
          id="pattern"
          title="Pattern"
          isOpen={openSections.pattern}
          onToggle={() => toggleSection('pattern')}
        >
          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Pattern Preset" help={helpText.preset} />
            </legend>
            <div className="compact-options five-options">
              {presets.map((preset) => (
                <label key={preset.id} className="compact-chip">
                  <input
                    type="radio"
                    name="preset"
                    value={preset.id}
                    checked={settings.preset === preset.id}
                    onChange={(event) => onPresetSelect(event.target.value)}
                  />
                  <span>{preset.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Density" help={helpText.density} />
            </legend>
            <div className="icon-options four-options">
              {densities.map((density) => (
                <label
                  key={density.id}
                  className="icon-chip"
                  title={density.name}
                  aria-label={density.name}
                >
                  <input
                    type="radio"
                    name="density"
                    value={density.id}
                    checked={settings.density === density.id}
                    onChange={(event) => onChange('density', event.target.value)}
                  />
                  <span>
                    <img src={densityIcons[density.id]} alt="" aria-hidden="true" />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Composition" help={helpText.composition} />
            </legend>
            <div className="compact-options five-options">
              {compositions.map((composition) => (
                <label key={composition.id} className="compact-chip">
                  <input
                    type="radio"
                    name="composition"
                    value={composition.id}
                    checked={settings.composition === composition.id}
                    onChange={(event) => onChange('composition', event.target.value)}
                  />
                  <span>{composition.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Flow" help={helpText.flow} />
            </legend>
            <div className="compact-options three-options">
              {flows.map((flow) => (
                <label key={flow.id} className="compact-chip">
                  <input
                    type="radio"
                    name="flow"
                    value={flow.id}
                    checked={settings.flow === flow.id}
                    onChange={(event) => onChange('flow', event.target.value)}
                  />
                  <span>{flow.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Size Mix" help={helpText.sizeMix} />
            </legend>
            <div className="compact-options four-options">
              {sizeMixes.map((sizeMix) => (
                <label key={sizeMix.id} className="compact-chip">
                  <input
                    type="radio"
                    name="sizeMix"
                    value={sizeMix.id}
                    checked={settings.sizeMix === sizeMix.id}
                    onChange={(event) => onChange('sizeMix', event.target.value)}
                  />
                  <span>{sizeMix.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Repeat" help={helpText.repeat} />
            </legend>
            <div className="compact-options three-options">
              {repeatModes.map((repeatMode) => (
                <label key={repeatMode.id} className="compact-chip" title={repeatMode.label}>
                  <input
                    type="radio"
                    name="repeatMode"
                    value={repeatMode.id}
                    checked={settings.repeatMode === repeatMode.id}
                    onChange={(event) => onChange('repeatMode', event.target.value)}
                  />
                  <span>{repeatMode.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Fill Style" help={helpText.fillStyle} />
            </legend>
            <div className="compact-options three-options">
              {fillStyles.map((fillStyle) => (
                <label key={fillStyle.id} className="compact-chip">
                  <input
                    type="radio"
                    name="fillStyle"
                    value={fillStyle.id}
                    checked={settings.fillStyle === fillStyle.id}
                    onChange={(event) => onChange('fillStyle', event.target.value)}
                  />
                  <span>{fillStyle.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </AccordionSection>

        <AccordionSection
          id="export"
          title="Export"
          isOpen={openSections.export}
          onToggle={() => toggleSection('export')}
        >
          <fieldset className="field-group">
            <legend>
              <SectionLabel label="Export Size" help={helpText.exportSize} />
            </legend>
            <div className="icon-options four-options">
              {exportSizes.map((exportSize) => (
                <label
                  key={exportSize.id}
                  className="icon-chip"
                  title={`${exportSize.name}: ${exportSize.size} x ${exportSize.size} px`}
                  aria-label={`${exportSize.name} export size, ${exportSize.size} by ${exportSize.size} pixels`}
                >
                  <input
                    type="radio"
                    name="exportSize"
                    value={exportSize.id}
                    checked={settings.exportSize === exportSize.id}
                    onChange={(event) => onChange('exportSize', event.target.value)}
                  />
                  <span>
                    <img src={exportSizeIcons[exportSize.id]} alt="" aria-hidden="true" />
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </AccordionSection>
      </div>

      <div className="control-actions">
        <button type="submit" className="button button-primary">
          Generate
        </button>
        <button type="button" className="button button-outline" onClick={onRegenerate}>
          Regenerate
        </button>
        <button type="button" className="button button-surprise" onClick={onSurprise}>
          Surprise
        </button>
      </div>
    </form>
  )
}
