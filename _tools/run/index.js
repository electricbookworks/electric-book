const options = require('./helpers/options.js').options
const helpers = require('./helpers/helpers.js')

// Parse arguments when calling this script
const argv = require('yargs') // eslint-disable-line no-unused-vars

  // Show usage guidance
  .scriptName('npm run electric-book --')
  .usage('Usage: $0 <command> [options]')
  .example([
    ['npm run electric-book -- output',
      'Generates HTML for web and serves the site locally.'],
    ['npm run electric-book -- output --format print-pdf',
      'Outputs a print PDF using the default `book` folder.'],
    ['npm run electric-book -- output -f epub -b samples',
      'Outputs an epub of the `samples` book.']
  ])

  // The default command shows the help docs
  .default('help')

  // Available commands are in the commands folder
  .commandDir('./commands/')

  // Available options are in options.js
  .options(options)

  // Check that option values provided are valid.
  // For now, we only check the --book value.
  .check(function (argv) {
    return helpers.bookIsValid(argv)
  })

  // User guidance
  .demandCommand(1, "Provide at least one command, e.g. '-- output'")
  .showHelpOnFail(true)

  // Format the console output
  .wrap(100)
  .version(false) // disable, gives npm version number
  .argv
