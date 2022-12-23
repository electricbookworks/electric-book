// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const requirements = require('../helpers/requirements')
const chalk = require('chalk')
const fsPath = require('path')
const fsExtra = require('fs-extra')

// Functions

// Exports

exports.command = 'check'
exports.desc = 'Check project files and folders'
exports.handler = async function (argv) {
  'use strict'

  // Check that build is present for us to test with.
  const pathToSearchStore = fsPath.normalize(process.cwd() +
      '/_site/assets/js/search-engine.js')
  const searchStoreExists = await fsExtra.pathExists(pathToSearchStore)

  if (searchStoreExists) {
    let yamlValid = await requirements.checkYAML(argv)
    let pathsExist = await requirements.checkRequiredPaths(argv)
    let apiContentComplete = await requirements.checkAPIContent()

    // If we get actual 'true' responses to everything,
    // return true. Otherwise, exit the process.
    // This lets us kill build/deploy processes that fail.
    if (pathsExist === true
          && yamlValid === true
          && apiContentComplete === true) {
      return true
    } else {
      process.exit(1)
    }
  } else {
    console.log(chalk.red('\nBuild not available to test. Build the web output or update the project web index, then try again.\n'))
    process.exit(1)
  }
}
