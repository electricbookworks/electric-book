// Lint with JS Standard

// Import Node modules
const fsPath = require('path')
const fileList = require('./fileList.js')
const works = require('./works')
const translations = require('./translations')

// Build out file paths from filename and work
function buildPaths (filenames, extension, work, language) {
  if (!extension) {
    extension = '.html'
  }

  // Provide fallback book
  if (!work) {
    work = 'book'
  }

  let pathToFiles
  if (language) {
    pathToFiles = process.cwd() + '/' +
                '_site/' +
                work + '/' +
                language
  } else {
    pathToFiles = process.cwd() + '/' +
                '_site/' +
                work
  }
  pathToFiles = fsPath.normalize(pathToFiles)

  // Extract filenames from file objects,
  // and prepend path to each filename.
  const paths = filenames.map(function (filename) {
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

// Get array of HTML-file paths for this output
// Options can be:
// allFiles: true | false (default is false)
async function htmlFilePaths (argv, extension, options) {
  'use strict'

  let filenames = []
  let paths = []

  if (options && options.allFiles === true) {
    const allWorks = await works()
    allWorks.forEach(function (work) {
      // Add the filenames for this work
      filenames = fileList(argv, work)

      // Add its paths to the paths array
      paths = paths.concat(buildPaths(filenames, extension, work))

      // Get the translations for this work
      const languages = translations(work)

      languages.forEach(function (language) {
        const translatedFilenames = fileList(argv, work, language)
        const translatedPaths = buildPaths(translatedFilenames, extension, work, language)

        // Add those translation paths to the paths array
        paths = paths.concat(translatedPaths)
      })
    })
  } else {
    filenames = fileList(argv)
    paths = buildPaths(filenames, extension, argv.book, argv.language)
  }
  return paths
}

module.exports = htmlFilePaths
