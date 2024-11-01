// Lint with JS Standard

// Import Node modules
const fsPath = require('path')
const fileList = require('./fileList.js')

// Get array of HTML-file paths for this output
function htmlFilePaths (argv, extension) {
  'use strict'

  const fileNames = fileList(argv)

  if (!extension) {
    extension = '.html'
  }

  // Provide fallback book
  let book
  if (argv.book) {
    book = argv.book
  } else {
    book = 'book'
  }

  let pathToFiles
  if (argv.language) {
    pathToFiles = process.cwd() + '/' +
                '_site/' +
                book + '/' +
                argv.language
  } else {
    pathToFiles = process.cwd() + '/' +
                '_site/' +
                book
  }
  pathToFiles = fsPath.normalize(pathToFiles)

  console.log('Using files in ' + pathToFiles)

  // Extract filenames from file objects,
  // and prepend path to each filename.
  const paths = fileNames.map(function (filename) {
    if (typeof filename === 'object') {
      return fsPath.normalize(pathToFiles + '/' +
                    Object.keys(filename)[0] + extension)
    } else {
      return fsPath.normalize(pathToFiles + '/' +
                    filename + extension)
    }
  })

  return paths
}

module.exports = htmlFilePaths
