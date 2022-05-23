// Lint with JS Standard

// Import Node modules
const debug = require('gulp-debug')
const gulp = require('gulp')
const mathjaxPage = require('gulp-mathjax-page')

// Local helpers
const { paths } = require('../helpers/paths.js')

// Process MathJax in output HTML

// Settings for mathjax-node-page. leave empty for defaults.
// https://www.npmjs.com/package/gulp-mathjax-page
const mjpageOptions = {
  mjpageConfig: {
    format: ['TeX'], // determines type of pre-processors to run
    output: 'svg', // global override for output option; 'svg', 'html' or 'mml'
    tex: {}, // configuration options for tex pre-processor, cf. lib/tex.js
    ascii: {}, // configuration options for ascii pre-processor, cf. lib/ascii.js
    singleDollars: false, // allow single-dollar delimiter for inline TeX
    fragment: false, // return body.innerHTML instead of full document
    cssInline: true, // determines whether inline css should be added
    jsdom: {}, // jsdom-related options
    displayMessages: false, // determines whether Message.Set() calls are logged
    displayErrors: true, // determines whether error messages are shown on the console
    undefinedCharError: false, // determines whether unknown characters are saved in the error array
    extensions: '', // a convenience option to add MathJax extensions
    fontURL: '', // for webfont urls in the CSS for HTML output
    MathJax: {
      messageStyle: 'none',
      SVG: {
        font: 'Gyre-Pagella',
        matchFontHeight: false,
        blacker: 0,
        styles: {
          '.MathJax [style*=border-top-width]': {
            'border-top-width': '0.5pt ! important'
          }
        }
      }
    } // options MathJax configuration, see https://docs.mathjax.org
  },
  mjnodeConfig: {
    ex: 6, // ex-size in pixels (ex is an x-height unit)
    width: 100, // width of math container (in ex) for linebreaking and tags
    useFontCache: true, // use <defs> and <use> in svg output?
    useGlobalCache: false, // use common <defs> for all equations?
    // state: mjstate, // track global state
    linebreaks: true, // do linebreaking?
    equationNumbers: 'none', // or "AMS" or "all"
    math: '', // the math to typeset
    html: false, // generate HTML output?
    css: false, // generate CSS for HTML output?
    mml: false, // generate mml output?
    svg: true, // generate svg output?
    speakText: false, // add spoken annotations to output?
    timeout: 10 * 1000 // 10 second timeout before restarting MathJax
  }
}

// Process MathJax in HTML files
function mathjax (done) {
  'use strict'

  console.log('Processing MathJax in ' + paths.text.src)
  gulp.src(paths.text.src)
    .pipe(mathjaxPage(mjpageOptions))
    .pipe(debug({ title: 'Processing MathJax in file ' }))
    .pipe(gulp.dest(paths.text.dest))
  done()
}

exports.mathjax = mathjax
