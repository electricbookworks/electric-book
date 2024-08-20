// Lint with JS Standard

// Import Node modules
const cheerio = require('gulp-cheerio')
const debug = require('gulp-debug')
const gulp = require('gulp')
const fsPath = require('path')

// Local helpers
const { merged } = require('../helpers/args.js')
const { paths } = require('../helpers/paths.js')
const pdfTransformations = require('require-all')(fsPath.join(__dirname, '/../transformations/pdf'))

// Run transformations from scripts in transformations/pdf
function runPDFTransformations (done) {
  'use strict'

  // Are we processing one merged.html file,
  // or each text path separately?
  // Not that the true/false value for merged
  // is a string here, not a Boolean.
  let filesToProcess = paths.text.src
  if (merged === 'true') {
    filesToProcess = paths.text.merged
  }

  gulp.src(filesToProcess, { base: './' })
    .pipe(cheerio({
      run: function ($) {
        Object.keys(pdfTransformations).forEach(async function (transformation) {
          pdfTransformations[transformation][transformation]($)
        })
      },
      parserOptions: {
        // XML mode causes problems with duplicating line breaks;
        // avoid except where necessary for epub output.
        xmlMode: false
      }
    }))
    .pipe(debug({ title: 'Performing HTML transformations ...' }))
    .pipe(gulp.dest('./'))
  done()
}

exports.runPDFTransformations = runPDFTransformations
