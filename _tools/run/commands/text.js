// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

const textProcesses = require('../helpers/text/index.js')

// Exports

exports.command = 'text'
exports.desc = 'Process text'
exports.handler = function (argv) {
  'use strict'

  // What file type are we processing?
  const filetype = argv.source.split('.').pop()

  if (filetype) {
    if (filetype === 'docx') {
      // If the source is a Word file, run importText
      // which will also split if the --split arg is passed.
      // TODO: check that we don't pass --split by default!
      textProcesses.importText(argv)
    } else if (filetype === 'md' && argv.split && argv.split !== '') {
      // If the source is a markdown file, don't run importText.
      // but do run splitMarkdownFile if --split is given.
      textProcesses.splitMarkdownFile(argv)
    } else {
      console.error('Source file ' + argv.source + ' is not a .docx or .md file.')
    }
  } else {
    console.error('Source file ' + argv.source + ' does not have a file extension.')
  }
}
