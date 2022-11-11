// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const { pdf, epub, app, web } = require('../helpers/output')

// Exports

exports.command = 'output'
exports.desc = 'Generate a project or publication'
exports.handler = function (argv) {
  'use strict'

  switch (argv.format) {
    case 'print-pdf':
    case 'screen-pdf':
      pdf(argv)
      break
    case 'epub':
      epub(argv)
      break
    case 'app':
      app(argv)
      break
    default:
      web(argv)
      break
  }
}
