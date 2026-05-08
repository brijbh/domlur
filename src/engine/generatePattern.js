const CANVAS_SIZE = 800
const CENTER = CANVAS_SIZE / 2
const DEFAULT_DENSITY = 0.62
const GRID_ROWS = 14
const GRID_COLS = 14
const SHAPE_SIZES = {
  circleRadius: 360,
  squareHalf: 320,
  rectangleHalfWidth: 352,
  rectangleHalfHeight: 256,
  diamondLimit: 352,
  triangleTop: 72,
  triangleBottom: 728,
  triangleHalfWidth: 336,
}
const LIGHT_BACKGROUND = '#FFFDF8'
const STAR_POINTS = [
  [400, 70],
  [486, 286],
  [718, 286],
  [530, 421],
  [602, 650],
  [400, 515],
  [198, 650],
  [270, 421],
  [82, 286],
  [314, 286],
]
const HEXAGON_POINTS = [
  [400, 70],
  [684, 235],
  [684, 565],
  [400, 730],
  [116, 565],
  [116, 235],
]
const SPEECH_TAIL_POINTS = [
  [330, 718],
  [348, 592],
  [458, 592],
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
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

function randomBetween(random, min, max) {
  return min + random() * (max - min)
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2)
}

function pointInPolygon(x, y, points) {
  let isInside = false

  for (let index = 0, previousIndex = points.length - 1; index < points.length; previousIndex = index, index += 1) {
    const [currentX, currentY] = points[index]
    const [previousX, previousY] = points[previousIndex]
    const intersects = currentY > y !== previousY > y &&
      x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY) + currentX

    if (intersects) {
      isInside = !isInside
    }
  }

  return isInside
}

function getRotatedPoint(x, y, angleDegrees, originX = CENTER, originY = CENTER) {
  const angle = (angleDegrees * Math.PI) / 180
  const dx = x - originX
  const dy = y - originY

  return {
    x: dx * Math.cos(angle) - dy * Math.sin(angle),
    y: dx * Math.sin(angle) + dy * Math.cos(angle),
  }
}

function pickRandom(random, array) {
  return array[Math.floor(random() * array.length)]
}

