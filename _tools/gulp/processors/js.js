// Lint with JS Standard

// Import Node modules
const debug = require('gulp-debug')
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')

// Local helpers
const { paths } = require('../helpers/paths.js')

// Minify JS files to make them smaller,
// using the drop_console option to remove console logging
function js (done) {
  'use strict'

  if (paths.js.src.length > 0) {
    console.log('Minifying Javascript')
    gulp.src(paths.js.src)
      .pipe(debug({ title: 'Minifying ' }))
      .pipe(uglify({ compress: { drop_console: true } }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.js.dest))
    done()
  } else {
    console.log('No scripts in source list to minify.')
    done()
  }
}

exports.js = js
