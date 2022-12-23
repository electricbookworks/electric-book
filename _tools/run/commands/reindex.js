// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// This file is called 'reindex.js' to avoid confusion
// with a conventional entry-point 'index.js' file.

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'index'
exports.desc = 'Refresh search and book indexes'
exports.handler = function (argv) {
  'use strict'

  console.log('Refreshing index for ' + argv.format + '\n' +
    'Remember to refresh indexes separately for each output format.')
  helpers.refreshIndexes(argv)
}
