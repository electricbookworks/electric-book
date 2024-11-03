// Lint with JS Standard

// Import Node modules
const fs = require('fs-extra') // beyond normal fs, for working with the file-system
const fsPath = require('path')
const yaml = require('js-yaml') // reads YAML files into JS objects
const pathExists = require('./pathExists.js')
const variantSettings = require('../settings/variantSettings.js')
const projectSettings = require('../settings/projectSettings.js')

// Get the filelist for a format,
// with option to get file-list for a specific book.
// The book argument here takes a string.
function fileList (argv, book, language) {
  'use strict'

  let format = 'web' // fallback
  if (argv && argv.format) {
    format = argv.format
  }

  // Use the specified language, if any,
  // otherwise the argv.language, if any.
  if (!language) {
    if (argv && argv.language) {
      language = argv.language
    }
  }

  // Check for variant-edition output
  const variant = variantSettings(argv).active

  // If a specific book is required, use that,
  // otherwise use the book defined in argv,
  // and fall back to the default 'book' book.
  if ((!book) && argv.book) {
    book = argv.book
  } else if (!book) {
    book = 'book' // default
  }

  // Build path to YAML data for this book
  const pathToYAMLFolder = process.cwd() +
            '/_data/works/' +
            book + '/'

  // Build path to default-edition YAML
  const pathToDefaultYAML = fsPath.normalize(pathToYAMLFolder + 'default.yml')

  // Get the book's metadata
  const metadata = yaml.load(fs.readFileSync(pathToDefaultYAML, 'utf8'))

  // Check if this book is published.
  // If not (`published: false`), don't include its files.
  let defaultPublished = true
  if (metadata !== undefined && metadata.published === false) {
    defaultPublished = metadata.published
    console.log(book + ' is set to `published: ' + metadata.published + '` in _data/works.')
  }

  let files = []

  // If no language is specified, we can load
  // the files list for the default work.
  if (!language) {
    if (defaultPublished && metadata.products[format] && metadata.products[format].files) {
      files = metadata.products[format].files
    } else {
      files = metadata.products['print-pdf'].files
    }

    // If there was no files list, oops!
    // We'll use the actual files in the book folder,
    // assuming this book is not set to `published: false`.
    if (defaultPublished && (!files)) {
      console.log('No files list in book data. Using raw files in ' + book + '.')

      // Let's just use all the markdown files for this book
      const bookDirectory = fsPath.normalize(process.cwd() + '/' + book + '/')
      files = []

      // Read the contents of the book directory.
      // For each file in there, if it ends with .md,
      // add its name, without the .md, to the files array.
      if (fs.lstatSync(bookDirectory).isDirectory()) {
        fs.readdirSync(bookDirectory)
          .forEach(function (file) {
            if (file.match(/\.md$/g)) {
              const fileBasename = file.replace(/\.md$/g, '')
              files.push(fileBasename)
            }
          })

        // If there is an index.md, move it to the front
        // (https://stackoverflow.com/a/48456512/1781075),
        // unless there is a cover file, in which case omit index.md.

        // Determine if there is a cover file.
        // This depends on the only word in the filename being 'cover',
        // e.g. 0-0-cover.html, cover.html. But not 'my-cover.html',
        // 'cover-page.html' or 'cover-versions-of-songs.html'.
        let coverFile = false
        files.forEach(function (filename) {
          // Remove all non-alphabetical-characters
          const filenameWordsOnly = filename.replace(/[^a-zA-Z]/g, '')

          // Is what remains the word 'cover'?
          if (filenameWordsOnly === 'cover') {
            coverFile = filename
            const indexOfCoverFile = files.findIndex(function (filename) {
              return filename === coverFile
            })

            // Move it to the front of the array:
            // remove it first...
            files.splice(indexOfCoverFile, 1)

            // ... then insert it unless this is a print PDF
            if (format !== 'print-pdf') {
              files.unshift(coverFile)
            }
          }
        })

        if (files.includes('index')) {
          const indexOfIndexFile = files.findIndex(function (filename) {
            return filename === 'index'
          })

          // Remove 'index' from array
          files.splice(indexOfIndexFile, 1)

          // If no cover file, insert 'index' at start of array
          // unless this is a print PDF
          if (coverFile === false && format !== 'print-pdf') {
            files.unshift('index')
          }
        }
      } else {
        // Otherwise, return an empty array
        console.log('Sorry, couldn\'t find files or a files list in book data.')
        return []
      }
    }
  }

  // Build path to translation's default YAML,
  // if a language has been specified.
  let pathToTranslationYAMLFolder,
    pathToDefaultTranslationYAML
  if (language) {
    pathToTranslationYAMLFolder = pathToYAMLFolder + language + '/'
    pathToDefaultTranslationYAML = pathToTranslationYAMLFolder + 'default.yml'

    // If the translation has this format among its products,
    // and that format has a files list, use that list.
    if (pathToDefaultTranslationYAML &&
                pathExists(pathToDefaultTranslationYAML)) {
      const translationMetadata = yaml.load(fs.readFileSync(pathToDefaultTranslationYAML, 'utf8'))

      let translationPublished = true
      if (translationMetadata !== undefined && translationMetadata.published === false) {
        translationPublished = translationMetadata.published
        console.log(book + ' is set to `published: ' +
          translationMetadata.published +
          '` in the _data/works ' +
          language +
          ' translation.')
      }

      if (translationPublished &&
          translationMetadata &&
          translationMetadata.products &&
          translationMetadata.products[format] &&
          translationMetadata.products[format].files) {
        files = translationMetadata.products[format].files
      }
    }
  }

  // Build path to variant-edition YAML,
  // if there is an active variant in settings.
  let pathToVariantYAML = false

  // If there's a variant and this is a translation ...
  if (language && variant) {
    pathToVariantYAML = pathToTranslationYAMLFolder + variant + '.yml'

    // ... otherwise just get the parent language variant path
  } else if (variant) {
    pathToVariantYAML = pathToYAMLFolder + variant + '.yml'
  }

  // If we have a path, and there's a files list there,
  // use that as the files list.
  if (pathToVariantYAML &&
      pathExists(pathToVariantYAML)) {
    const variantMetadata = yaml.load(fs.readFileSync(pathToVariantYAML, 'utf8'))

    let variantPublished = true
    if (variantPublished !== undefined && variantPublished.published === false) {
      variantPublished = variantPublished.published
      console.log(book + ' is set to `published: ' +
        variantPublished.published +
        '` in the _data/works ' +
        variant +
        ' variant.')
    }

    if (variantPublished &&
        variantMetadata &&
        variantMetadata.products &&
        variantMetadata.products[format] &&
        variantMetadata.products[format].files) {
      files = variantMetadata.products[format].files
    }
  }
  // Note that files may be objects, not strings,
  // e.g. { "01": "Chapter 1"}
  if (files) {
    return files
  } else {
    console.log('No files listed for ' + book + ' in _data/works.')
  }
}

module.exports = fileList