function weightedPick(random, options) {
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

function getTextColors(theme) {
  const background = theme.colors[4]
  const readableColors = theme.colors
    .slice(0, 4)
    .filter((color) => getContrastRatio(color, background) >= 1.8)

  return readableColors.length > 0 ? readableColors : theme.colors.slice(0, 4)
}

function getFillSettings(fillStyle) {
  if (fillStyle === 'edge') {
    return {
      boundaryCount: 36,
      densityMultiplier: 1,
      bleedAllowance: 10,
      heroCountOffset: 0,
      heroScale: 1,
      rotationScale: 1,
    }
  }

  if (fillStyle === 'bleed') {
    return {
      boundaryCount: 54,
      densityMultiplier: 1.08,
      bleedAllowance: 56,
      heroCountOffset: 1,
      heroScale: 1.18,
      rotationScale: 1.25,
    }
  }

  return {
    boundaryCount: 16,
    densityMultiplier: 0.82,
    bleedAllowance: 0,
    heroCountOffset: -1,
    heroScale: 0.9,
    rotationScale: 0.65,
  }
}

function getPresetSettings(preset) {
  if (preset === 'poster') {
    return {
      densityMultiplier: 0.96,
      boundaryMultiplier: 1.08,
      heroCountOffset: 0,
      heroScale: 1.16,
      rotationScale: 1.06,
      quietZoneCount: 1,
      quietStrength: 0.9,
      fillJitter: 0.42,
    }
  }

  if (preset === 'textile') {
    return {
      densityMultiplier: 1.08,
      boundaryMultiplier: 1.12,
      heroCountOffset: -1,
      heroScale: 0.78,
      rotationScale: 0.9,
      quietZoneCount: 1,
      quietStrength: 0.58,
      fillJitter: 0.28,
    }
  }

  if (preset === 'minimal') {
    return {
      densityMultiplier: 0.56,
      boundaryMultiplier: 0.64,
      heroCountOffset: -1,
      heroScale: 0.82,
      rotationScale: 0.42,
      quietZoneCount: 3,
      quietStrength: 1,
      fillJitter: 0.34,
    }
  }

  if (preset === 'chaos') {
    return {
      densityMultiplier: 1.08,
      boundaryMultiplier: 1.05,
      heroCountOffset: -1,
      heroScale: 1.02,
      rotationScale: 1.38,
      quietZoneCount: 0,
      quietStrength: 0,
      fillJitter: 0.48,
    }
  }

  return {
    densityMultiplier: 0.82,
    boundaryMultiplier: 0.82,
    heroCountOffset: -1,
    heroScale: 0.9,
    rotationScale: 0.64,
    quietZoneCount: 2,
    quietStrength: 0.78,
    fillJitter: 0.34,
  }
}

function getCompositionField(composition, random) {
  if (composition === 'diagonal') {
    return {
      type: 'diagonal',
      direction: random() > 0.5 ? 1 : -1,
      bandWidth: randomBetween(random, 118, 170),
    }
  }

  if (composition === 'burst') {
    return {
      type: 'burst',
      centerX: CENTER + randomBetween(random, -36, 36),
      centerY: CENTER + randomBetween(random, -36, 36),
    }
  }

  if (composition === 'edge') {
    return {
      type: 'edge',
    }
  }

  if (composition === 'asymmetric') {
    const quadrants = [
      { x: CENTER - 180, y: CENTER - 145 },
      { x: CENTER + 180, y: CENTER - 145 },
      { x: CENTER - 170, y: CENTER + 155 },
      { x: CENTER + 170, y: CENTER + 155 },
    ]

    return {
      type: 'asymmetric',
      dominant: pickRandom(random, quadrants),
    }
  }

  return {
    type: 'balanced',
  }
}

function getDensityBias(x, y, compositionField, shape) {
  const dx = x - CENTER
  const dy = y - CENTER
  const edgeDistance = getEdgeDistanceRatio(x, y, shape)

  if (compositionField.type === 'diagonal') {
    const signedDistance = compositionField.direction === 1
      ? Math.abs(y - x)
      : Math.abs(y + x - CANVAS_SIZE)
    const normalizedDistance = signedDistance / compositionField.bandWidth
    return clamp(1.2 - normalizedDistance * 0.52, 0.18, 1.18)
  }

  if (compositionField.type === 'burst') {
    const centerDistance = distance(x, y, compositionField.centerX, compositionField.centerY)
    return clamp(1.2 - centerDistance / 520, 0.3, 1.18)
  }

  if (compositionField.type === 'edge') {
    return clamp(0.28 + edgeDistance * 1.15, 0.26, 1.22)
  }

  if (compositionField.type === 'asymmetric') {
    const dominantDistance = distance(x, y, compositionField.dominant.x, compositionField.dominant.y)
    const sideBias = Math.sign(dx || 1) === Math.sign(compositionField.dominant.x - CENTER || 1)
      ? 0.14
      : -0.12
    return clamp(1.18 - dominantDistance / 470 + sideBias, 0.16, 1.24)
  }

  return 1
}

function getCandidatePoint({
  random,
  row,
  col,
  cellWidth,
  cellHeight,
  fillSettings,
  compositionField,
}) {
  if (compositionField.type === 'diagonal') {
    const travel = randomBetween(random, 54, CANVAS_SIZE - 54)
    const bandOffset = randomBetween(random, -compositionField.bandWidth, compositionField.bandWidth)
    const jitter = randomBetween(random, -18, 18)

    if (compositionField.direction === 1) {
      return {
        x: travel + bandOffset * 0.5 + jitter,
        y: travel - bandOffset * 0.5 - jitter,
      }
    }

    return {
      x: travel + bandOffset * 0.5 + jitter,
      y: CANVAS_SIZE - travel + bandOffset * 0.5 - jitter,
    }
  }

  if (compositionField.type === 'burst') {
    const angle = randomBetween(random, 0, Math.PI * 2)
    const radius = random() ** 1.65 * 390

    return {
      x: compositionField.centerX + Math.cos(angle) * radius,
      y: compositionField.centerY + Math.sin(angle) * radius,
    }
  }

  if (compositionField.type === 'edge') {
    const angle = randomBetween(random, 0, Math.PI * 2)
    const radius = randomBetween(random, 250, 390)

    return {
      x: CENTER + Math.cos(angle) * radius + randomBetween(random, -18, 18),
      y: CENTER + Math.sin(angle) * radius + randomBetween(random, -18, 18),
    }
  }

  if (compositionField.type === 'asymmetric') {
    const useDominantCluster = random() < 0.78
    const anchor = useDominantCluster
      ? compositionField.dominant
      : {
          x: CENTER + (compositionField.dominant.x > CENTER ? -115 : 115),
          y: CENTER + (compositionField.dominant.y > CENTER ? -95 : 95),
        }

    return {
      x: anchor.x + randomBetween(random, -190, 190),
      y: anchor.y + randomBetween(random, -170, 170),
    }
  }

  const baseX = cellWidth * col + cellWidth / 2
  const baseY = cellHeight * row + cellHeight / 2

  return {
    x: baseX + randomBetween(random, -cellWidth * fillSettings.fillJitter, cellWidth * fillSettings.fillJitter),
    y: baseY + randomBetween(random, -cellHeight * fillSettings.fillJitter, cellHeight * fillSettings.fillJitter),
  }
}

function getEdgeDistanceRatio(x, y, shape) {
  const dx = Math.abs(x - CENTER)
  const dy = Math.abs(y - CENTER)

  if (shape === 'circle') {
    return clamp(Math.hypot(x - CENTER, y - CENTER) / SHAPE_SIZES.circleRadius, 0, 1.35)
  }

  if (shape === 'rectangle') {
    return clamp(Math.max(dx / SHAPE_SIZES.rectangleHalfWidth, dy / SHAPE_SIZES.rectangleHalfHeight), 0, 1.35)
  }

  if (shape === 'diamond') {
    return clamp((dx + dy) / SHAPE_SIZES.diamondLimit, 0, 1.35)
  }

  if (shape === 'triangle') {
    return clamp((y - SHAPE_SIZES.triangleTop) / (SHAPE_SIZES.triangleBottom - SHAPE_SIZES.triangleTop), 0, 1.35)
  }

  if (shape === 'star') {
    return clamp(Math.hypot(x - CENTER, y - CENTER) / 330, 0, 1.35)
  }

  if (shape === 'hexagon' || shape === 'badge') {
    return clamp(Math.hypot(x - CENTER, y - CENTER) / 350, 0, 1.35)
  }

  if (shape === 'heart') {
    return clamp(Math.max(dx / 310, Math.abs(y - 440) / 300), 0, 1.35)
  }

  if (shape === 'arch') {
    return clamp(Math.max(dx / 288, Math.abs(y - 400) / 328), 0, 1.35)
  }

  if (shape === 'speech') {
    return clamp(Math.max(Math.abs(x - CENTER) / 352, Math.abs(y - 368) / 288), 0, 1.35)
  }

  if (shape === 'leaf') {
    const rotated = getRotatedPoint(x, y, -35, CENTER, CENTER)
    return clamp(Math.max(Math.abs(rotated.x) / 330, Math.abs(rotated.y) / 160), 0, 1.35)
  }

  return clamp(Math.max(dx, dy) / SHAPE_SIZES.squareHalf, 0, 1.35)
}

function getTextTokens(text, repeatMode) {
  const fullText = (text || 'DOMLUR').trim().slice(0, 35) || 'DOMLUR'

  if (repeatMode === 'words') {
    const words = fullText.split(/\s+/).filter(Boolean)
    return words.length > 0 ? words : [fullText]
  }

  if (repeatMode === 'letters') {
    const letters = fullText.replace(/\s+/g, '').split('').filter(Boolean)
    return letters.length > 0 ? letters : [fullText]
  }

  return [fullText]
}

function getHeroTextTokens(text, repeatMode, preset) {
  const fullText = (text || 'DOMLUR').trim().slice(0, 35) || 'DOMLUR'

  if (repeatMode === 'letters' && preset !== 'chaos') {
    return [fullText]
  }

  if (repeatMode === 'words') {
    const words = fullText.split(/\s+/).filter(Boolean)
    const longestWord = words.reduce((longest, word) => (word.length > longest.length ? word : longest), '')
    return [fullText, longestWord || fullText]
  }

  return getTextTokens(text, repeatMode)
}

function getToken(tokens, index) {
  return tokens[index % tokens.length]
}

function createQuietZones(random, preset, fillStyle, compositionField) {
  const presetSettings = getPresetSettings(preset)
  let count = fillStyle === 'edge'
    ? Math.max(0, presetSettings.quietZoneCount - 1)
    : presetSettings.quietZoneCount
  const zones = []

  if (compositionField.type === 'burst') {
    return [
      { x: 130, y: 130, radiusX: 105, radiusY: 105, strength: 0.85 },
      { x: 670, y: 130, radiusX: 105, radiusY: 105, strength: 0.85 },
      { x: 130, y: 670, radiusX: 105, radiusY: 105, strength: 0.85 },
      { x: 670, y: 670, radiusX: 105, radiusY: 105, strength: 0.85 },
    ]
  }

  if (compositionField.type === 'edge') {
    return [{ x: CENTER, y: CENTER, radiusX: 150, radiusY: 150, strength: 0.9 }]
  }

  if (compositionField.type === 'asymmetric') {
    const oppositeX = CANVAS_SIZE - compositionField.dominant.x
    const oppositeY = CANVAS_SIZE - compositionField.dominant.y
    return [{ x: oppositeX, y: oppositeY, radiusX: 190, radiusY: 160, strength: 1 }]
  }

  if (compositionField.type === 'diagonal') {
    count = Math.max(1, count)
    zones.push(
      compositionField.direction === 1
        ? { x: 130, y: 660, radiusX: 125, radiusY: 120, strength: 0.82 }
        : { x: 130, y: 130, radiusX: 125, radiusY: 120, strength: 0.82 },
    )
  }

  for (let index = 0; index < count; index += 1) {
    const anchor = [
      { x: CENTER - 135, y: CENTER + 110 },
      { x: CENTER + 150, y: CENTER - 80 },
      { x: CENTER, y: CENTER + 210 },
    ][index % 3]

    zones.push({
      x: anchor.x + randomBetween(random, -70, 70),
      y: anchor.y + randomBetween(random, -70, 70),
      radiusX: randomBetween(random, 88, 150) * presetSettings.quietStrength,
      radiusY: randomBetween(random, 70, 128) * presetSettings.quietStrength,
      strength: presetSettings.quietStrength,
    })
  }

  return zones
}

function isInsideQuietZone(x, y, quietZones) {
  return quietZones.some((zone) => {
    const normalizedX = (x - zone.x) / zone.radiusX
    const normalizedY = (y - zone.y) / zone.radiusY
    return normalizedX * normalizedX + normalizedY * normalizedY <= zone.strength
  })
}

function isPointInsideShape(x, y, size, shape, bleedAllowance = 0) {
  const center = size / 2
  const dx = x - center
  const dy = y - center

  if (shape === 'circle') {
    const radius = SHAPE_SIZES.circleRadius + bleedAllowance
    return dx * dx + dy * dy <= radius * radius
  }

  if (shape === 'square') {
    const half = SHAPE_SIZES.squareHalf + bleedAllowance
    return Math.abs(dx) <= half && Math.abs(dy) <= half
  }

  if (shape === 'rectangle') {
    return (
      Math.abs(dx) <= SHAPE_SIZES.rectangleHalfWidth + bleedAllowance &&
      Math.abs(dy) <= SHAPE_SIZES.rectangleHalfHeight + bleedAllowance
    )
  }

  if (shape === 'diamond') {
    return Math.abs(dx) + Math.abs(dy) <= SHAPE_SIZES.diamondLimit + bleedAllowance
  }

  if (shape === 'triangle') {
    const top = SHAPE_SIZES.triangleTop - bleedAllowance
    const bottom = SHAPE_SIZES.triangleBottom + bleedAllowance

    if (y < top || y > bottom) {
      return false
    }

    const progress = (y - top) / (bottom - top)
    const halfWidth = progress * (SHAPE_SIZES.triangleHalfWidth + bleedAllowance)
    return Math.abs(dx) <= halfWidth
  }

  if (shape === 'heart') {
    const leftLobe = Math.hypot(x - 285, y - 300) <= 150 + bleedAllowance
    const rightLobe = Math.hypot(x - 515, y - 300) <= 150 + bleedAllowance
    const lowerWidth = Math.max(0, (720 + bleedAllowance - y) * 0.72)
    const lowerBody = y >= 275 - bleedAllowance &&
      y <= 720 + bleedAllowance &&
      Math.abs(dx) <= lowerWidth + bleedAllowance

    return leftLobe || rightLobe || lowerBody
  }

  if (shape === 'star') {
    const scaledPoints = STAR_POINTS.map(([pointX, pointY]) => [
      center + (pointX - center) * (1 + bleedAllowance / 300),
      center + (pointY - center) * (1 + bleedAllowance / 300),
    ])
    return pointInPolygon(x, y, scaledPoints)
  }

  if (shape === 'hexagon') {
    const scaledPoints = HEXAGON_POINTS.map(([pointX, pointY]) => [
      center + (pointX - center) * (1 + bleedAllowance / 330),
      center + (pointY - center) * (1 + bleedAllowance / 330),
    ])
    return pointInPolygon(x, y, scaledPoints)
  }

  if (shape === 'badge') {
    return Math.hypot(dx, dy) <= 355 + bleedAllowance
  }

  if (shape === 'arch') {
    const inBase = Math.abs(dx) <= 288 + bleedAllowance &&
      y >= 360 &&
      y <= 728 + bleedAllowance
    const inDome = Math.hypot(dx, y - 360) <= 288 + bleedAllowance &&
      y >= 72 - bleedAllowance &&
      y <= 360

    return inBase || inDome
  }

  if (shape === 'speech') {
    const inBubble = x >= 48 - bleedAllowance &&
      x <= 752 + bleedAllowance &&
      y >= 144 - bleedAllowance &&
      y <= 592 + bleedAllowance
    const inTail = pointInPolygon(x, y, SPEECH_TAIL_POINTS.map(([pointX, pointY]) => [
      pointX + (pointX - center) * (bleedAllowance / 280),
      pointY + (pointY - center) * (bleedAllowance / 280),
    ]))

    return inBubble || inTail
  }

  if (shape === 'leaf') {
    const rotated = getRotatedPoint(x, y, -35, center, center)
    const ellipse = (rotated.x * rotated.x) / ((330 + bleedAllowance) ** 2) +
      (rotated.y * rotated.y) / ((155 + bleedAllowance) ** 2)
    const taper = rotated.x > -290 - bleedAllowance && rotated.x < 330 + bleedAllowance

    return ellipse <= 1 && taper
  }

  return false
}

function isNearShapeBoundary(x, y, size, shape, bleedAllowance) {
  if (!isPointInsideShape(x, y, size, shape, bleedAllowance)) {
    return false
  }

  const center = size / 2
  const dx = x - center
  const dy = y - center

  if (shape === 'circle') {
    const distance = Math.hypot(dx, dy)
    return distance >= SHAPE_SIZES.circleRadius * 0.7
  }

  if (shape === 'square') {
    const distance = Math.max(Math.abs(dx), Math.abs(dy))
    return distance >= SHAPE_SIZES.squareHalf * 0.7
  }

  if (shape === 'rectangle') {
    const xDistance = Math.abs(dx) / SHAPE_SIZES.rectangleHalfWidth
    const yDistance = Math.abs(dy) / SHAPE_SIZES.rectangleHalfHeight
    return Math.max(xDistance, yDistance) >= 0.72
  }

  if (shape === 'diamond') {
    return Math.abs(dx) + Math.abs(dy) >= SHAPE_SIZES.diamondLimit * 0.7
  }

  if (shape === 'triangle') {
    const progress = (y - SHAPE_SIZES.triangleTop) /
      (SHAPE_SIZES.triangleBottom - SHAPE_SIZES.triangleTop)
    const halfWidth = progress * SHAPE_SIZES.triangleHalfWidth
    const sideDistance = halfWidth - Math.abs(dx)
    const bottomDistance = SHAPE_SIZES.triangleBottom - y

    return sideDistance <= 82 || bottomDistance <= 90
  }

  if (
    shape === 'heart' ||
    shape === 'star' ||
    shape === 'hexagon' ||
    shape === 'badge' ||
    shape === 'arch' ||
    shape === 'speech' ||
    shape === 'leaf'
  ) {
    return getEdgeDistanceRatio(x, y, shape) >= 0.72
  }

  return false
}

function getRotation(random, orientation, rotationScale, isHero = false) {
  const heroScale = isHero ? 0.72 : 1

  if (orientation === 'horizontal') {
    return randomBetween(random, -4, 4) * rotationScale * heroScale
  }

  if (orientation === 'vertical') {
    return 90 + randomBetween(random, -4, 4) * rotationScale * heroScale
  }

  if (orientation === 'diagonal') {
    const diagonalRange = random() > 0.5 ? [25, 45] : [-45, -25]
    const base = randomBetween(random, diagonalRange[0], diagonalRange[1])
    return base + randomBetween(random, -4, 4) * (rotationScale - 1) * heroScale
  }

  const baseRotation = pickRandom(random, [0, 90, -35, 35])
  return baseRotation + randomBetween(random, -7, 7) * rotationScale * heroScale
}

function getCompositionRotation(x, y, compositionField) {
  if (compositionField.type === 'diagonal') {
    return compositionField.direction === 1 ? 34 : -34
  }

  if (compositionField.type === 'burst') {
    const angle = Math.atan2(y - compositionField.centerY, x - compositionField.centerX)
    return (angle * 180) / Math.PI
  }

  if (compositionField.type === 'edge') {
    const angle = Math.atan2(y - CENTER, x - CENTER)
    return ((angle * 180) / Math.PI) + 90
  }

  if (compositionField.type === 'asymmetric') {
    return x > CENTER ? -18 : 18
  }

  return null
}

function getHeroItemCount(sizeMix, fillSettings, presetSettings, fillStyle, preset, compositionField) {
  let count = 2

  if (sizeMix === 'even') {
    count = 1
  } else if (sizeMix === 'bold') {
    count = 3
  } else if (sizeMix === 'poster') {
    count = 4
  }

  if (fillStyle === 'bleed') {
    count += 1
  }

  if (compositionField.type === 'burst' || compositionField.type === 'asymmetric') {
    count += 1
  }

  if (compositionField.type === 'edge' || preset === 'textile') {
    count -= 1
  }

  if (preset === 'minimal') {
    count = Math.min(count, 1)
  }

  const resolvedCount = count + fillSettings.heroCountOffset + presetSettings.heroCountOffset
  const minimumCount = preset === 'minimal' || sizeMix === 'even' ? 0 : 1

  return clamp(resolvedCount, minimumCount, 4)
}

function getBoundaryItemCount(density, fillSettings, presetSettings) {
  const densityOffset = Math.round((density - DEFAULT_DENSITY) * 18)
  return clamp(Math.round((fillSettings.boundaryCount + densityOffset) * presetSettings.boundaryMultiplier), 8, 64)
}

function getFontSize(random, sizeMix, fillSettings, isHero, isBoundary, compositionField) {
  let fontSize

  if (sizeMix === 'even') {
    if (isHero) {
      fontSize = randomBetween(random, 32, 42)
      return Math.round(fontSize * fillSettings.heroScale * fillSettings.presetHeroScale)
    }

    if (isBoundary) {
      return Math.round(randomBetween(random, 14, 24))
    }

    return Math.round(randomBetween(random, 22, 30))
  }

  if (isHero) {
    if (compositionField.type === 'burst' && fillSettings.fillStyle === 'bleed') {
      return Math.round(randomBetween(random, 120, 220) * fillSettings.presetHeroScale)
    }

    if (compositionField.type === 'burst' || compositionField.type === 'asymmetric') {
      return Math.round(randomBetween(random, 100, 180) * fillSettings.presetHeroScale)
    }

    if (sizeMix === 'bold') {
      fontSize = randomBetween(random, 54, 78)
      return Math.round(fontSize * fillSettings.heroScale * fillSettings.presetHeroScale)
    }

    if (sizeMix === 'poster') {
      fontSize = randomBetween(random, 72, 110)
      return Math.round(fontSize * fillSettings.heroScale * fillSettings.presetHeroScale)
    }

    fontSize = randomBetween(random, 42, 64)
    return Math.round(fontSize * fillSettings.heroScale * fillSettings.presetHeroScale)
  }

  if (isBoundary) {
    if (sizeMix === 'bold') {
      return Math.round(randomBetween(random, 16, 32))
    }

    if (sizeMix === 'poster') {
      return Math.round(randomBetween(random, 14, 30))
    }

    return Math.round(randomBetween(random, 14, 28))
  }

  const sizeType = weightedPick(
    random,
    sizeMix === 'bold'
      ? [
          { value: 'small', weight: 0.12 },
          { value: 'medium', weight: 0.58 },
          { value: 'large', weight: 0.3 },
        ]
      : sizeMix === 'poster'
        ? [
            { value: 'small', weight: 0.28 },
            { value: 'medium', weight: 0.5 },
            { value: 'large', weight: 0.22 },
          ]
        : [
            { value: 'small', weight: 0.22 },
            { value: 'medium', weight: 0.68 },
            { value: 'large', weight: 0.1 },
          ],
  )

  if (sizeType === 'small') {
    return Math.round(randomBetween(random, 16, 22))
  }

  if (sizeType === 'large') {
    if (sizeMix === 'bold') {
      return Math.round(randomBetween(random, 38, 46))
    }

    if (sizeMix === 'poster') {
      return Math.round(randomBetween(random, 34, 42))
    }

    return Math.round(randomBetween(random, 40, 52))
  }

  if (sizeMix === 'bold') {
    return Math.round(randomBetween(random, 24, 38))
  }

  return Math.round(randomBetween(random, 24, 36))
}

function getFontWeight(random, isHero, isBoundary) {
  if (isHero) {
    return weightedPick(random, [
      { value: 800, weight: 0.35 },
      { value: 900, weight: 0.65 },
    ])
  }

  if (isBoundary) {
    return weightedPick(random, [
      { value: 600, weight: 0.3 },
      { value: 700, weight: 0.45 },
      { value: 800, weight: 0.25 },
    ])
  }

  return weightedPick(random, [
    { value: 500, weight: 0.12 },
    { value: 600, weight: 0.18 },
    { value: 700, weight: 0.46 },
    { value: 800, weight: 0.18 },
    { value: 900, weight: 0.06 },
  ])
}

function getOpacity(random, isHero, isBoundary, fontSize) {
  if (isHero) {
    return Number(randomBetween(random, 0.72, 0.96).toFixed(2))
  }

  if (isBoundary) {
    return Number(randomBetween(random, 0.55, 0.9).toFixed(2))
  }

  const maxOpacity = fontSize >= 40 ? 0.82 : 1
  return Number(randomBetween(random, 0.45, maxOpacity).toFixed(2))
}

function createItem({
  id,
  textTokens,
  tokenIndex,
  x,
  y,
  random,
  orientation,
  colors,
  fontMode,
  sizeMix,
  fillSettings,
  compositionField,
  isHero,
  isBoundary = false,
}) {
  let fontSize = getFontSize(random, sizeMix, fillSettings, isHero, isBoundary, compositionField)

  if (!isHero && !isBoundary && compositionField.type === 'burst') {
    const centerDistance = distance(x, y, compositionField.centerX, compositionField.centerY)
    const scale = clamp(1.28 - centerDistance / 720, 0.88, 1.24)
    fontSize = Math.round(fontSize * scale)
  }

  if (!isHero && !isBoundary && compositionField.type === 'edge') {
    const edgeScale = clamp(0.94 + getEdgeDistanceRatio(x, y, fillSettings.shape) * 0.18, 0.9, 1.14)
    fontSize = Math.round(fontSize * edgeScale)
  }

  const compositionRotation = isHero || fillSettings.compositionMode !== 'balanced'
    ? getCompositionRotation(x, y, compositionField)
    : null

  return {
    id,
    text: getToken(textTokens, tokenIndex),
    x: Math.round(x),
    y: Math.round(y),
    rotate: Number(
      (
        compositionRotation ??
        getRotation(random, orientation, fillSettings.rotationScale, isHero)
      ).toFixed(2),
    ),
    color: pickRandom(random, colors),
    fontFamily: pickRandom(random, fontMode.families),
    fontSize,
    fontWeight: getFontWeight(random, isHero, isBoundary),
    opacity: getOpacity(random, isHero, isBoundary, fontSize),
  }
}

function createCandidateItems({
  random,
  textTokens,
  shape,
  orientation,
  density,
  bleedAllowance,
  quietZones,
  compositionField,
  colors,
  fontMode,
  sizeMix,
  fillSettings,
}) {
  const items = []
  const cellWidth = CANVAS_SIZE / GRID_COLS
  const cellHeight = CANVAS_SIZE / GRID_ROWS

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      if (random() > density) {
        continue
      }

      const { x, y } = getCandidatePoint({
        random,
        row,
        col,
        cellWidth,
        cellHeight,
        fillSettings,
        compositionField,
      })

      if (!isPointInsideShape(x, y, CANVAS_SIZE, shape, bleedAllowance)) {
        continue
      }

      if (random() > getDensityBias(x, y, compositionField, shape)) {
        continue
      }

      if (isInsideQuietZone(x, y, quietZones)) {
        continue
      }

      items.push(
        createItem({
          id: `text-${row}-${col}`,
          textTokens,
          tokenIndex: items.length,
          x,
          y,
          random,
          orientation,
          colors,
          fontMode,
          sizeMix,
          fillSettings,
          compositionField,
          isHero: false,
        }),
      )
    }
  }

  return items
}

