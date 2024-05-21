/* global ebCheckForPage, settings, SVGInject */

// This script helps get sensible SVGs into our pages.
// It first injects all SVGs linked as img tags
// into the code of the page itself, so that they
// have access to the page's CSS. This is mostly for fonts.
// Since some SVG styles use different font names
// to the ones in the site's global CSS, this script also
// replaces font names and related attributes in injected SVGs.

// Change font-family names in style attributes
function ebSVGFontFixes (svg) {
  'use strict'

  // Get the elements in the SVG with font-family set
  const ebFontFixElements = svg.querySelectorAll('[font-family], [style]')

  // What fonts do we want to change the names of?
  // Optionally add a new font-weight, e.g. for 'OpenSans-Bold',
  // which should be Open Sans with a bold weight.
  // Note that some apps include quotes around properties.
  const fontsToChange = [
    {
      oldFontFace: 'SourceSansPro-Regular',
      newFontFace: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
    },
    {
      oldFontFace: '"SourceSansPro-Regular"',
      newFontFace: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
    },
    {
      oldFontFace: '"SourceSansPro-Bold"',
      newFontFace: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      newFontWeight: 'bold'
    }
  ]

  // Loop through the elements, making all the font changes
  // that we've listed above.
  let i, j
  for (i = 0; i < ebFontFixElements.length; i += 1) {
    for (j = 0; j < fontsToChange.length; j += 1) {
      // Change font-family attributes
      if (ebFontFixElements[i].getAttribute('font-family') ===
                    fontsToChange[j].oldFontFace) {
        ebFontFixElements[i].setAttribute('font-family',
          fontsToChange[j].newFontFace)
        if (fontsToChange[j].newFontWeight) {
          ebFontFixElements[i].setAttribute('font-weight',
            fontsToChange[j].newFontWeight)
        }
        if (fontsToChange[j].newFontStyle) {
          ebFontFixElements[i].setAttribute('font-style',
            fontsToChange[j].newFontStyle)
        }
      }

      // Change font properties in style attributes
      if (ebFontFixElements[i].style.fontFamily === fontsToChange[j].oldFontFace) {
        ebFontFixElements[i].style.fontFamily = fontsToChange[j].newFontFace
        if (ebFontFixElements[i].style.fontWeight || fontsToChange[j].newFontWeight) {
          ebFontFixElements[i].style.fontWeight = fontsToChange[j].newFontWeight
        }
        if (ebFontFixElements[i].style.fontStyle || fontsToChange[j].newFontStyle) {
          ebFontFixElements[i].style.fontStyle = fontsToChange[j].newFontStyle
        }
      }
    }
  }
}

// Get a title and desc to use in the SVG
function ebSVGInjectImageData (img) {
  // To define the title and description for an SVG:
  // - the img title attribute, if any, becomes the SVG title
  // - the img alt text, if any, text becomes the SVG desc.
  // But if the img has no title attribute:
  // - if the img is in a figure with a caption,
  //   use the caption text for the SVG title
  // - otherwise use alt text as the title, and omit the desc,
  //   which would simply duplicate the title.

  let title, desc

  // Get a description for the SVG <desc>
  if (img.alt) {
    desc = img.alt
  }

  // Get text for the SVG <title>
  if (img.title) {
    title = img.title
  } else if (img.closest('.figure') &&
      img.closest('.figure').querySelector('.caption')) {
    title = img.closest('.figure').querySelector('.caption').innerText
  } else if (img.alt) {
    title = img.alt
    desc = ''
  }

  return {
    title,
    desc
  }
}

// Include a title and desc in the SVG
function ebSVGInjectTitleDesc (svg, imgData) {
  // The SVGInject vendor script does not include alt text
  // in injected SVGs. So we need to compensate for that.
  // SVGInject does support turning an image's title="" attribute
  // into an SVG <title> element. This isn't enough for us.
  // We get info about the image in ebSVGInjectImageData
  // and then add it to the SVG using SVGInject's beforeInject property.
  // We use <desc>, too, because alt text on complex images can be long,
  // and that would be inappropriate for a <title>, especially
  // if a shorter title exists in the form of a figure caption.

  if (imgData.desc) {
    if (svg.querySelector('desc')) {
      svg.querySelector('desc').remove()
    }

    svg.desc = imgData.desc
    const descElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc')
    descElement.textContent = imgData.desc
    svg.insertAdjacentElement('afterbegin', descElement)
  }

  if (imgData.title) {
    if (svg.querySelector('title')) {
      svg.querySelector('title').remove()
    }

    svg.title = imgData.title
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title')
    titleElement.textContent = imgData.title
    svg.insertAdjacentElement('afterbegin', titleElement)
  }
}

// SVGInject options (https://github.com/iconfu/svg-inject#svginject)
// - run the font fixes after injecting SVGs
SVGInject.setOptions({
  afterLoad: function (svg) {
    ebSVGFontFixes(svg)
  }
})

//  Get the testing version of the SVG, if any
function ebGetTestingSvgSrc (svgSrc) {
  const devImages = settings.remoteMedia.development
  const testImages = settings.remoteMedia.testing
  const svgTestingSrc = svgSrc.replace(devImages, testImages)

  if (ebCheckForPage(svgTestingSrc)) {
    return svgTestingSrc
  } else {
    return false
  }
}

// Run svg-inject.min.js on all images
// that have an 'inject-svg' class.
function ebInjectSVGs () {
  const ebSVGsToInject = document.querySelectorAll('img.inject-svg:not(.no-inject-svg)')

  ebSVGsToInject.forEach(function (img) {
    // Set the beforeInject option for each image
    // so that each SVG receives the correct <title> and <desc>

    SVGInject.setOptions({
      beforeInject: function (img, svg) {
        ebSVGInjectTitleDesc(svg, ebSVGInjectImageData(img))
      }
    })

    // Then inject the SVG
    SVGInject(img)
  })
}

// Go
ebInjectSVGs()
