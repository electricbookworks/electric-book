// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const packageProject = require('../helpers/package/index.js')

// Exports

exports.command = 'package'
exports.desc = 'Create a zip file of this project'
exports.handler = function (argv) {
  'use strict'

  packageProject()
}
