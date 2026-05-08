import { downloadSvgAsPng } from '../../engine/exportUtils.js'

export function ExportButtons({ svgRef, pattern, exportSize }) {
  async function handlePngDownload() {
    try {
      await downloadSvgAsPng(svgRef.current, 'domlur-pattern.png', exportSize.size)
    } catch (error) {
      console.error('PNG export failed', error)
    }
  }

  return (
    <div className="export-panel">
      <div className="export-info">
        <span>
          PNG Export: {exportSize.size} &times; {exportSize.size} px
        </span>
        <span>Vector PDF: Coming soon</span>
        {pattern.backgroundMode === 'transparent' && <span>Transparent PNG enabled</span>}
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
