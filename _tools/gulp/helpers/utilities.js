// Lint with JS Standard

// Local helpers
const { imageSettings } = require('./paths.js')
const { book } = require('../helpers/args.js')

// Load utilities from elsewhere in this repo
const { ebSlugify } = require('@electricbookworks/electric-book-modules/assets/js/_src/utilities.js')
if (!ebSlugify) {
  console.log('Could not load ebSlugify from @electricbookworks/electric-book-modules/assets/js/_src/utilities.js')
}

// Function for checking if an image should be processed
function modifyImageCheck (filename, format) {
  // Assume true
  let modifyImage = true

  if (!format) {
    format = 'all'
  }

  if (imageSettings && (imageSettings._all || imageSettings[book])) {
    let settings

    // If there are settings for all books, use those.
    // Otherwise, use the settings for this book.
    if (imageSettings._all) {
      settings = imageSettings._all
    } else {
      settings = imageSettings[book]
    }

    settings.forEach(function (image) {
      if (image.file === filename) {
        // User feedback for images not being modified
        const noModifyFeedback = filename + ' not modified for ' + format + ' format(s), as specified in images.yml'

        // We use the same SVG for all output formats. So:
        // if this is an SVG, do *any* of the output formats
        // have 'modify' set to no? If so, do not modify it.
        if (filename.match(/[^\s]+\.svg$/gi)) {
          const outputFormats = ['print-pdf', 'screen-pdf', 'web', 'epub', 'app', 'all']
          outputFormats.forEach(function (format) {
            if (image[format] && image[format].modify && image[format].modify === 'no') {
              console.log(noModifyFeedback)
              modifyImage = false
            }
          })
        }

        // If an image has a 'modify' setting for this or all formats...
        if (image.modify || (image[format] && image[format].modify) ||
                        (image._all && image._all.modify)) {
          // ... and it's set to no, do not modify.
          if (image.modify === 'no' || (image[format] && image[format].modify === 'no') ||
                            (image._all && image._all.modify === 'no')) {
            console.log(noModifyFeedback)
            modifyImage = false
          }
        }
      }
    })
  }

  return modifyImage
}

// Function for getting a filename in gulp tap
function getFilenameFromPath (path) {
  let filename = path.split('/').pop() // for unix slashes
  filename = filename.split('\\').pop() // for windows backslashes
  return filename
}

// Function for default gulp tap step
function getFileDetailsFromTap (file, format) {
  if (!format) {
    format = 'all'
  }

  const filename = getFilenameFromPath(file.path)

  return {
    prefix: file.basename.replace('.', '').replace(' ', ''),
    filename,
    modifyImage: modifyImageCheck(filename, format)
  }
}

function lookupColorSettings (gmfile,
  colorProfile, colorSpace,
  colorProfileGrayscale, colorSpaceGrayscale,
  outputFormat) {
  const filename = getFilenameFromPath(gmfile.source)

  // Look up image settings
  if (imageSettings && (imageSettings._all || imageSettings[book])) {
    let settings

    // If there are settings for all books, use those.
    // Otherwise, use the settings for this book.
    if (imageSettings._all) {
      settings = imageSettings._all
    } else {
      settings = imageSettings[book]
    }

    settings.forEach(function (image) {
      if (image.file === filename || image.file === '_all') {
        if (image[outputFormat] && image[outputFormat].colorspace === 'gray') {
          colorProfile = colorProfileGrayscale
          colorSpace = colorSpaceGrayscale
        }
      }
    })
  }

  return {
    colorSpace,
    colorProfile
  }
}

exports.modifyImageCheck = modifyImageCheck
exports.getFilenameFromPath = getFilenameFromPath
exports.getFileDetailsFromTap = getFileDetailsFromTap
exports.lookupColorSettings = lookupColorSettings
exports.ebSlugify = ebSlugify
