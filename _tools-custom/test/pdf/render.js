// Render PDF pages to PNG image buffers using pdf-to-img.
// pdf-to-img is ESM-only, so it is loaded with a dynamic import.

// pdfjs renders at 72 DPI when scale is 1, so scale = dpi / 72.
const BASE_DPI = 72

// Render every page of a PDF to a PNG buffer.
// Returns { pages: [Buffer], metadata: {...} }.
async function renderPages (pdfPath, options = {}) {
  const dpi = options.dpi || 150
  const scale = dpi / BASE_DPI
  const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null

  const { pdf } = await import('pdf-to-img')
  const document = await pdf(pdfPath, { scale })
  const total = document.length

  const pages = []
  for await (const page of document) {
    pages.push(page)
    if (onProgress) {
      onProgress(pages.length, total)
    }
  }

  const metadata = document.metadata || {}
  const length = document.length

  await document.destroy()

  return { pages, metadata, length }
}

// Read a PDF's page count and metadata without rendering every page.
async function readInfo (pdfPath) {
  const { pdf } = await import('pdf-to-img')
  const document = await pdf(pdfPath, { scale: 1 })
  const info = { length: document.length, metadata: document.metadata || {} }
  await document.destroy()
  return info
}

module.exports = { renderPages, readInfo }
