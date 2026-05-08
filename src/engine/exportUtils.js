export async function downloadSvgAsPng(
  svgElement,
  fileName = 'domlur-pattern.png',
  exportSize = 800,
) {
  if (!svgElement) {
    throw new Error('Pattern preview is not available.')
  }

  const serializer = new XMLSerializer()
  const svgClone = svgElement.cloneNode(true)
  svgClone.setAttribute('width', '800')
  svgClone.setAttribute('height', '800')
  const svgText = serializer.serializeToString(svgClone)
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  try {
    const image = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = exportSize
    canvas.height = exportSize

    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const pngUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = pngUrl
    link.download = fileName
    link.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not render SVG for PNG export.'))
    image.src = url
  })
}
