// Lint with JS Standard

// Import Node modules
const debug = require('gulp-debug')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const newer = require('gulp-newer')
const path = require('path')
const svgmin = require('gulp-svgmin')
const tap = require('gulp-tap')
const xmlEdit = require('gulp-edit-xml')

// Local helpers
const { book } = require('../helpers/args.js')
const { paths } = require('../helpers/paths.js')
const {
  modifyImageCheck, getFilenameFromPath,
  getFileDetailsFromTap
} = require('../helpers/utilities.js')

// Custom image functions
const imageFunctions = require('require-all')(path.join(__dirname, '/../images/functions'))

// Minify and clean SVGs and copy to destinations.
function svgProcess (outputFormat) {
  console.log('Processing SVG images from ' + paths.img.source)

  let prefix = '' // does this ever get overwritten incorrectly due to async piping?
  let imageFunctionName = {}
  let filename = ''
  const outputFormatAsValidJSVariableName = outputFormat.replace('-', '')

  // Should this SVG be modified?
  const modifyImage = function (file) {
    filename = getFilenameFromPath(file.path)
    const modificationStatus = modifyImageCheck(filename, outputFormat)
    return modificationStatus
  }

  return gulp.src(paths.img.source + '*.svg')
    .pipe(newer(paths.img[outputFormatAsValidJSVariableName]))
    .pipe(tap(function (file) {
      prefix = getFileDetailsFromTap(file).prefix
      imageFunctionName = getFileDetailsFromTap(file).filename
        .replace(/\s/g, '')
        .replace(/-/g, '_')
        .replace(/\./g, '_')
    }))
    .pipe(debug({ title: 'Processing SVG ' }))

    // For EpubCheck-safe SVGs, we remove data- attributes
    // and don't strip defaults like <style "type=text/css">
    .pipe(gulpif(modifyImage, svgmin({
      // The plugins list is the full list of plugins
      // to use. The default list is ignored.
      full: true,
      plugins: [
        // This first pass only runs minifyStyles, to remove CDATA from
        // <style> elements and give later access to inlineStyles.
        'minifyStyles'
      ]
    })))
    .pipe(gulpif(modifyImage, svgmin({
      // Note: `full: true` is a gulp-svgmin option
      // (https://www.npmjs.com/package/gulp-svgmin#options)
      // meaning the plugins list is the full list of plugins
      // to use. The default list is ignored.
      // The `present-default` is the default set of plugins
      // from SVGO: https://svgo.dev/docs/preset-default/
      full: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              cleanupIDs: { prefix: prefix + '-', minify: true },
              convertShapeToPath: false,
              inlineStyles: { onlyMatchedOnce: false },
              removeAttrs: { attrs: 'data.*' },
              removeDesc: false,
              removeTitle: false,
              removeUnknownsAndDefaults: { defaultAttrs: false },
              removeViewBox: false
            }
          }
        },
        'cleanupEnableBackground',
        {
          name: 'cleanupIDs',
          params: {
            prefix: prefix + '-',
            minify: true
          }
        },
        'cleanupListOfValues',
        'convertStyleToAttrs',
        {
          name: 'inlineStyles',
          params: {
            onlyMatchedOnce: false
          }
        },
        {
          name: 'removeAttrs',
          params: {
            attrs: 'data.*'
          }
        },
        'removeDimensions',
        {
          name: 'removeUnknownsAndDefaults',
          params: {
            defaultAttrs: false
          }
        }
      ]
    })))
    .pipe(xmlEdit(function (xml) {
      // Apply SVG manipulation functions stored in
      // _tools/gulp/images/functions.

      // If there is a [book]all_svg.js file in /_tools/gulp/images/functions
      // containing an all_svg function, run that function.
      if (imageFunctions &&
                    imageFunctions[book] &&
                    imageFunctions[book].all_svg &&
                    imageFunctions[book].all_svg.all_svg) {
        console.log('Running the ' + 'all_svg function on ' + filename)
        imageFunctions[book].all_svg.all_svg(xml)
      }

      // If there is a [book]all_svg.js file in a format subfolder
      // of /_tools/gulp/images/functions
      // containing an all_svg function, run that function.
      if (imageFunctions &&
                    imageFunctions[book] &&
                    imageFunctions[book][outputFormat] &&
                    imageFunctions[book][outputFormat].all_svg &&
                    imageFunctions[book][outputFormat].all_svg.all_svg) {
        console.log('Running the ' + outputFormat + ' all_svg function on ' + filename)
        imageFunctions[book][outputFormat].all_svg.all_svg(xml)
      }

      // If there is an image-specific function, run it
      if (imageFunctions &&
                    imageFunctions[book] &&
                    imageFunctions[book][imageFunctionName] &&
                    imageFunctions[book][imageFunctionName][imageFunctionName]) {
        console.log('Running the ' + [imageFunctionName] + ' function on ' + filename)
        imageFunctions[book][imageFunctionName][imageFunctionName](xml)
      }

      // If there is an image- and format-specific specific function, run it
      if (imageFunctions &&
                    imageFunctions[book] &&
                    imageFunctions[book][outputFormat] &&
                    imageFunctions[book][outputFormat][imageFunctionName] &&
                    imageFunctions[book][outputFormat][imageFunctionName][imageFunctionName]) {
        console.log('Running the ' + outputFormat + ' ' + [imageFunctionName] + ' function on ' + filename)
        imageFunctions[book][outputFormat][imageFunctionName][imageFunctionName](xml)
      }

      return xml
    }))
    .pipe(gulp.dest(paths.img[outputFormatAsValidJSVariableName]))
}

function svgsPrintPDF (done) {
  svgProcess('print-pdf')
  done()
}

function svgsScreenPDF (done) {
  svgProcess('screen-pdf')
  done()
}

function svgsWeb (done) {
  svgProcess('web')
  done()
}

function svgsEpub (done) {
  svgProcess('epub')
  done()
}

function svgsApp (done) {
  svgProcess('app')
  done()
}

exports.svgsPrintPDF = svgsPrintPDF
exports.svgsScreenPDF = svgsScreenPDF
exports.svgsWeb = svgsWeb
exports.svgsEpub = svgsEpub
exports.svgsApp = svgsApp
