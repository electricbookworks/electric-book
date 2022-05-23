// Lint with JS Standard

// Import modules
const args = require('yargs').argv

// Get the book we're processing
let book = 'book'
if (args.book && args.book.trim() !== '') {
  book = args.book
}

// let '--folder' be an alias for '--book',
// to make sense for gulping 'assets'
if (args.folder && args.folder.trim() !== '') {
  book = args.folder
}

// Reminder on usage
if (book === 'book') {
  console.log('If processing images for a book that\'s not in the /book directory, use the --book argument, e.g. gulp --book potatoes')
  console.log('To process images in assets, use gulp --folder assets')
}

// Get the language we're processing
let language = ''
if (args.language && args.language.trim() !== '') {
  language = '/' + args.language
}

// Reminder on usage
if (language === '') {
  console.log('If processing a translation\'s images, use the --language argument, e.g. gulp --language fr')
}

// Get the output format we're working with
let output = ''
if (args.output && args.output.trim() !== '') {
  output = args.output
}

// Reminder on usage
if (output === '') {
  console.log('If processing for a specific output, use the --output argument, e.g. gulp --output printpdf. No hyphens.')
}

exports.book = book
exports.language = language
exports.output = output
