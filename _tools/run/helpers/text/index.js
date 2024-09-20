const fs = require('fs')
const fsPath = require('path')
const fsPromises = require('fs/promises')
const pandoc = require('node-pandoc') // for converting files, e.g. html to word
const { ebSlugify } = require('../../../gulp/helpers/utilities.js')
const { pathExists } = require('fs-extra')
const slugify = require('../../../gulp/helpers/utilities.js').ebSlugify

// Convert with Pandoc
async function convertToMarkdown (argv) {
  'use strict'

  // Get information about the source file
  const sourceFile = fsPath.normalize(process.cwd() + '/_source/' + argv.source)
  const sourceIsValid = fs.existsSync(fsPath.normalize(sourceFile)) &&
      fsPath.extname(sourceFile) === '.docx'

  if (sourceIsValid === false) {
    console.log('Looking for ' + sourceFile) // debugging
    console.error('Sorry, can\'t find ' + argv.source + ' in the \'_source\' folder,' +
      ' or it isn\'t a .docx file.')
    return false
  }

  // Check that the destination directory exists
  let destinationDirectory = fsPath.normalize(process.cwd() + '/' + argv.book)
  if (argv.name) {
    const folderName = ebSlugify(argv.name)
    destinationDirectory = fsPath.normalize(process.cwd() + '/' + folderName)
  }

  if (!fs.existsSync(fsPath.normalize(destinationDirectory))) {
    fs.mkdirSync(destinationDirectory, { recursive: true })
  }

  // If the source and destination are valid,
  // we can finalise filenames and run Pandoc.
  if (sourceIsValid) {
    // First, check or create a directory for images,
    // where Pandoc can put media from the .docx doc.
    const imageDestinationDirectory = destinationDirectory + '/images/_source'

    if (!fs.existsSync(fsPath.normalize(imageDestinationDirectory))) {
      fs.mkdirSync(imageDestinationDirectory, { recursive: true })
    }

    // Finalise destination file names
    const sourceFileBasename = fsPath.basename(sourceFile, '.docx')
    const outputFilename = slugify(sourceFileBasename) + '.md'
    const outputFile = fsPath.normalize(destinationDirectory + '/' + outputFilename)

    // Run Pandoc.
    // Passing Pandoc an array is safer than a string because
    // it handles potential spaces in the source filename.
    // We must provide --resource-path or pandoc will look
    // for images in the working directory.
    const pandocArgs = [
      '--resource-path', process.cwd() + '/_source',
      '-f', 'docx',
      '-t', 'markdown_mmd',
      '--output', outputFile,
      '--markdown-headings', 'atx',
      '--wrap', 'none',
      '--toc',
      '--extract-media', imageDestinationDirectory
    ]

    function pandocCallback (error) {
      if (error) {
        console.error(error)
      } else {
        console.log('Conversion complete, see ' + outputFile)
      }
    }

    pandoc(sourceFile, pandocArgs, pandocCallback)
  }
}

// Split a markdown file into separate files
async function splitMarkdownFile (argv) {
  'use strict'

  // Check that we have a valid marker to split on
  let splitMarker = '#'
  let splitRegex
  if (argv.split && argv.split !== '') {
    splitMarker = argv.split
    splitRegex = new RegExp('^' + splitMarker)
  }

  // Check that we have a valid book to work in
  let bookDirectoryName
  if (pathExists(fsPath.normalize(process.cwd() + '/' + argv.book))) {
    bookDirectoryName = argv.book
  } else {
    console.error('Can\'t find an ' + argv.book + ' directory while splitting markdown file.')
  }

  // The source argument might refer to a docx file, before
  // conversion to markdown. So we need to change the extension,
  // and assume we're splitting the converted markdown equivalent.
  let fileToSplit = fsPath.normalize(process.cwd() + '/' + bookDirectoryName + '/' + argv.source)
  fileToSplit = fsPath.format({ ...fsPath.parse(fileToSplit), base: '', ext: '.md' })

  // Split the file if it exists
  if (pathExists(fileToSplit)) {
    const fileObject = fs.readFileSync(fileToSplit)
    const filePartsArray = fileObject.toString('utf8').split(splitRegex)

    // Write each filepart to a new file
    let counter = 0
    filePartsArray.forEach(function (filePart) {
      // Count the files we're creating
      counter += 1
      // Create a filename from the first line
      const firstLineRegex = /^.*$/
      const firstLine = filePart.match(firstLineRegex)
      const firstLineSlug = slugify(firstLine)

      // Define top-of-page-YAML, with title as the first line.
      // The split marker was removed during split(),
      // so we write it back at the start of the first line.
      const yamlFrontmatter = '---\n' +
        'title: "' + firstLine + '"\n' +
        '---\n\n' + splitMarker

      // Insert the top-of-page YAML
      filePart = yamlFrontmatter + filePart

      // Get a number for the filename.
      // We pad the file numbering to allow for
      // the potential addition of, say, 20% future files.
      // We assume no book will have more than 9999 files.
      let newFileNumber
      const numberOfFileParts = filePartsArray.length
      if (numberOfFileParts < 80) {
        newFileNumber = counter.padStart('0', 2)
      } else if (numberOfFileParts < 800) {
        newFileNumber = counter.padStart('0', 3)
      } else {
        newFileNumber = counter.padStart('0', 4)
      }

      // Write the file
      const newFileName = newFileNumber + '-' + firstLineSlug + '.md'
      const pathToNewFile = fsPath.normalize(process.cwd() + '/' + bookDirectoryName + '/' + newFileName)
      fsPromises.writeFile(pathToNewFile, filePart)

      // Are we done?
      if (counter === numberOfFileParts) {
        console.log('Done splitting ' + argv.source + '.')
      }
    })
  } else {
    console.error('Can\'t find ' + fileToSplit + ' in ' + bookDirectoryName + ' for splitting.')
  }
}

// Import text
async function importText (argv) {
  'use strict'

  try {
    await convertToMarkdown(argv)

    if (argv.split) {
      await splitMarkdownFile(argv)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  importText,
  splitMarkdownFile
}
