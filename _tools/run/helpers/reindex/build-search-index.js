const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPath = require('path')
const fsPromises = require('fs/promises')

// The main process for generating a search index
async function buildSearchIndex (outputFormat) {
  'use strict'

  // This will be the elasticllunr index without /docs
  let searchIndexNoDocs = ''

  // This will be the elasticllunr index with /docs
  let searchIndexWithDocs = ''

  // This will be an index for API access.
  // It will not include any /docs
  let searchIndexForAPI = []

  // Get the store. We do this here, not at the top,
  // so that it'll get required after it's freshly built
  // by Jekyll. I.e. not the _site from the last build.
  const searchStore = require(process.cwd() +
    '/_site/assets/js/search-engine.js').store

  // Launch the browser
  const browser = await puppeteer.launch({ headless: true })

  let i
  let count = 0
  for (i = 0; i < searchStore.length; i += 1) {
    // Make the URL path absolute, because
    // we might be indexing file system files,
    // not web-served pages. Assume this script
    // is run from the repo root, e.g as
    // node _site/assets/js/render-search-index.js
    // in which case the repo root is the current working directory (cwd)
    const url = process.cwd() + '/_site/' + searchStore[i].url

    // User feedback
    console.log('Indexing ' + url + ' for search index.')

    // Open a new tab
    const page = await browser.newPage()

    // Set debug to true to return any browser-console
    // messages to the Node console
    const debug = false
    if (debug === true) {
      page.on('console', function (consoleObj) {
        console.log(consoleObj.text())
      })
    }

    // Go to the page URL
    await page.goto(url)

    // Get the page title
    const title = await page.evaluate(() => document.title
      .replace(/"/g, '\'').replace(/\s+/g, ' ').trim())

    // Get the page content
    const content = await page.evaluate(() => document.body
      .querySelector('#content').textContent
      .replace(/"/g, '\'').replace(/\s+/g, ' ').trim())

    // Create an object for this page.
    // For title and content, we strip out backslashes
    // to avoid invalid unicode escape sequences.
    // E.g. at MathJax you can get \\uparrow,
    // where \u will throw a JS exception
    const pageObject = {
      id: count,
      url: searchStore[i].url,
      title: title.replace(/\\/g, ''),
      content: content.replace(/\\/g, '')
    }

    // Write the index entry object.
    // We want this for each page:
    // index.addDoc({
    //   id: n,
    //   title: "Title of page",
    //   content: "Content of page",
    // });
    const entry = 'index.addDoc('
        + JSON.stringify(pageObject)
        + ');\n'

    // Add entry to the searchIndex array
    searchIndexWithDocs += entry

    // If this page isn't a doc, include it
    // in the no-docs search index
    // and the API index
    if (!url.includes('/_site/docs/')) {
      searchIndexNoDocs += entry
      searchIndexForAPI.push(pageObject)
    }

    // Increment counter
    count += 1

    // Close the page when we're done
    await page.close()
  }

  // If we've got all the pages, close the Puppeteer browser
  if (count === searchStore.length) {
    browser.close()
  }

  // Create empty index files to write to, if they don't exist
  const indexFilePathNoDocs = fsPath.normalize(process.cwd() +
      '/assets/js/search-index-' + outputFormat + '.js')
  const indexFilePathWithDocs = fsPath.normalize(process.cwd() +
      '/assets/js/search-index-with-docs-' + outputFormat + '.js')
  const indexFilePathForAPI = fsPath.normalize(process.cwd() +
      '/_api/content/index.json')

  if (!fs.existsSync(indexFilePathNoDocs)) {
    console.log('Creating ' + indexFilePathNoDocs)
    await fsPromises.writeFile(indexFilePathNoDocs, '')
  }
  if (!fs.existsSync(indexFilePathWithDocs)) {
    console.log('Creating ' + indexFilePathWithDocs)
    await fsPromises.writeFile(indexFilePathWithDocs, '')
  }
  if (!fs.existsSync(indexFilePathForAPI)) {
    console.log('Creating ' + indexFilePathForAPI)
    await fsPromises.writeFile(indexFilePathForAPI, '')
  }

  // Write the search index files.
  // Note: searchIndexForAPI is an object and must be stringified.
  fs.writeFile(indexFilePathWithDocs,
    searchIndexWithDocs, function () {
      console.log('Writing ' + indexFilePathWithDocs)
      console.log('Done.')
    })

  fs.writeFile(indexFilePathNoDocs,
    searchIndexNoDocs, function () {
      console.log('Writing ' + indexFilePathNoDocs)
      console.log('Done.')
    })

  fs.writeFile(indexFilePathForAPI,
    JSON.stringify(searchIndexForAPI), function () {
      console.log('Writing ' + indexFilePathForAPI)
      console.log('Done.')
    })
}

// Run the rendering process
module.exports = buildSearchIndex
