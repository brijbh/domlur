import { downloadSvgAsPng } from '../../engine/exportUtils.js'

export function ExportButtons({ svgRef, pattern }) {
  async function handlePngDownload() {
    try {
      await downloadSvgAsPng(svgRef.current)
    } catch (error) {
      console.error('PNG export failed', error)
    }
  }

  return (
    <div className="export-panel">
      <div className="export-info">
        <span>
          PNG Export: {pattern.width} &times; {pattern.height} px
        </span>
        <span>Vector PDF: Coming soon</span>
      </div>
      <div className="export-actions" aria-label="Export options">
        <button type="button" className="button button-secondary" onClick={handlePngDownload}>
          Download PNG
        </button>
        <button type="button" className="button button-disabled" disabled>
          Vector PDF - Coming Soon
        </button>
      </div>
    </div>
  )
}
