const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPath = require('path')
const fsPromises = require('fs/promises')

// The main process for generating an index of targets.
async function buildReferenceIndex (outputFormat) {
  'use strict'

  // Initialise an array that will store an index
  // or 'database' of the book-index targets.
  const targetsIndex = []

  // Get the store. We do this here, not at the top,
  // so that it'll get required after it's freshly built
  // by Jekyll. I.e. not the _site from the last build.
  const searchStore = require(process.cwd() +
    '/_site/assets/js/search-engine.js').store

  // Launch the browser.
  const browser = await puppeteer.launch({ headless: true })

  let i
  let count = 0
  for (i = 0; i < searchStore.length; i += 1) {
    const path = process.cwd() + '/_site/' + searchStore[i].url

    // Get the filename from the path.
    const filename = path.split('/').pop()

    // User feedback
    console.log('Indexing ' + path + ' for reference index.')

    // Open a new tab.
    const page = await browser.newPage()

    // Set debug to true to return any browser-console
    // messages to the Node console.
    const debug = true
    if (debug === true) {
      page.on('console', function (consoleObj) {
        console.log(consoleObj.text())
      })
    }

    // Go to the page path.
    // Puppeteer requires the protocol (file://) on unix.
    await page.goto('file://' + path)

    // Check that any index targets for the page have been processed.
    // This is done by assets/js/index-targets.js (in bundle.js).
    await page.waitForSelector('[data-index-targets]')

    // Note: we can only pass serialized data
    // back to the parent process.
    let indexEntries = await page.evaluate(function () {
      const targetArray = []
      const indexLinkTargets = document.querySelectorAll('.index-target')
      if (indexLinkTargets.length > 0) {
        indexLinkTargets.forEach(function (entry) {
          // Check if this target starts or ends a reference range
          let range = ''
          if (entry.classList.contains('index-target-from')) {
            range = 'from'
          }
          if (entry.classList.contains('index-target-to')) {
            range = 'to'
          }

          // Get the entry's nesting as an array.
          // It might be a nested entry, where each level
          // of nesting appears after double back slashes \\.
          // e.g. software \\ book-production
          const rawEntriesByLevel = entry.getAttribute('data-index-markup').split('\\')

          // Trim whitespace from each entry
          // https://stackoverflow.com/a/41183617/1781075
          const entriesByLevel = rawEntriesByLevel.map(str => str.trim())

          const entryObject = {
            entrySlug: entry.id.split('--iid-')[0],
            entryText: entry.getAttribute('data-index-entry'),
            entryTree: JSON.stringify(entriesByLevel),
            id: entry.id,
            range,
            bookTitle: document.querySelector('.wrapper').dataset.title,
            translationLanguage: document.querySelector('.wrapper').dataset.translation
          }
          targetArray.push(entryObject)
        })
      }

      // Note that we do not sort the entries in the targetArray.
      // The items are added in order of appearance in the DOM,
      // even if their ID numbers don't run in order. Their array order
      // which should match the order they're used for page
      // references at each entry in the book index.

      return JSON.stringify(targetArray)
    })

    // Write index objects to targetsIndex.
    // We want this for each entry on each page:
    // {
    //   entrySlug: 'entry-text'
    //   entryText: 'Entry Text',
    //   filename: 'filename.html',
    //   id: '#entry-text--iid-1',
    //   path: samples/filename.html
    // }

    // Parse the serialized entries and add
    // the filename and path for this file.
    indexEntries = JSON.parse(indexEntries)
    indexEntries.forEach(function (entry) {
      entry.filename = filename
    })

    // Add the entries to the master index,
    // if there are any.
    if (indexEntries.length > 0) {
      targetsIndex.push(indexEntries)
    }

    // Increment counter.
    count += 1

    // Close the page when we're done.
    await page.close()
  }

  // If we've got all the pages, close the Puppeteer browser.
  if (count === searchStore.length) {
    browser.close()
  }

  // Create empty index file to write to, if it doesn't exist
  const indexFilePath = fsPath.normalize(process.cwd() +
      '/assets/js/book-index-' + outputFormat + '.js')
  if (!fs.existsSync(indexFilePath)) {
    console.log('Creating ' + indexFilePath)
    await fsPromises.writeFile(indexFilePath, '')
  }

  // Write the book index 'database' file.
  // We add module.exports so that we can use indexTargets
  // in Node processes (i.e. gulp with cheerio).
  fs.writeFile('assets/js/book-index-' + outputFormat + '.js',
    'var ebIndexTargets = ' + JSON.stringify(targetsIndex) + ';' +
        'if (typeof window === "undefined")' +
        '{module.exports.' +
        outputFormat.replace('-', '') +
        'IndexTargets = ebIndexTargets;}',
    function () {
      console.log('Writing ' + indexFilePath)
      console.log('Done.')
    }
  )
}

// Run the rendering process.
module.exports = buildReferenceIndex
