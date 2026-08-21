// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// When electric-book-modules is installed, _tools-custom is merged into
// _tools, so this file lands at _tools/run/commands/test.js and is picked
// up by the stock .commandDir('./commands/'). The relative require below
// resolves to _tools/test in both the merged and unmerged locations.
const test = require('../../test')

exports.command = 'test'
exports.desc = 'Run tests (currently PDF visual regression)'

// Command-specific options live here rather than in the shared options.js,
// so they travel with the command through the _tools-custom → _tools merge.
exports.builder = function (yargs) {
  return yargs
    .option('update', {
      description: 'Update the canonical reference instead of comparing against it',
      type: 'boolean',
      default: false
    })
    .option('threshold', {
      description: 'Pixel-diff sensitivity as a % of pixels per page (0–100)',
      alias: 'g',
      defaultDescription: 'Value from _data/tests.yml',
      type: 'number'
    })
}

exports.handler = function (argv) {
  test.run(argv)
    .then(function (result) {
      process.exitCode = result && result.passed ? 0 : 1
    })
    .catch(function (error) {
      console.error(error)
      process.exitCode = 1
    })
}
