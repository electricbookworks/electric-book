// Page-by-page pixel comparison between the canonical and current PDF.
// Follows the standard test-module contract: { name, run(context) }.

const fsPath = require('path')
const fs = require('fs')
const { PNG } = require('pngjs')
const pixelmatch = require('pixelmatch')

// Per-pixel colour-distance sensitivity for pixelmatch (0–1). This is
// deliberately fixed; the user-facing `threshold` is the tolerated
// percentage of differing pixels per page (see context.threshold).
const PIXEL_COLOUR_THRESHOLD = 0.1

// Write a PNG buffer to disk, creating parent directories as needed.
function savePng (buffer, destPath) {
  fs.mkdirSync(fsPath.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, buffer)
}

module.exports = {
  name: 'Page pixel comparison',

  run: async function (context) {
    const canonical = context.rendered.canonical
    const current = context.rendered.current
    const threshold = context.threshold
    const pageCount = Math.max(canonical.pages.length, current.pages.length)

    const outputDir = fsPath.join(context.reportDir, context.slug)

    const reportProgress = context.makeProgress
      ? context.makeProgress('comparing pages')
      : function () {}

    const pages = []
    const results = []

    for (let i = 0; i < pageCount; i++) {
      const pageNumber = i + 1
      reportProgress(i + 1, pageCount)
      const canonicalBuffer = canonical.pages[i]
      const currentBuffer = current.pages[i]

      // A page present in one PDF but not the other is a hard failure.
      if (!canonicalBuffer || !currentBuffer) {
        const note = !canonicalBuffer
          ? 'page added in current output'
          : 'page removed from current output'
        const onlyBuffer = canonicalBuffer || currentBuffer
        const imagePath = fsPath.join(outputDir, 'page-' + pageNumber + '-' +
          (canonicalBuffer ? 'canonical' : 'current') + '.png')
        savePng(onlyBuffer, imagePath)
        pages.push({
          page: pageNumber,
          changed: true,
          diffPercent: 100,
          diffPixels: null,
          note,
          canonicalImage: canonicalBuffer ? imagePath : null,
          currentImage: currentBuffer ? imagePath : null,
          diffImage: null
        })
        results.push({ passed: false, message: 'Page ' + pageNumber + ': ' + note })
        continue
      }

      const canonicalPng = PNG.sync.read(canonicalBuffer)
      const currentPng = PNG.sync.read(currentBuffer)

      // Differing page dimensions mean the layout changed; flag the page.
      if (canonicalPng.width !== currentPng.width || canonicalPng.height !== currentPng.height) {
        const canonicalImage = fsPath.join(outputDir, 'page-' + pageNumber + '-canonical.png')
        const currentImage = fsPath.join(outputDir, 'page-' + pageNumber + '-current.png')
        savePng(canonicalBuffer, canonicalImage)
        savePng(currentBuffer, currentImage)
        const note = 'page dimensions changed (' +
          canonicalPng.width + '×' + canonicalPng.height + ' → ' +
          currentPng.width + '×' + currentPng.height + ')'
        pages.push({
          page: pageNumber,
          changed: true,
          diffPercent: 100,
          diffPixels: null,
          note,
          canonicalImage,
          currentImage,
          diffImage: null
        })
        results.push({ passed: false, message: 'Page ' + pageNumber + ': ' + note })
        continue
      }

      const width = canonicalPng.width
      const height = canonicalPng.height
      const diffPng = new PNG({ width, height })
      const diffPixels = pixelmatch(
        canonicalPng.data,
        currentPng.data,
        diffPng.data,
        width,
        height,
        { threshold: PIXEL_COLOUR_THRESHOLD }
      )
      const diffPercent = (diffPixels / (width * height)) * 100
      const changed = diffPercent > threshold

      const pageResult = {
        page: pageNumber,
        changed,
        diffPercent,
        diffPixels,
        note: null,
        canonicalImage: null,
        currentImage: null,
        diffImage: null
      }

      // Only persist images for changed pages, to keep reports small.
      if (changed) {
        const canonicalImage = fsPath.join(outputDir, 'page-' + pageNumber + '-canonical.png')
        const currentImage = fsPath.join(outputDir, 'page-' + pageNumber + '-current.png')
        const diffImage = fsPath.join(outputDir, 'page-' + pageNumber + '-diff.png')
        savePng(canonicalBuffer, canonicalImage)
        savePng(currentBuffer, currentImage)
        savePng(PNG.sync.write(diffPng), diffImage)
        pageResult.canonicalImage = canonicalImage
        pageResult.currentImage = currentImage
        pageResult.diffImage = diffImage
        results.push({
          passed: false,
          message: 'Page ' + pageNumber + ': ' + diffPercent.toFixed(3) + '% of pixels differ'
        })
      }

      pages.push(pageResult)
    }

    const changedPages = pages.filter(function (p) { return p.changed })
    const passed = changedPages.length === 0

    return {
      passed,
      summary: pageCount + ' pages, ' + changedPages.length + ' diffs',
      results: passed ? [{ passed: true, message: 'All ' + pageCount + ' pages match' }] : results,
      pages
    }
  }
}
