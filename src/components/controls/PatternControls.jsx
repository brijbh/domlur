function ThemeDots({ colors }) {
  return (
    <span className="theme-dots" aria-hidden="true">
      {colors.map((color) => (
        <span key={color} style={{ backgroundColor: color }} />
      ))}
    </span>
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
  onRegenerate,
  themes,
  shapes,
  fontModes,
  orientations,
  densities,
  sizeMixes,
  repeatModes,
}) {
  const selectedTheme = themes.find((theme) => theme.id === settings.theme) ?? themes[0]

  return (
    <form className="controls-card" onSubmit={onGenerate}>
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

      <fieldset className="field-group">
        <legend>Shape</legend>
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

      <label className="field-group">
        <span>Color Theme</span>
        <select value={settings.theme} onChange={(event) => onChange('theme', event.target.value)}>
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
        <ThemeDots colors={selectedTheme.colors} />
      </label>

      <fieldset className="field-group">
        <legend>Font Family Mode</legend>
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
        <legend>Text Orientation</legend>
        <div className="segmented-grid">
          {orientations.map((orientation) => (
            <label key={orientation.id} className="option-pill">
              <input
                type="radio"
                name="orientation"
                value={orientation.id}
                checked={settings.orientation === orientation.id}
                onChange={(event) => onChange('orientation', event.target.value)}
              />
              <span>{orientation.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field-group">
        <legend>Pattern Density</legend>
        <div className="compact-options four-options">
          {densities.map((density) => (
            <label key={density.id} className="compact-chip">
              <input
                type="radio"
                name="density"
                value={density.id}
                checked={settings.density === density.id}
                onChange={(event) => onChange('density', event.target.value)}
              />
              <span>{density.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field-group">
        <legend>Size Mix</legend>
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
        <legend>Repeat Mode</legend>
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

      <div className="control-actions">
        <button type="submit" className="button button-primary">
          Generate Pattern
        </button>
        <button type="button" className="button button-outline" onClick={onRegenerate}>
          Regenerate
        </button>
      </div>
    </form>
  )
}
