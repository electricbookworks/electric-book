// Lint with JS Standard

// Import Node modules
const debug = require('gulp-debug')
const fileExists = require('file-exists')
const gm = require('gulp-gm')
const gulp = require('gulp')
const newer = require('gulp-newer')
const rename = require('gulp-rename')

// Local helpers
const { paths } = require('../helpers/paths.js')

const {
  defaultColorProfile, defaultColorSpace,
  defaultColorProfileGrayscale, defaultColorSpaceGrayscale,
  defaultOutputFormat
} = require('../helpers/colour.js')

const {
  modifyImageCheck, getFilenameFromPath,
  lookupColorSettings
} = require('../helpers/utilities.js')

// Set filetypes to convert, comma separated, no spaces
const filetypes = 'jpg,jpeg,gif,png,tif,tiff'

// Convert source images for print-pdf
function imagesPrintPDF (done) {
  'use strict'

  // Options
  const outputFormat = 'print-pdf'
  const colorProfile = 'PSOcoated_v3.icc'
  const colorSpace = 'cmyk'
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Processing ' + outputFormat + ' images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.printpdf })
      .pipe(newer(paths.img.printpdf))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        const modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(gulp.dest(paths.img.printpdf))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Convert and optimise source images
// for screen-pdf, web, epub, and app
function imagesScreenPDF (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = 'screen-pdf'
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Processing ' + outputFormat + ' images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.screenpdf })
      .pipe(newer(paths.img.screenpdf))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(gulp.dest(paths.img.screenpdf))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Convert and optimise source images
// for screen-pdf, web, epub, and app
function imagesEpub (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = 'epub'
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Processing epub images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.epub })
      .pipe(newer(paths.img.epub))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .resize(810, null, '>') // *
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
            .quality(90)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(gulp.dest(paths.img.epub))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Convert and optimise source images
// for screen-pdf, web, epub, and app
function imagesApp (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = 'app'
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Processing app images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.app })
      .pipe(newer(paths.img.app))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .resize(810, null, '>') // *
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
            .quality(90)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(gulp.dest(paths.img.app))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Convert and optimise source images
// for screen-pdf, web, epub, and app
function imagesWeb (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = defaultOutputFormat
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Processing web images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.web })
      .pipe(newer(paths.img.web))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .resize(810, null, '>') // *
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
            .quality(90)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(gulp.dest(paths.img.web))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Make small images for web use in srcset
function imagesSmall (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = defaultOutputFormat
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Creating small web images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.web })
      .pipe(newer(paths.img.web))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .resize(320, null, '>') // *
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
            .quality(90)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(rename({ suffix: '-320' }))
      .pipe(gulp.dest(paths.img.web))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Make medium images for web use in srcset
function imagesMedium (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = defaultOutputFormat
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Creating medium web images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.web })
      .pipe(newer(paths.img.web))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .resize(640, null, '>') // *
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
            .quality(90)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(rename({ suffix: '-640' }))
      .pipe(gulp.dest(paths.img.web))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Make large images for web use in srcset
function imagesLarge (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = defaultOutputFormat
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Creating large web images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.web })
      .pipe(newer(paths.img.web))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .resize(1024, null, '>') // *
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
            .quality(90)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(rename({ suffix: '-1024' }))
      .pipe(gulp.dest(paths.img.web))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Make extra-large images for web use in srcset
function imagesXLarge (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = defaultOutputFormat
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Creating extra-large web images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.web })
      .pipe(newer(paths.img.web))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .resize(2048, null, '>') // *
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)
            .quality(90)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(rename({ suffix: '-2048' }))
      .pipe(gulp.dest(paths.img.web))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

// Make full-quality images in RGB
function imagesMax (done) {
  'use strict'

  // Set default variables for files,
  // which can be modified during gulp process.
  // Cannot be reset globally because all tasks
  // run asynchronously and values will clash.
  let modifyImage = true

  // Options
  const outputFormat = defaultOutputFormat
  const colorProfile = defaultColorProfile
  const colorSpace = defaultColorSpace
  const colorProfileGrayscale = defaultColorProfileGrayscale
  const colorSpaceGrayscale = defaultColorSpaceGrayscale

  console.log('Creating max-quality web images from ' + paths.img.source)
  if (fileExists.sync('_tools/profiles/' + colorProfile)) {
    gulp.src(paths.img.source + '*.{' + filetypes + '}',
      { ignore: paths.ignore.web })
      .pipe(newer(paths.img.web))

    // --------------------------------------------------------------
    // Same for all bitmap image tasks except `return gmfile` settings
      .pipe(debug({ title: 'Creating ' + outputFormat + ' version of ' }))
      .pipe(gm(function (gmfile) {
        // Get file details
        const filename = getFilenameFromPath(gmfile.source)

        // Check if we should modify this image
        modifyImage = modifyImageCheck(filename, outputFormat)

        // Reset defaults (in case previous image in stream
        // set these values to something else)
        let thisColorSpace = colorSpace
        let thisColorProfile = colorProfile

        // Override
        const colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
          colorProfileGrayscale, colorSpaceGrayscale, outputFormat)
        thisColorSpace = colorSettings.colorSpace
        thisColorProfile = colorSettings.colorProfile

        if (modifyImage) {
          return gmfile
            .profile('_tools/profiles/' + thisColorProfile)
            .colorspace(thisColorSpace)

          // * The '>' option specifies that the image should not be made larger
          //   if the original's width is less than the target width.
          //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
        } else {
          return gmfile
            .define('jpeg:preserve-settings')
            .compress('None')
            .quality(100)
        }
        // --------------------------------------------------------------
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(rename({ suffix: '-max' }))
      .pipe(gulp.dest(paths.img.web))
  } else {
    console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.')
    return
  }
  done()
}

exports.imagesPrintPDF = imagesPrintPDF
exports.imagesScreenPDF = imagesScreenPDF
exports.imagesEpub = imagesEpub
exports.imagesApp = imagesApp
exports.imagesWeb = imagesWeb
exports.imagesSmall = imagesSmall
exports.imagesMedium = imagesMedium
exports.imagesLarge = imagesLarge
exports.imagesXLarge = imagesXLarge
exports.imagesMax = imagesMax
