// Lint with JS Standard

// Import Node modules
const fs = require('fs-extra') // beyond normal fs, for working with the file-system
const fsPath = require('path')

// Checks if a file or folder exists
function pathExists (path) {
  'use strict'

  try {
    if (fs.existsSync(fsPath.normalize(path))) {
      return true
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

module.exports = pathExists