function createBoundaryItems({
  random,
  textTokens,
  shape,
  orientation,
  density,
  bleedAllowance,
  quietZones,
  compositionField,
  colors,
  fontMode,
  sizeMix,
  fillSettings,
}) {
  const items = []
  const targetCount = getBoundaryItemCount(density, fillSettings, fillSettings.presetSettings)
  let attempts = 0

  while (items.length < targetCount && attempts < 1000) {
    attempts += 1

    const x = randomBetween(random, 34, CANVAS_SIZE - 34)
    const y = randomBetween(random, 34, CANVAS_SIZE - 34)

    if (!isNearShapeBoundary(x, y, CANVAS_SIZE, shape, bleedAllowance)) {
      continue
    }

    if (compositionField.type !== 'edge' && random() > getDensityBias(x, y, compositionField, shape) + 0.2) {
      continue
    }

    if (fillSettings.fillStyle === 'soft' && isInsideQuietZone(x, y, quietZones)) {
      continue
    }

    items.push(
      createItem({
        id: `boundary-${items.length}`,
        textTokens,
        tokenIndex: items.length,
        x,
        y,
        random,
        orientation,
        colors,
        fontMode,
        sizeMix,
        fillSettings,
        compositionField,
        isHero: false,
        isBoundary: true,
      }),
    )
  }

  return items
}

