// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'images'
exports.desc = 'Process source images for output'
exports.handler = function (argv) {
  'use strict'

  helpers.processImages(argv)
}
