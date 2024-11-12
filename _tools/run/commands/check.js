// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const requirements = require('../helpers/requirements')

// Functions

// Exports

exports.command = 'check'
exports.desc = 'Check project files and folders'
exports.handler = async function (argv) {
  'use strict'

  const yamlValid = await requirements.checkYAML(argv)
  const pathsExist = await requirements.checkRequiredPaths(argv)
  const apiContentComplete = await requirements.checkAPIContent()

  // If we get actual 'true' responses to everything,
  // return true. Otherwise, exit the process.
  // This lets us kill build/deploy processes that fail.
  if (pathsExist === true &&
      yamlValid === true &&
      apiContentComplete === true) {
    return true
  } else {
    process.exit(1)
  }
}
