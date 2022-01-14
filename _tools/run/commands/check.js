// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const requirements = require('../helpers/requirements')

// Functions

// Exports

exports.command = 'check'
exports.desc = 'Check project for required files and folders'
exports.handler = function (argv) {
  'use strict'

  requirements.check(argv)
}
