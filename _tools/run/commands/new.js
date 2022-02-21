// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'new'
exports.desc = 'Copy a book to create a new one'
exports.handler = function (argv) {
  'use strict'

  helpers.newBook(argv)
}
