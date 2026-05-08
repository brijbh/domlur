import { useId } from 'react'
import { shapePaths, shapePolygons } from '../../data/shapes.js'

function hexToRgb(hex) {
  const normalizedHex = hex.replace('#', '')
  const value = Number.parseInt(normalizedHex, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function getRelativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const channels = [r, g, b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  })

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function getContrastRatio(color, background) {
  const colorLuminance = getRelativeLuminance(color)
  const backgroundLuminance = getRelativeLuminance(background)
  const lighter = Math.max(colorLuminance, backgroundLuminance)
  const darker = Math.min(colorLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

function getBorderColor(pattern) {
  const fallback = '#12355B'
  const themeColor = pattern.items[0]?.color ?? fallback

  if (!pattern.background) {
    return themeColor || fallback
  }

  return getContrastRatio(themeColor, pattern.background) >= 1.8 ? themeColor : fallback
}

function ShapeClipPath({ shape, width, height }) {
  const centerX = width / 2
  const centerY = height / 2

  if (shape === 'circle') {
    return <circle cx={centerX} cy={centerY} r="360" />
  }

  if (shape === 'square') {
    return <rect x="80" y="80" width="640" height="640" />
  }

  if (shape === 'rectangle') {
    return <rect x="48" y="144" width="704" height="512" />
  }

  if (shape === 'diamond') {
    return <polygon points="400,48 752,400 400,752 48,400" />
  }

  if (shapePolygons[shape]) {
    return <polygon points={shapePolygons[shape]} />
  }

  if (shapePaths[shape]) {
    return <path d={shapePaths[shape]} />
  }

  return <polygon points="400,72 736,728 64,728" />
}

function ShapeBorder({ shape, width, height, stroke, strokeWidth, transform }) {
  return (
    <g
      transform={transform}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      pointerEvents="none"
    >
      <ShapeClipPath shape={shape} width={width} height={height} />
    </g>
  )
}

export function PatternPreview({ pattern, svgRef }) {
  const reactId = useId()
  const clipId = `domlur-shape-clip-${pattern.seed ?? reactId}`.replaceAll(':', '')

  const frameClassName = `preview-frame ${
    pattern.backgroundMode === 'transparent' ? 'preview-frame-transparent' : ''
  }`
  const borderWidth = pattern.border?.width ?? 0
  const borderColor = getBorderColor(pattern)
  const layout = pattern.layout ?? { scale: 1, x: 0, y: 0 }
  const layoutTransform = `translate(${layout.x ?? 0} ${layout.y ?? 0}) scale(${layout.scale ?? 1})`

  return (
    <div className="preview-card">
      <div className={frameClassName}>
        <svg
          ref={svgRef}
          className="pattern-svg"
          viewBox={`0 0 ${pattern.width} ${pattern.height}`}
          role="img"
          aria-label="Generated text pattern"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <g transform={layoutTransform}>
                <ShapeClipPath shape={pattern.shape} width={pattern.width} height={pattern.height} />
              </g>
            </clipPath>
          </defs>
          {pattern.background && (
            <rect width={pattern.width} height={pattern.height} fill={pattern.background} />
          )}
          <g clipPath={`url(#${clipId})`} transform={layoutTransform}>
            {pattern.items.map((item) => (
              <text
                key={item.id}
                x={item.x}
                y={item.y}
                fill={item.fill ?? item.color}
                fillOpacity={item.fillOpacity ?? item.opacity}
                stroke={item.strokeWidth > 0 ? item.strokeColor : undefined}
                strokeWidth={item.strokeWidth > 0 ? item.strokeWidth : undefined}
                strokeOpacity={item.strokeWidth > 0 ? item.strokeOpacity : undefined}
                strokeLinejoin="round"
                paintOrder={item.renderStyle === 'outline' ? 'stroke fill' : undefined}
                fontFamily={item.fontFamily}
                fontSize={item.fontSize}
                fontWeight={item.fontWeight}
                opacity={item.fillOpacity == null ? item.opacity : undefined}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${item.rotate} ${item.x} ${item.y})`}
              >
                {item.text}
              </text>
            ))}
          </g>
          {borderWidth > 0 && (
            <ShapeBorder
              shape={pattern.shape}
              width={pattern.width}
              height={pattern.height}
              stroke={borderColor}
              strokeWidth={borderWidth}
              transform={layoutTransform}
            />
          )}
        </svg>
      </div>
    </div>
  )
}
