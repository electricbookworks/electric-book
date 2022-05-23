const options = require('./helpers/options.js').options

// Parse arguments when calling this script
const argv = require('yargs') // eslint-disable-line no-unused-vars
  .usage('Usage: $0 <command> [options]')
  .default('help')
  .commandDir('./commands/')
  .options(options)
  .demandCommand(1, "Provide at least one command, e.g. '-- output'")
  .showHelpOnFail(true)
  .wrap(100)
  .version(false) // disable, gives npm version number
  .scriptName('npm run electric-book')
  .argv
