/* global Prince */

// Lint with JS Standard

function ebAlignToGrid (querySelectorString) {
  // Get all elements we want aligned with baseline grid.
  // Note that unlike InDesign we do not force elements
  // to the next baseline unit. Rather, we add margin-bottom
  // so that they end aligned. Then any following elements
  // will also be aligned with the baseline grid.
  // This is mainly because Prince collapses margin-top
  // on elements that appear at the top of a page,
  // and we can't add margin-top to those, nor distinguish them
  // from other elements in order to use a different algorithm.
  // We use margin, not padding, because in testing it has been
  // more reliable (e.g. padding on a table doesn't add space).

  let elementsToAlign = document.querySelectorAll('h1, h2, h3, h4, h5, img, math[display="block"], p, ol, ul, table, .figure-images, .video, .box, .align-to-baseline')

  const elementsToLeave = document.querySelectorAll('li > p')

  if (querySelectorString) {
    elementsToAlign = document.querySelectorAll(querySelectorString)
  }

  if (elementsToAlign) {
    console.log('Aligning elements to baseline grid...')

    // Get the baseline grid. We assume it is the line-height
    // applied to the body element. Need to convert CSS strings to numbers.
    const gridValuePt = window.getComputedStyle(document.body).lineHeight
    const gridValue = parseFloat(gridValuePt.replace('pt', ''))

    // For each element:
    // 1. measure its height
    // 2. get the difference to the next baseline grid multiple
    // 3. add that difference to its margin-bottom

    elementsToAlign.forEach(function (element) {
      // Get the Prince box info
      const princeBox = element.getPrinceBoxes()[0]

      // Check that we can align this
      let alignThisElement = true

      elementsToLeave.forEach(function (elementToLeave) {
        if (elementToLeave === element) {
          alignThisElement = false
        }
      })

      if (element.classList.contains('release-from-baseline-grid')) {
        alignThisElement = false
      }

      if (princeBox && alignThisElement) {
        const height = parseFloat(princeBox.marginBox('pt').h)
        const difference = height % gridValue

        if (difference > 0) {
          // Get the element's existing margin-bottom
          const elementMarginBottom = parseFloat(princeBox.marginBottom)

          // Add more margin to that, equal to the baseline grid value
          // less the (modulo) difference calculated above.
          const newMarginBottom = elementMarginBottom + (gridValue - difference)

          // Give the element that new margin-bottom
          element.style.marginBottom = newMarginBottom + 'pt'

          // Debugging
          // console.log('Grid value: ' + gridValue)
          // console.log('Height: ' + height)
          // console.log('Difference: ' + difference)
          // console.log('Original margin-bottom: ' + elementMarginBottom)
          // console.log('New margin-bottom ' + newMarginBottom)
        }
      }
    })
  }

  // Layout changes may have knock-on effects,
  // so we run this again. The max number of iterations
  // is passed to Prince (in helpers.js) as `max-passes`.
  Prince.registerPostLayoutFunc(ebAlignToGrid)
}

// See https://www.princexml.com/doc/javascript/#multi-pass-formatting
// Check if the Prince object exists,
// in case we're inspecting in a browser.
if (typeof Prince === 'object') {
  Prince.registerPostLayoutFunc(ebAlignToGrid)
}
