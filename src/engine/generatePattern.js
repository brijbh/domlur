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

function getToken(tokens, index) {
  return tokens[index % tokens.length]
}

function isPointInsideShape(x, y, size, shape) {
  const center = size / 2
  const dx = x - center
  const dy = y - center

  if (shape === 'circle') {
    return dx * dx + dy * dy <= SHAPE_SIZES.circleRadius * SHAPE_SIZES.circleRadius
  }

  if (shape === 'square') {
    return Math.abs(dx) <= SHAPE_SIZES.squareHalf && Math.abs(dy) <= SHAPE_SIZES.squareHalf
  }

  if (shape === 'rectangle') {
    return (
      Math.abs(dx) <= SHAPE_SIZES.rectangleHalfWidth &&
      Math.abs(dy) <= SHAPE_SIZES.rectangleHalfHeight
    )
  }

  if (shape === 'diamond') {
    return Math.abs(dx) + Math.abs(dy) <= SHAPE_SIZES.diamondLimit
  }

  if (shape === 'triangle') {
    const top = SHAPE_SIZES.triangleTop
    const bottom = SHAPE_SIZES.triangleBottom

    if (y < top || y > bottom) {
      return false
    }

    const progress = (y - top) / (bottom - top)
    const halfWidth = progress * SHAPE_SIZES.triangleHalfWidth
    return Math.abs(dx) <= halfWidth
  }

  return false
}

function isNearShapeBoundary(x, y, size, shape) {
  if (!isPointInsideShape(x, y, size, shape)) {
    return false
  }

  const center = size / 2
  const dx = x - center
  const dy = y - center

  if (shape === 'circle') {
    const distance = Math.hypot(dx, dy)
    return distance >= SHAPE_SIZES.circleRadius * 0.72
  }

  if (shape === 'square') {
    const distance = Math.max(Math.abs(dx), Math.abs(dy))
    return distance >= SHAPE_SIZES.squareHalf * 0.72
  }

  if (shape === 'rectangle') {
    const xDistance = Math.abs(dx) / SHAPE_SIZES.rectangleHalfWidth
    const yDistance = Math.abs(dy) / SHAPE_SIZES.rectangleHalfHeight
    return Math.max(xDistance, yDistance) >= 0.74
  }

  if (shape === 'diamond') {
    return Math.abs(dx) + Math.abs(dy) >= SHAPE_SIZES.diamondLimit * 0.72
  }

  if (shape === 'triangle') {
    const progress = (y - SHAPE_SIZES.triangleTop) /
      (SHAPE_SIZES.triangleBottom - SHAPE_SIZES.triangleTop)
    const halfWidth = progress * SHAPE_SIZES.triangleHalfWidth
    const sideDistance = halfWidth - Math.abs(dx)
    const bottomDistance = SHAPE_SIZES.triangleBottom - y

    return sideDistance <= 82 || bottomDistance <= 90
  }

  return false
}

function getRotation(random, orientation) {
  if (orientation === 'horizontal') {
    return randomBetween(random, -4, 4)
  }

  if (orientation === 'vertical') {
    return randomBetween(random, 86, 94)
  }

  if (orientation === 'diagonal') {
    const diagonalRange = random() > 0.5 ? [25, 45] : [-45, -25]
    return randomBetween(random, diagonalRange[0], diagonalRange[1])
  }

  const baseRotation = pickRandom(random, [0, 90, -35, 35])
  return baseRotation + randomBetween(random, -7, 7)
}

function getHeroItemCount(sizeMix) {
  if (sizeMix === 'even') {
    return 1
  }

  if (sizeMix === 'bold') {
    return 4
  }

  if (sizeMix === 'poster') {
    return 6
  }

  return 3
}

function getBoundaryItemCount(density) {
  if (density <= 0.5) {
    return 24
  }

  if (density >= 0.85) {
    return 36
  }

  if (density >= 0.72) {
    return 32
  }

  return 28
}

