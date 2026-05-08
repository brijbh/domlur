import { useId } from 'react'
import { shapePaths, shapePolygons } from '../../data/shapes.js'

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

export function PatternPreview({ pattern, svgRef }) {
  const reactId = useId()
  const clipId = `domlur-shape-clip-${pattern.seed ?? reactId}`.replaceAll(':', '')

  const frameClassName = `preview-frame ${
    pattern.backgroundMode === 'transparent' ? 'preview-frame-transparent' : ''
  }`

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
            <clipPath id={clipId}>
              <ShapeClipPath shape={pattern.shape} width={pattern.width} height={pattern.height} />
            </clipPath>
          </defs>
          {pattern.background && (
            <rect width={pattern.width} height={pattern.height} fill={pattern.background} />
          )}
          <g clipPath={`url(#${clipId})`}>
            {pattern.items.map((item) => (
              <text
                key={item.id}
                x={item.x}
                y={item.y}
                fill={item.color}
                fontFamily={item.fontFamily}
                fontSize={item.fontSize}
                fontWeight={item.fontWeight}
                opacity={item.opacity}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${item.rotate} ${item.x} ${item.y})`}
              >
                {item.text}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
