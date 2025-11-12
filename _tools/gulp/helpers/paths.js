// Lint with JS Standard

// Import modules
const fs = require('fs')
const yaml = require('js-yaml')
const { book, language } = require('../helpers/args.js')

// Load scripts from elsewhere in this repo
const pathToJsAssetsSrc = `${process.cwd()}/assets/js/_src/`

let printpdfIndexTargets
try {
  if (!fs.existsSync(pathToJsAssetsSrc + 'book-index-print-pdf.js')) {
    fs.writeFileSync(pathToJsAssetsSrc + 'book-index-print-pdf.js', '')
  }
  printpdfIndexTargets = require(pathToJsAssetsSrc + 'book-index-print-pdf.js')
} catch (printpdfIndexTargetsError) {
  console.log(printpdfIndexTargetsError)
  console.log(`Could not find ${pathToJsAssetsSrc}book-index-print-pdf.js.`)
  console.log('This is fine if you are only processing images.')
}

let screenpdfIndexTargets
try {
  if (!fs.existsSync(pathToJsAssetsSrc + 'book-index-screen-pdf.js')) {
    fs.writeFileSync(pathToJsAssetsSrc + 'book-index-screen-pdf.js', '')
  }
  screenpdfIndexTargets = require(pathToJsAssetsSrc + 'book-index-screen-pdf.js')
} catch (screenpdfIndexTargetsError) {
  console.log(screenpdfIndexTargetsError)
  console.log(`Could not find ${pathToJsAssetsSrc}book-index-screen-pdf.js.`)
  console.log('This is fine if you are only processing images.')
}

let epubIndexTargets
try {
  if (!fs.existsSync(pathToJsAssetsSrc + 'book-index-epub.js')) {
    fs.writeFileSync(pathToJsAssetsSrc + 'book-index-epub.js', '')
  }
  epubIndexTargets = require(pathToJsAssetsSrc + 'book-index-epub.js')
} catch (epubIndexTargetsError) {
  console.log(epubIndexTargetsError)
  console.log(`Could not find ${pathToJsAssetsSrc}book-index-epub.js.`)
  console.log('This is fine if you are only processing images.')
}

let appIndexTargets
try {
  if (!fs.existsSync(pathToJsAssetsSrc + 'book-index-app.js')) {
    fs.writeFileSync(pathToJsAssetsSrc + 'book-index-app.js', '')
  }
  appIndexTargets = require(pathToJsAssetsSrc + 'book-index-app.js')
} catch (appIndexTargetsError) {
  console.log(appIndexTargetsError)
  console.log(`Could not find ${pathToJsAssetsSrc}book-index-app.js.`)
  console.log('This is fine if you are only processing images.')
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
    merged: ['_site/' + book + language + '/merged.html'],
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
exports.imageSettings = imageSettings
exports.paths = paths
