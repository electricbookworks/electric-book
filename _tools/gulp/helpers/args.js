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

// Get the language we're processing
let language = ''
if (args.language && args.language.trim() !== '') {
  language = '/' + args.language
}

// Get the output format we're working with
let format = ''
if (args.format && args.format.trim() !== '') {
  format = args.format
}

// Get whether we are using merged.html
let merged = 'true'
if (args.merged && args.merged.trim() !== '') {
  merged = args.merged
}

exports.book = book
exports.language = language
exports.format = format
exports.merged = merged
