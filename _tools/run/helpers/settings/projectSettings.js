// Lint with JS Standard

// Import Node modules
const fs = require('fs-extra') // beyond normal fs, for working with the file-system
const yaml = require('js-yaml') // reads YAML files into JS objects

// Get project settings from settings.yml
function projectSettings () {
  'use strict'
  let settings
  try {
    settings = yaml.load(fs.readFileSync('./_data/settings.yml', 'utf8'))
  } catch (error) {
    console.log(error)
  }
  return settings
}

module.exports = projectSettings
