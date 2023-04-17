// Lint with JS Standard

// Import Node modules
const fs = require('fs-extra') // beyond normal fs, for working with the file-system
const fsPath = require('path') // Node's path tool, e.g. for normalizing paths cross-platform
const fsPromises = require('fs/promises') // Promise-based Node fs
const {
  addToEpub,
  assembleApp,
  bookAssetPaths,
  cleanHTMLFiles,
  convertXHTMLFiles,
  convertXHTMLLinks,
  cordova,
  epubValidate,
  epubZip,
  epubZipRename,
  htmlFilePaths,
  jekyll,
  mathjaxEnabled,
  openOutputFile,
  pathExists,
  renderIndexComments,
  renderIndexLinks,
  renderMathjax,
  runPrince,
  epubHTMLTransformations
} = require('../helpers.js')
const merge = require('../merge')

// Web output
async function web (argv) {
  'use strict'

  try {
    await fs.emptyDir(process.cwd() + '/_site')
    await jekyll(argv)
  } catch (error) {
    console.log(error)
  }
}

// PDF output
async function pdf (argv) {
  'use strict'

  try {
    await fs.emptyDir(process.cwd() + '/_site')
    await jekyll(argv)
    await renderIndexComments(argv)
    await renderIndexLinks(argv)
    await merge(argv)
    await renderMathjax(argv)
    await runPrince(argv)
    openOutputFile(argv)
  } catch (error) {
    console.log(error)
  }
}

// Epub output
async function epub (argv) {
  'use strict'

  try {
    await fs.emptyDir(process.cwd() + '/_site')
    await jekyll(argv)
    await epubHTMLTransformations(argv)
    await renderIndexComments(argv)
    await renderIndexLinks(argv)
    await convertXHTMLLinks(argv)
    await convertXHTMLFiles(argv)
    await cleanHTMLFiles(argv)

    let htmlDestination = argv.book
    if (argv.language) {
      htmlDestination = argv.book + '/' + argv.language
    }
    await addToEpub(htmlFilePaths(argv, '.xhtml'), htmlDestination)

    let imagesDestination = argv.book + '/images/epub'
    if (argv.language) {
      imagesDestination = argv.book + '/' + argv.language + '/images/epub'
    }
    await addToEpub(bookAssetPaths(argv, 'images'), imagesDestination)

    await addToEpub(bookAssetPaths(argv, 'styles'),
      argv.book + '/styles')
    await addToEpub(bookAssetPaths(argv, 'images', 'assets'),
      'assets/images/epub')

    if (pathExists(process.cwd() + '/_site/assets/js/bundle.js')) {
      await addToEpub([process.cwd() + '/_site/assets/js/bundle.js'],
        '/assets/js')
    }

    if (mathjaxEnabled(argv)) {
      await addToEpub([process.cwd() + '/_site/assets/js/mathjax'],
        '/assets/js/mathjax')
    }

    let opfFile = process.cwd() + '/_site/' +
      argv.book +
      '/package.opf'

    if (argv.language) {
      opfFile = process.cwd() + '/_site/' +
        argv.book + '/' +
        argv.language +
        '/package.opf'
    }

    if (pathExists(opfFile)) {
      await addToEpub([opfFile], '')
    }

    let ncxFile = process.cwd() + '/_site/' +
      argv.book + '/toc.ncx'

    if (argv.language) {
      ncxFile = process.cwd() + '/_site/' +
        argv.book + '/' +
        argv.language +
        '/toc.ncx'
    }

    if (pathExists(ncxFile)) {
      await addToEpub([ncxFile], '')
    }

    await epubZip()
    await epubZipRename(argv)

    let pathToEpub = fsPath.normalize(process.cwd() +
      '/_output/' +
      argv.book + '.epub')

    if (argv.language) {
      pathToEpub = fsPath.normalize(process.cwd() +
        '/_output/' +
        argv.book + '-' + argv.language + '.epub')
    }
    await epubValidate(pathToEpub)

    console.log('Your epub is at ' + pathToEpub)
  } catch (error) {
    console.log(error)
  }
}

// App output
async function app (argv) {
  'use strict'

  try {
    await fs.emptyDir(process.cwd() + '/_site')
    await jekyll(argv)
    await fsPromises.mkdir(process.cwd() + '/_site/app/www')
    await assembleApp()

    if (argv['app-build']) {
      await cordova(['platform', 'add', argv['app-os']])
      await cordova(['platform', 'prepare', argv['app-os']])

      // Build the app
      if (argv['app-release']) {
        await cordova(['build', argv['app-os']], '--release')
      } else {
        await cordova(['build', argv['app-os']])
      }

      // Run emulator
      if (argv['app-emulate']) {
        await cordova(['emulate', argv['app-os']])
      }
    } else {
      console.log('App folders ready in _site/app.')
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  app,
  pdf,
  web,
  epub
}
