// Lint with JS Standard

// This is a sample file included in the Electric Book Template
// for demonstration purposes.

// This function changes certain hex-value colours in naples.svg
// to a specific CMYK value, in a syntax PrinceXML supports.

const colors = [
  {
    old: '#f8c300',
    new: 'cmyk(0.05,0.2,1.0,0.05)'
  },
  {
    old: '#da271d',
    new: 'cmyk(0.0,0.9,0.9,0.1)'
  }
]

function naples_svg (xml) { // eslint-disable-line
  'use strict'

  // Get all the paths and groups (which have fills)
  // and put them in a single array for updating.
  const paths = xml.svg.path
  const groups = xml.svg.g
  const elementsToChange = paths.concat(groups)

  // For each element, update the fill colour
  // if it matches an old colour in `colors`.
  elementsToChange.forEach(function (element) {
    colors.forEach(function (color) {
      if (color.old === element.$.fill) {
        element.$.fill = color.new
      }
    })
  })

  return xml
}

exports.naples_svg = naples_svg // eslint-disable-line
