// Lint with JS Standard

// Import Node modules
const cheerio = require('gulp-cheerio')
const debug = require('gulp-debug')
const del = require('del')
const gulp = require('gulp')
const iconv = require('iconv-lite')
const rename = require('gulp-rename')
const fsPath = require('path')

// Local helpers
const { book, language } = require('../helpers/args.js')
const { paths } = require('../helpers/paths.js')
const epubTransformations = require('require-all')(fsPath.join(__dirname, '/../transformations/epub'))

// Run epub transformations from scripts in transformations/epub
function runEpubTransformations (done) {
  'use strict'

  gulp.src([paths.epub.src], { base: './' })
    .pipe(cheerio({
      run: function ($) {
        Object.keys(epubTransformations).forEach(async function (transformation) {
          epubTransformations[transformation][transformation]($)
        })
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(debug({ title: 'Performing epub HTML transformations ...' }))
    .pipe(gulp.dest('./'))
  done()
}

// Convert all file names in internal links from .html to .xhtml.
// This is required for epub output to avoid EPUBCheck warnings.
function epubXhtmlLinks (done) {
  'use strict'

  let opfFile = '_site/' + book + '/package.opf'
  if (language) {
    opfFile = '_site/' + book + '/' + language + '/package.opf'
  }

  let ncxFile = '_site/' + book + '/toc.ncx'
  if (language) {
    ncxFile = '_site/' + book + '/' + language + '/toc.ncx'
  }

  gulp.src([paths.epub.src, opfFile, ncxFile], { base: './' })
    .pipe(cheerio({
      run: function ($) {
        let target, asciiTarget, newTarget
        $('[href*=".html"], [src*=".html"], [id], [href^="#"]').each(function () {
          if ($(this).attr('href')) {
            target = $(this).attr('href')
          } else if ($(this).attr('src')) {
            target = $(this).attr('src')
          } else if ($(this).attr('id')) {
            target = $(this).attr('id')
          } else {
            return
          }

          // remove all non-ascii characters using iconv-lite
          // by converting the target from utf-8 to ascii.
          const iconvLiteBuffer = iconv.encode(target, 'utf-8')
          asciiTarget = iconv.decode(iconvLiteBuffer, 'ascii')
          // Note that this doesn't remove illegal characters,
          // which must then be replaced.
          // (See https://github.com/ashtuchkin/iconv-lite/issues/81)
          asciiTarget = asciiTarget.replace(/[�?]/g, '')

          if (!asciiTarget.includes('http')) {
            newTarget = asciiTarget.replace('.html', '.xhtml')
            if ($(this).attr('href')) {
              $(this).attr('href', newTarget)
            } else if ($(this).attr('src')) {
              $(this).attr('src', newTarget)
            } else if ($(this).attr('id')) {
              $(this).attr('id', newTarget)
            }
          }
        })
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(debug({ title: 'Converting internal links to .xhtml in ' }))
    .pipe(gulp.dest('./'))
  done()
}

// Rename epub .html files to .xhtml.
// Creates a copy of the file that must then be cleaned out
// with the subsequent gulp task `epubCleanHtmlFiles``
function epubXhtmlFiles (done) {
  'use strict'

  console.log('Renaming *.html to *.xhtml in ' + paths.epub.src)
  gulp.src(paths.epub.src)
    .pipe(debug({ title: 'Renaming ' }))
    .pipe(rename({
      extname: '.xhtml'
    }))
    .pipe(gulp.dest(paths.epub.dest))
  done()
}

// Clean out renamed .html files
function epubCleanHtmlFiles () {
  'use strict'
  console.log('Removing old *.html files in ' + paths.epub.src)
  return del(paths.epub.src)
}

exports.epubXhtmlLinks = epubXhtmlLinks
exports.epubXhtmlFiles = epubXhtmlFiles
exports.epubCleanHtmlFiles = epubCleanHtmlFiles
exports.runEpubTransformations = runEpubTransformations