function createHeroItems({
  random,
  heroTextTokens,
  shape,
  orientation,
  bleedAllowance,
  colors,
  fontMode,
  sizeMix,
  fillSettings,
  compositionField,
}) {
  const items = []
  const heroItemCount = getHeroItemCount(
    sizeMix,
    fillSettings,
    fillSettings.presetSettings,
    fillSettings.fillStyle,
    fillSettings.preset,
    compositionField,
  )
  const heroZones = getHeroAnchors(shape, fillSettings.fillStyle, compositionField, random)
  const minimumDistance = compositionField.type === 'burst' ? 150 : fillSettings.fillStyle === 'bleed' ? 180 : 225

  for (let index = 0; index < heroItemCount; index += 1) {
    const zone = heroZones[index % heroZones.length]
    let point = null

    for (let attempt = 0; attempt < 28; attempt += 1) {
      const x = randomBetween(random, zone.xMin, zone.xMax)
      const y = randomBetween(random, zone.yMin, zone.yMax)

      if (isPointInsideShape(x, y, CANVAS_SIZE, shape, bleedAllowance * 0.45)) {
        const isTooClose = items.some((item) => Math.hypot(item.x - x, item.y - y) < minimumDistance)

        if (!isTooClose) {
          point = { x, y }
          break
        }
      }
    }

    if (!point) {
      continue
    }

    items.push(
      createItem({
        id: `hero-${index}`,
        textTokens: heroTextTokens,
        tokenIndex: index,
        x: point.x,
        y: point.y,
        random,
        orientation,
        colors,
        fontMode,
        sizeMix,
        fillSettings,
        compositionField,
        isHero: true,
      }),
    )
  }

  return items
}

