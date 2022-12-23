// Lint with JS Standard

// Import modules
const { parallel } = require('gulp')

// Import tasks
const {
  epubXhtmlLinks, epubXhtmlFiles, epubCleanHtmlFiles
} = require('./_tools/gulp/processors/epub.js')

const {
  imagesPrintPDF, imagesScreenPDF,
  imagesEpub, imagesApp, imagesWeb,
  imagesSmall, imagesMedium, imagesLarge,
  imagesXLarge, imagesMax
} = require('./_tools/gulp/processors/images.js')

const {
  renderIndexCommentsAsTargets, renderIndexListReferences
} = require('./_tools/gulp/processors/indexes.js')

const { js } = require('./_tools/gulp/processors/js.js')
const { mathjax } = require('./_tools/gulp/processors/mathjax.js')
const { svgsPrintPDF, svgsScreenPDF, svgsWeb, svgsEpub, svgsApp } = require('./_tools/gulp/processors/svgs.js')
const { yaml } = require('./_tools/gulp/processors/yaml.js')

// Make tasks available to gulp
exports.default = parallel(
  svgsPrintPDF,
  svgsScreenPDF,
  svgsWeb,
  svgsEpub,
  svgsApp,
  imagesPrintPDF,
  imagesScreenPDF,
  imagesEpub,
  imagesApp,
  imagesWeb,
  imagesSmall,
  imagesMedium,
  imagesLarge,
  imagesXLarge,
  imagesMax)

exports.images = parallel(
  imagesPrintPDF,
  imagesScreenPDF,
  imagesEpub,
  imagesApp,
  imagesWeb,
  imagesSmall,
  imagesMedium,
  imagesLarge,
  imagesXLarge,
  imagesMax)

exports.epubXhtmlLinks = epubXhtmlLinks
exports.epubXhtmlFiles = epubXhtmlFiles
exports.epubCleanHtmlFiles = epubCleanHtmlFiles

exports.renderIndexCommentsAsTargets = renderIndexCommentsAsTargets
exports.renderIndexListReferences = renderIndexListReferences

exports.js = js
exports.mathjax = mathjax

exports.svgs = parallel(
  svgsPrintPDF,
  svgsScreenPDF,
  svgsWeb,
  svgsEpub,
  svgsApp
)

exports.yaml = yaml
