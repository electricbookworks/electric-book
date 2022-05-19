// Lint with JS Standard

// Import Node modules
const debug = require('gulp-debug')
const gulp = require('gulp')
const gulpif = require('gulp-if')
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

// TO DO: process formats separately even for SVG,
// so that we can do CMYK SVG functions. You
// may need https://stackoverflow.com/a/42067036/1781075

// Minify and clean SVGs and copy to destinations.
// For EpubCheck-safe SVGs, we remove data- attributes
// and don't strip defaults like <style "type=text/css">
function svgs (done) {
  console.log('Processing SVG images from ' + paths.img.source)

  let prefix = '' // does this ever get overwritten incorrectly due to async piping?
  let imageFunctionName = {}
  let filename = ''

  // Since SVGs are used as-as for all output formats,
  // we can perform this check with gulpif based only
  // on the file path, which is accessible with gulpif.
  const modifyImage = function (file) {
    filename = getFilenameFromPath(file.path)
    const modificationStatus = modifyImageCheck(filename)
    return modificationStatus
  }

  gulp.src(paths.img.source + '*.svg')
    .pipe(tap(function (file) {
      prefix = getFileDetailsFromTap(file).prefix
      imageFunctionName = getFileDetailsFromTap(file).filename
        .replace(/\s/g, '')
        .replace(/-/g, '_')
        .replace(/\./g, '_')
    }))
    .pipe(debug({ title: 'Processing SVG ' }))
    .pipe(gulpif(modifyImage, svgmin({
      plugins: [
        // This first pass only runs minifyStyles, to remove CDATA from
        // <style> elements and give later access to inlineStyles.
        { minifyStyles: true },
        { removeDoctype: false },
        { removeXMLProcInst: false },
        { removeComments: false },
        { removeMetadata: false },
        { removeXMLNS: false },
        { removeEditorsNSData: false },
        { cleanupAttrs: false },
        { mergeStyles: false },
        { inlineStyles: false },
        { convertStyleToAttrs: false },
        { cleanupIDs: false },
        { prefixIds: false },
        { removeRasterImages: false },
        { removeUselessDefs: false },
        { cleanupNumericValues: false },
        { cleanupListOfValues: false },
        { convertColors: false },
        { removeUnknownsAndDefaults: false },
        { removeNonInheritableGroupAttrs: false },
        { removeUselessStrokeAndFill: false },
        { removeViewBox: false },
        { cleanupEnableBackground: false },
        { removeHiddenElems: false },
        { removeEmptyText: false },
        { convertShapeToPath: false },
        { convertEllipseToCircle: false },
        { moveElemsAttrsToGroup: false },
        { moveGroupAttrsToElems: false },
        { collapseGroups: false },
        { convertPathData: false },
        { convertTransform: false },
        { removeEmptyAttrs: false },
        { removeEmptyContainers: false },
        { mergePaths: false },
        { removeUnusedNS: false },
        { sortAttrs: false },
        { sortDefsChildren: false },
        { removeTitle: false },
        { removeDesc: false },
        { removeDimensions: false },
        { removeAttrs: false },
        { removeAttributesBySelector: false },
        { removeElementsByAttr: false },
        { addClassesToSVGElement: false },
        { removeStyleElement: false },
        { removeScriptElement: false },
        { addAttributesToSVGElement: false },
        { removeOffCanvasPaths: false },
        { reusePaths: false }
      ]
    })))
    .pipe(gulpif(modifyImage, svgmin(function getOptions () {
      return {
        plugins: [
          {
            // We definitely want a viewBox
            removeViewBox: false
          },
          {
            // With a viewBox, we can remove these
            removeDimensions: true
          },
          {
            // We can remove data- attributes
            removeAttrs: {
              attrs: 'data.*'
            }
          },
          {
            // Remove unknown elements, but not default values
            removeUnknownsAndDefaults: {
              defaultAttrs: false
            }
          },
          {
            // We want titles for accessibility
            removeTitle: false
          },
          {
            // We want descriptions for accessibility
            removeDesc: false
          },
          {
            // Default
            convertStyleToAttrs: true
          },
          {
            // Default
            removeUselessStrokeAndFill: true
          },
          {
            inlineStyles: {
              onlyMatchedOnce: false
            }
          },
          {
            // Default
            cleanupAttrs: true
          },
          {
            // Default
            removeDoctype: true
          },
          {
            // Default
            removeXMLProcInst: true
          },
          {
            // Default
            removeComments: true
          },
          {
            // Default
            removeMetadata: true
          },
          {
            // Default
            removeUselessDefs: true
          },
          {
            // Default
            removeXMLNS: false
          },
          {
            // Default
            removeEditorsNSData: true
          },
          {
            // Default
            removeEmptyAttrs: true
          },
          {
            // Default
            removeHiddenElems: true
          },
          {
            // Default
            removeEmptyText: true
          },
          {
            // Default
            removeEmptyContainers: true
          },
          {
            // Default
            cleanupEnableBackground: true
          },
          {
            // Default
            minifyStyles: true
          },
          {
            // Default
            convertColors: true
          },
          {
            // Default
            convertPathData: true
          },
          {
            // Default
            convertTransform: true
          },
          {
            // Default
            removeNonInheritableGroupAttrs: true
          },
          {
            // Default
            removeUselessStrokeAndFill: true
          },
          {
            // Default
            removeUnusedNS: true
          },
          {
            // Default
            prefixIds: false
          },
          {
            // Prefix and minify IDs
            cleanupIDs: {
              prefix: prefix + '-',
              minify: true
            }
          },
          {
            // Default
            cleanupNumericValues: true
          },
          {
            // Default
            cleanupListOfValues: true
          },
          {
            // Default
            moveElemsAttrsToGroup: true
          },
          {
            // Default
            collapseGroups: true
          },
          {
            // Default
            removeRasterImages: false
          },
          {
            // Default
            mergePaths: true
          },
          {
            // Default
            convertShapeToPath: false
          },
          {
            // Default
            convertEllipseToCircle: true
          },
          {
            // Default
            sortAttrs: false
          },
          {
            // Default
            sortDefsChildren: true
          },
          {
            // Default
            removeAttributesBySelector: false
          },
          {
            // Default
            removeElementsByAttr: false
          },
          {
            // Default
            addClassesToSVGElement: false
          },
          {
            // Default
            addAttributesToSVGElement: false
          },
          {
            // Default
            removeOffCanvasPaths: false
          },
          {
            // Default
            removeStyleElement: false
          },
          {
            // Default
            removeScriptElement: false
          },
          {
            // Default
            reusePaths: false
          }
        ]
      }
    }).on('error', function (e) {
      console.log(e)
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

      // If there is an image-specific function, run it
      if (imageFunctions &&
                    imageFunctions[book] &&
                    imageFunctions[book][imageFunctionName] &&
                    imageFunctions[book][imageFunctionName][imageFunctionName]) {
        console.log('Running the ' + [imageFunctionName] + ' function on ' + filename)
        imageFunctions[book][imageFunctionName][imageFunctionName](xml)
      }
      return xml
    }))
    .pipe(gulp.dest(paths.img.printpdf))
    .pipe(gulp.dest(paths.img.screenpdf))
    .pipe(gulp.dest(paths.img.web))
    .pipe(gulp.dest(paths.img.epub))
    .pipe(gulp.dest(paths.img.app))
  done()
}

exports.svgs = svgs