function getHeroAnchors(shape, fillStyle, compositionField, random) {
  if (compositionField.type === 'burst') {
    return [
      { xMin: 295, xMax: 505, yMin: 290, yMax: 510 },
      { xMin: 245, xMax: 555, yMin: 245, yMax: 555 },
      { xMin: 330, xMax: 470, yMin: 150, yMax: 310 },
      { xMin: 330, xMax: 470, yMin: 490, yMax: 650 },
    ]
  }

  if (compositionField.type === 'edge') {
    return [
      { xMin: 15, xMax: 155, yMin: 300, yMax: 520 },
      { xMin: 645, xMax: 785, yMin: 300, yMax: 520 },
      { xMin: 260, xMax: 540, yMin: 10, yMax: 150 },
      { xMin: 260, xMax: 540, yMin: 650, yMax: 790 },
    ]
  }

  if (compositionField.type === 'asymmetric') {
    const xSide = compositionField.dominant.x > CENTER ? [430, 765] : [35, 370]
    const ySide = compositionField.dominant.y > CENTER ? [430, 760] : [40, 370]
    return [
      { xMin: xSide[0], xMax: xSide[1], yMin: ySide[0], yMax: ySide[1] },
      { xMin: xSide[0], xMax: xSide[1], yMin: 245, yMax: 555 },
      { xMin: 245, xMax: 555, yMin: ySide[0], yMax: ySide[1] },
    ]
  }

  if (compositionField.type === 'diagonal') {
    return compositionField.direction === 1
      ? [
          { xMin: 80, xMax: 260, yMin: 80, yMax: 260 },
          { xMin: 305, xMax: 495, yMin: 305, yMax: 495 },
          { xMin: 540, xMax: 720, yMin: 540, yMax: 720 },
        ]
      : [
          { xMin: 540, xMax: 720, yMin: 80, yMax: 260 },
          { xMin: 305, xMax: 495, yMin: 305, yMax: 495 },
          { xMin: 80, xMax: 260, yMin: 540, yMax: 720 },
        ]
  }

  const baseAnchors = [
    { xMin: 305, xMax: 495, yMin: 310, yMax: 490 },
    { xMin: 130, xMax: 270, yMin: 150, yMax: 300 },
    { xMin: 530, xMax: 670, yMin: 150, yMax: 300 },
    { xMin: 145, xMax: 285, yMin: 520, yMax: 675 },
    { xMin: 520, xMax: 675, yMin: 520, yMax: 675 },
  ]

  if (shape === 'triangle') {
    baseAnchors[1] = { xMin: 285, xMax: 390, yMin: 170, yMax: 310 }
    baseAnchors[2] = { xMin: 410, xMax: 515, yMin: 170, yMax: 310 }
  }

  if (fillStyle === 'bleed') {
    baseAnchors.push(
      { xMin: 20, xMax: 145, yMin: 320, yMax: 520 },
      { xMin: 655, xMax: 780, yMin: 320, yMax: 520 },
      { xMin: 280, xMax: 520, yMin: 15, yMax: 145 },
      { xMin: 280, xMax: 520, yMin: 655, yMax: 785 },
    )
  }

  return [...baseAnchors].sort(() => random() - 0.5)
}

