// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'export'
exports.desc = 'Export to another file format'
exports.handler = function (argv) {
  'use strict'

  switch (argv['export-format']) {
    case 'word':
      helpers.exportWord(argv)
      break
    default:
      helpers.exportWord(argv)
      break
  }
}
