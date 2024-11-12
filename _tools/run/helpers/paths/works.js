// Lint with JS Standard

// Import Node modules
const fsPath = require('path')
const fs = require('fs-extra') // beyond normal fs, for working with the file-system

// Get a list of works (aka books) in this project
function works () {
  'use strict'

  return new Promise(function (resolve) {
    // Get the works data directory
    const worksDirectory = fsPath.normalize(process.cwd() +
              '/_data/works')

    // Get the folder names in the works directory
    const arrayOfWorks = fs.readdirSync(worksDirectory, { withFileTypes: true })

    // Filter only the directories into an array of their names
      .filter(function (dirent) { return dirent.isDirectory() })
      .map(function (dirent) { return dirent.name })

    if (arrayOfWorks) {
      resolve(arrayOfWorks)
    }
  })
}

module.exports = works
