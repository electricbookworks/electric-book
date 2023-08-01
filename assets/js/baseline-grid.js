/* global Prince */

// Lint with JS Standard

function ebAlignToGrid (querySelectorString) {
  // Get all elements we want aligned with baseline grid.
  // Note that unlike InDesign we do not force elements
  // to the next baseline unit. Rather, we add margin-bottom
  // so that they end aligned. Then any following elements
  // will also be aligned with the baseline grid.
  let elementsToAlign = document.querySelectorAll('.align-to-baseline')

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
      const height = parseFloat(princeBox.marginBox('pt').h)
      const difference = height % gridValue

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
    })
  }
}

// See https://www.princexml.com/doc/javascript/#multi-pass-formatting
Prince.registerPostLayoutFunc(ebAlignToGrid)
