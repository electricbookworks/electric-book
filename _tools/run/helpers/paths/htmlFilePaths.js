// Lint with JS Standard

// Import Node modules
const fsPath = require('path')
const fileList = require('./fileList.js')
const works = require('./works.js')
const translations = require('./translations.js')

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

  let paths = []

  if (options && options.allFiles === true) {
    const allWorks = await works()
    await allWorks.forEach(async function (work) {
      // Add the files for this work
      const files = fileList(argv, work)
      const filePaths = buildPaths(files, extension, work)

      // Add its paths to the paths array
      filePaths.forEach(function (path) {
        paths.push(path)
      })

      // Get the translations for this work
      const languages = await translations(work)

      if (languages.length > 0) {
        languages.forEach(function (language) {
          const languageFiles = fileList(argv, work, language)
          const languagePaths = buildPaths(languageFiles, extension, work, language)

          // Add its paths to the paths array
          languagePaths.forEach(function (languagePath) {
            paths.push(languagePath)
          })
        })
      }
    })
  } else {
    const files = fileList(argv)
    paths = buildPaths(files, extension, argv.book, argv.language)
  }

  return paths
}

module.exports = htmlFilePaths
