const puppeteer = require('puppeteer')
const fs = require('fs')
const fsPath = require('path')
const fsPromises = require('fs/promises')
const fsExtra = require('fs-extra')

// This function writes a single file for the content API
async function writeContentAPIFile (pageObject) {
  // Create an index.json path from the page's URL
  const contentFileRelativePath = pageObject.path.replace(/\.html$/, '/index.json')

  // Create an absolute path to write to
  const contentFileAbsolutePath = fsPath.normalize(process.cwd() +
      '/_api/content/' + contentFileRelativePath)

  // Write the file (fsExtra.outputFile will create
  // the path and file if they don't exist)
  try {
    await fsExtra.outputFile(contentFileAbsolutePath, JSON.stringify(pageObject))
  } catch (err) {
    console.error(err)
  }
}

// The main process for generating a search index
async function buildSearchIndex (outputFormat, filesData) {
  'use strict'

  // This will be the elasticllunr index without /docs.
  // We'll close the array when we've added all its objects.
  let searchIndexNoDocs = 'const store = ['

  // This will be the elasticllunr index with /docs.
  // We'll close the array when we've added all its objects.
  let searchIndexWithDocs = 'const store = ['

  // This will be an index for API access.
  // It will not include any /docs
  const contentIndexForAPI = []

  // Remove existing the api/content so that
  // we can completely refresh it.
  await fsExtra.emptyDir(fsPath.normalize(process.cwd() + '/_api/content'))

  // Launch the browser
  const browser = await puppeteer.launch({ headless: true })

  let i
  let count = 0
  for (i = 0; i < filesData.length; i += 1) {
    // Make the URL path absolute, because
    // we might be indexing file system files,
    // not web-served pages. Assume this script
    // is run from the repo root, e.g as
    // node _site/assets/js/render-search-index.js
    // in which case the repo root is the current working directory (cwd).
    // Puppeteer requires the protocol (file://) on unix.
    // Note we do not normalise here, because we want
    // the path to use forward slashes even on Windows,
    // so we can check the string later on.
    const path = process.cwd() + '/_site/' + filesData[i].path
    const pathWithProtocol = 'file://' + path

    // Check that the page exists before we
    // try to open it
    let pageExists = false
    if (fs.existsSync(fsPath.normalize(path))) {
      pageExists = true
    }

    // User feedback.
    // We can normalise the path here for readability.
    if (pageExists) {
      console.log('Indexing ' + fsPath.normalize(path) + ' for search index.')
    } else {
      console.log(fsPath.normalize(path) + ' is listed for indexing, but can\'t be found.')
      count += 1
      continue
    }

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
    await page.goto(pathWithProtocol)

    // Get the page title
    const title = await page.evaluate(
      function () {
        const titleElement = document.title
        let titleText = ''
        if (titleElement) {
          titleText = document.title
            .replace(/"/g, '\'').replace(/\s+/g, ' ').trim()
        }
        return titleText
      }
    )

    // Get the page description
    const description = await page.evaluate(
      function () {
        let descriptionText = ''
        const descriptionTag = document.querySelector('meta[name="description"]')
        if (descriptionTag) {
          descriptionText = descriptionTag.content
            .replace(/"/g, '\'').replace(/\s+/g, ' ').trim()
        }
        return descriptionText
      }
    )

    // Get the page content
    const content = await page.evaluate(
      function () {
        const contentDiv = document.body.querySelector('.content')
        let contentText = ''
        if (contentDiv) {
          contentText = contentDiv.textContent
            .replace(/"/g, '\'').replace(/\s+/g, ' ').trim()
        }
        return contentText
      }
    )

    // Build the API endpoint
    const endpoint = 'api/content/' +
      filesData[i].path.replace(/\.html$/, '/index.json')

    // Create an object for this page.
    // We create two versions: one without content
    // for the overall index, and with with content
    // for the per-page JSON file.
    // For title and content, we strip out backslashes
    // to avoid invalid unicode escape sequences.
    // E.g. at MathJax you can get \\uparrow,
    // where \u will throw a JS exception.
    let pageObjectForAPIIndex = {
      id: count,
      path: filesData[i].path,
      title: title.replace(/\\/g, ''),
      description,
      json: endpoint
    }
    let pageObjectForAPIContent = {
      id: count,
      path: filesData[i].path,
      title: title.replace(/\\/g, ''),
      description,
      content: content.replace(/\\/g, '')
    }

    // Write the index entry object.
    // We want this for each page:
    // {
    //   id: n,
    //   title: "Title of page",
    //   content: "Content of page",
    // }
    let searchIndexEntry = JSON.stringify(pageObjectForAPIContent)

    // Add entry to the searchIndex array
    searchIndexWithDocs += searchIndexEntry

    // Add a comma if this isn't the last entry
    if (i !== (filesData.length - 1)) {
      searchIndexWithDocs += ','
    }

    // If this page isn't a doc, include it
    // in the no-docs search index and the API index,
    // and write a single-page content file for it.
    // Note this check is why we don't normalise the path
    // above, since it would have backslashes on Windows
    // if the path had been normalised.
    if (!path.includes('/_site/docs/')) {
      searchIndexNoDocs += searchIndexEntry

      // Add a comma if this isn't the last entry
      if (i !== (filesData.length - 1)) {
        searchIndexNoDocs += ','
      }

      contentIndexForAPI.push(pageObjectForAPIIndex)
      writeContentAPIFile(pageObjectForAPIContent)
    }

    // Increment counter
    count += 1

    // Reset the entry and pageObjects
    searchIndexEntry = ''
    pageObjectForAPIIndex = {}
    pageObjectForAPIContent = {}

    // Close the page when we're done
    await page.close()
  }

  // If we've got all the pages, close the array
  // and close the Puppeteer browser.
  if (count === filesData.length) {
    const loadStoreFunctionString = ';store.forEach(function (doc) { index.addDoc(doc) })'

    searchIndexNoDocs += ']' + loadStoreFunctionString
    searchIndexWithDocs += ']' + loadStoreFunctionString
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
  // Note: contentIndexForAPI is an object and must be stringified.
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
    JSON.stringify(contentIndexForAPI), function () {
      console.log('Writing ' + indexFilePathForAPI)
      console.log('Done.')
    })
}

// Run the rendering process
module.exports = buildSearchIndex
