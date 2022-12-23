// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// TO DO: add checks for other Electric Book dependencies.

// Modules

const helpers = require('../helpers/helpers')

// Exports

exports.command = 'install'
exports.desc = 'Install or update dependencies'
exports.handler = function () {
  'use strict'

  helpers.installGems()
  helpers.installNodeModules()
}
