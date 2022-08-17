// Lint with JS Standard

// Import Node modules
const gulp = require('gulp')
const fs = require('fs')
const tap = require('gulp-tap')
const jsyaml = require('js-yaml')

// Local helpers
const { paths } = require('../helpers/paths.js')

// Validate yaml files
function yaml (done) {
  'use strict'

  gulp.src(paths.yaml.src)
    .pipe(tap(function (file) {
      try {
        jsyaml.load(fs.readFileSync(file.path, 'utf8'))
      } catch (e) {
        console.log('') // empty line space
        console.log('\x1b[35m%s\x1b[0m', 'YAML error in ' + file.path + ':')
        console.log('\x1b[36m%s\x1b[0m', e.message)
        console.log('') // empty line space
      }
    }))
  console.log('YAML check complete.')
  done()
}

exports.yaml = yaml
