// Lint with JS Standard

// Import Node modules
const fsPath = require('path')
const fs = require('fs-extra') // beyond normal fs, for working with the file-system

// Get the translation languages for a work,
// assuming those are the subfolder names
// of its book folder in _data/works.
function translations (workAsString) {
  const workDataDirectory = fsPath.normalize(process.cwd() +
    '/_data/works/' + workAsString)
  const workDirectoryPaths = fs.readdirSync(workDataDirectory, { withFileTypes: true })

  const workSubdirectories = workDirectoryPaths
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  return workSubdirectories
}

module.exports = translations
