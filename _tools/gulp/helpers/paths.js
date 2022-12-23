// Lint with JS Standard

// Import modules
const fs = require('fs')
const yaml = require('js-yaml')
const { book, language } = require('../helpers/args.js')

// Load scripts from elsewhere in this repo,
// wrapped in 'try' for when they don't exist.

// const pathToProjectRoot = '../../../'
const pathToProjectRoot = process.cwd() + '/'

let printpdfIndexTargets
try {
  if (!fs.existsSync(pathToProjectRoot + 'assets/js/book-index-print-pdf.js')) {
    fs.writeFileSync(pathToProjectRoot + 'assets/js/book-index-print-pdf.js', '')
  }
  printpdfIndexTargets = require(pathToProjectRoot + 'assets/js/book-index-print-pdf.js')
    .printpdfIndexTargets
} catch (printpdfIndexTargetsError) {
  console.log(printpdfIndexTargetsError)
  console.log('Could not find assets/js/book-index-print-pdf.js.')
  console.log('This is fine if you are only processing images.')
}

let screenpdfIndexTargets
try {
  if (!fs.existsSync(pathToProjectRoot + 'assets/js/book-index-screen-pdf.js')) {
    fs.writeFileSync(pathToProjectRoot + 'assets/js/book-index-screen-pdf.js', '')
  }
  screenpdfIndexTargets = require(pathToProjectRoot + 'assets/js/book-index-screen-pdf.js')
    .screenpdfIndexTargets
} catch (screenpdfIndexTargetsError) {
  console.log(screenpdfIndexTargetsError)
  console.log('Could not find assets/js/book-index-screen-pdf.js.')
  console.log('This is fine if you are only processing images.')
}

let epubIndexTargets
try {
  if (!fs.existsSync(pathToProjectRoot + 'assets/js/book-index-epub.js')) {
    fs.writeFileSync(pathToProjectRoot + 'assets/js/book-index-epub.js', '')
  }
  epubIndexTargets = require(pathToProjectRoot + 'assets/js/book-index-epub.js')
    .epubIndexTargets
} catch (epubIndexTargetsError) {
  console.log(epubIndexTargetsError)
  console.log('Could not find assets/js/book-index-epub.js.')
  console.log('This is fine if you are only processing images.')
}

let appIndexTargets
try {
  if (!fs.existsSync(pathToProjectRoot + 'assets/js/book-index-app.js')) {
    fs.writeFileSync(pathToProjectRoot + 'assets/js/book-index-app.js', '')
  }
  appIndexTargets = require(pathToProjectRoot + 'assets/js/book-index-app.js')
    .appIndexTargets
} catch (appIndexTargetsError) {
  console.log(appIndexTargetsError)
  console.log('Could not find assets/js/book-index-app.js.')
  console.log('This is fine if you are only processing images.')
}

// Get the file list from search-store.js,
// which is included in search-engine.js.
// The store includes a list of all pages
// that Jekyll parsed when last building.
let store
try {
  store = require(pathToProjectRoot + '_site/assets/js/search-engine.js')
    .store
} catch (storeError) {
  console.log(storeError)
  console.log('Could not find _site/assets/js/search-engine.js.')
  console.log('This is okay if you are only processing images.')
}

// Load image settings if they exist
let imageSettings = []
if (fs.existsSync('_data/images.yml')) {
  imageSettings = yaml.load(fs.readFileSync('_data/images.yml', 'utf8'))

  // If the file is empty, imageSettings will be null.
  // So we check for that and, if null, we create an array.
  if (!imageSettings) {
    imageSettings = []
  }
}

// Create array of all text files in all books
const allTextPaths = function (store) {
  'use strict'
  const paths = []
  store.forEach(function (entry) {
    paths.push('_site/' + entry.url)
  })
  return paths
}

// Set up paths.
// Paths to text src must include the *.html extension.
// Add paths to any JS files to minify to the src array, e.g.
// src: ['assets/js/foo.js,assets/js/bar.js'],
const paths = {
  img: {
    source: book + language + '/images/_source/',
    printpdf: book + language + '/images/print-pdf/',
    web: book + language + '/images/web/',
    screenpdf: book + language + '/images/screen-pdf/',
    epub: book + language + '/images/epub/',
    app: book + language + '/images/app/'
  },
  text: {
    src: '_site/' + book + language + '/*.html',
    dest: '_site/' + book + language + '/'
  },
  epub: {
    src: '_site/' + book + language + '/*.html',
    dest: '_site/' + book + language + '/'
  },
  js: {
    src: [],
    dest: 'assets/js/'
  },
  yaml: {
    src: ['*.yml', '_configs/*.yml', '_configs/**/*.yml', '_data/*.yml', '_data/**/*.yml']
  },
  // Arrays of globs to ignore from tasks
  ignore: {
    printpdf: ['**/favicon.*'],
    web: [],
    screenpdf: ['**/favicon.*'],
    epub: ['**/favicon.*'],
    app: ['**/favicon.*']
  }
}

exports.printpdfIndexTargets = printpdfIndexTargets
exports.screenpdfIndexTargets = screenpdfIndexTargets
exports.epubIndexTargets = epubIndexTargets
exports.appIndexTargets = appIndexTargets
exports.store = store
exports.imageSettings = imageSettings
exports.allTextPaths = allTextPaths
exports.paths = paths
