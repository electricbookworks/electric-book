/* global Prince */

// Lint with JS Standard

function ebAlignToGrid (querySelectorToAlign, querySelectorToLeave) {
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

  let elementsToAlign = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content math[display="block"], .content p, .content ol, .content ul, .content table, .content .figure, .content .video, .content .box, .content .align-to-baseline')

  let elementsToLeave = document.querySelectorAll('.content li > p, .content .figure *')

  if (querySelectorToAlign) {
    elementsToAlign = document.querySelectorAll(querySelectorToAlign)
  }

  if (querySelectorToLeave) {
    elementsToLeave = document.querySelectorAll(querySelectorToLeave)
  }

  if (elementsToAlign) {
    console.log('Aligning elements to baseline grid...')

    // Get the baseline grid. We assume it is the line-height
    // applied to the body element. Need to convert CSS strings to numbers.
    // In Prince, getComputedStyle().lineHeight always returns a value in pt.
    const gridValueWithUnit = window.getComputedStyle(document.body).lineHeight
    const gridValue = parseFloat(gridValueWithUnit.replace(/[a-z]+/, ''))

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

          // Now, the next princeBox might have a margin-top,
          // and if that margin-top is greater than this element's
          // newMarginBottom, Prince may follow CSS standards
          // for collapsing vertical margins and only use the
          // larger margin, rendering our newMarginBottom as zero.
          // But we can't know what the next princeBox is visually,
          // because it might not be the next element in the DOM
          // (e.g. if that's a sidenote or a floated figure).
          // So we can't solve for this, and have to rely on
          // this script fixing the baseline grid again lower down
          // on the page, in the event that margin-collapsing
          // has broken it in this one place.

          // Debugging
          // console.log(element.tagName)
          // if (element.id) { console.log('#' + element.id) }
          // console.log('Grid value with unit: ' + gridValueWithUnit)
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
  Prince.registerPostLayoutFunc(function () {
    ebAlignToGrid()
  })
}

// See https://www.princexml.com/doc/javascript/#multi-pass-formatting
// Check if the Prince object exists,
// in case we're inspecting in a browser.
if (typeof Prince === 'object') {
  Prince.registerPostLayoutFunc(function () {
    ebAlignToGrid()
  })
}