export function generatePattern({
  text,
  shape,
  theme,
  backgroundMode = 'theme',
  fontMode,
  orientation,
  density,
  sizeMix = 'balanced',
  repeatMode = 'full',
  fillStyle = 'soft',
  preset = 'clean',
  composition = 'balanced',
  seed = 12345,
}) {
  const random = createSeededRandom(seed)
  const compositionField = getCompositionField(composition, random)
  const textTokens = getTextTokens(text, repeatMode)
  const heroTextTokens = getHeroTextTokens(text, repeatMode, preset)
  const textColors = getTextColors(theme)
  const presetSettings = getPresetSettings(preset)
  const fillSettings = getFillSettings(fillStyle)
  fillSettings.presetSettings = presetSettings
  fillSettings.presetHeroScale = presetSettings.heroScale
  fillSettings.rotationScale *= presetSettings.rotationScale
  fillSettings.fillJitter = presetSettings.fillJitter
  fillSettings.fillStyle = fillStyle
  fillSettings.preset = preset
  fillSettings.compositionMode = composition
  fillSettings.shape = shape
  const resolvedDensity = clamp(
    (density?.value ?? DEFAULT_DENSITY) * fillSettings.densityMultiplier * presetSettings.densityMultiplier,
    0.28,
    0.96,
  )
  const quietZones = createQuietZones(random, preset, fillStyle, compositionField)
  const baseOptions = {
    random,
    textTokens,
    heroTextTokens,
    shape,
    orientation,
    density: resolvedDensity,
    bleedAllowance: fillSettings.bleedAllowance,
    quietZones,
    compositionField,
    colors: textColors,
    fontMode,
    sizeMix,
    fillSettings,
  }
  const background = backgroundMode === 'transparent'
    ? null
    : backgroundMode === 'light'
      ? LIGHT_BACKGROUND
      : theme.colors[4]

  return {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    shape,
    seed,
    backgroundMode,
    background,
    items: [
      ...createHeroItems(baseOptions),
      ...createCandidateItems(baseOptions),
      ...createBoundaryItems(baseOptions),
    ],
  }
}