function getFontSize(random, sizeMix, isHero, isBoundary) {
  if (sizeMix === 'even') {
    if (isHero) {
      return Math.round(randomBetween(random, 32, 42))
    }

    if (isBoundary) {
      return Math.round(randomBetween(random, 14, 24))
    }

    return Math.round(randomBetween(random, 22, 30))
  }

  if (isHero) {
    if (sizeMix === 'bold') {
      return Math.round(randomBetween(random, 54, 78))
    }

    if (sizeMix === 'poster') {
      return Math.round(randomBetween(random, 72, 110))
    }

    return Math.round(randomBetween(random, 42, 64))
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
  isHero,
  isBoundary = false,
}) {
  const fontSize = getFontSize(random, sizeMix, isHero, isBoundary)

  return {
    id,
    text: getToken(textTokens, tokenIndex),
    x: Math.round(x),
    y: Math.round(y),
    rotate: Number(getRotation(random, orientation).toFixed(2)),
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
  colors,
  fontMode,
  sizeMix,
}) {
  const items = []
  const cellWidth = CANVAS_SIZE / GRID_COLS
  const cellHeight = CANVAS_SIZE / GRID_ROWS

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      if (random() > density) {
        continue
      }

      const baseX = cellWidth * col + cellWidth / 2
      const baseY = cellHeight * row + cellHeight / 2
      const x = baseX + randomBetween(random, -cellWidth * 0.36, cellWidth * 0.36)
      const y = baseY + randomBetween(random, -cellHeight * 0.36, cellHeight * 0.36)

      if (!isPointInsideShape(x, y, CANVAS_SIZE, shape)) {
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
  colors,
  fontMode,
  sizeMix,
}) {
  const items = []
  const targetCount = getBoundaryItemCount(density)
  let attempts = 0

  while (items.length < targetCount && attempts < 1000) {
    attempts += 1

    const x = randomBetween(random, 34, CANVAS_SIZE - 34)
    const y = randomBetween(random, 34, CANVAS_SIZE - 34)

    if (!isNearShapeBoundary(x, y, CANVAS_SIZE, shape)) {
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
        isHero: false,
        isBoundary: true,
      }),
    )
  }

  return items
}

function createHeroItems({ random, textTokens, shape, orientation, colors, fontMode, sizeMix }) {
  const items = []
  const heroItemCount = getHeroItemCount(sizeMix)
  const heroZones = [
    { x: CENTER, y: CENTER },
    { x: CENTER - 185, y: CENTER - 150 },
    { x: CENTER + 185, y: CENTER + 150 },
    { x: CENTER + 150, y: CENTER - 180 },
    { x: CENTER - 155, y: CENTER + 180 },
  ]

  for (let index = 0; index < heroItemCount; index += 1) {
    const zone = heroZones[index % heroZones.length]
    let point = null

    for (let attempt = 0; attempt < 18; attempt += 1) {
      const x = zone.x + randomBetween(random, -78, 78)
      const y = zone.y + randomBetween(random, -78, 78)

      if (isPointInsideShape(x, y, CANVAS_SIZE, shape)) {
        point = { x, y }
        break
      }
    }

    if (!point) {
      continue
    }

    items.push(
      createItem({
        id: `hero-${index}`,
        textTokens,
        tokenIndex: index,
        x: point.x,
        y: point.y,
        random,
        orientation,
        colors,
        fontMode,
        sizeMix,
        isHero: true,
      }),
    )
  }

  return items
}

export function generatePattern({
  text,
  shape,
  theme,
  fontMode,
  orientation,
  density,
  sizeMix = 'balanced',
  repeatMode = 'full',
  seed = 12345,
}) {
  const random = createSeededRandom(seed)
  const textTokens = getTextTokens(text, repeatMode)
  const textColors = getTextColors(theme)
  const baseOptions = {
    random,
    textTokens,
    shape,
    orientation,
    density: density?.value ?? DEFAULT_DENSITY,
    colors: textColors,
    fontMode,
    sizeMix,
  }

  return {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    shape,
    seed,
    background: theme.colors[4],
    items: [
      ...createCandidateItems(baseOptions),
      ...createBoundaryItems(baseOptions),
      ...createHeroItems(baseOptions),
    ],
  }
}
