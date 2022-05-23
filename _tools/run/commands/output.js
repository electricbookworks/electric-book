// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'output'
exports.desc = 'Generate a project or publication'
exports.handler = function (argv) {
  'use strict'

  switch (argv.format) {
    case 'print-pdf':
    case 'screen-pdf':
      helpers.pdf(argv)
      break
    case 'epub':
      helpers.epub(argv)
      break
    case 'app':
      helpers.app(argv)
      break
    default:
      helpers.web(argv)
      break
  }
}
