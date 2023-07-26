const puppeteer = require('puppeteer')
const fs = require('fs')
let searchIndex = ''

// Get the file list from search-store.js,
// which is included in search-engine.js.
// The store includes a list of all pages
// that Jekyll parsed when building.
const { store, output } = require('./search-engine.js')

// The main process for generating a search index
function generateIndex () {
  'use strict';

  // Start an async function to scrape all URLs
  (async function () {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true })

    let i
    let count = 0
    for (i = 0; i < store.length; i += 1) {
      // Make the URL path absolute, because
      // we might be indexing file system files,
      // not web-served pages. Assume this script
      // is run from the repo root, e.g as
      // node _site/assets/js/render-search-index.js
      // in which case the repo root is the current working directory (cwd)
      const url = process.cwd() + '/_site/' + store[i].url

      // User feedback
      console.log('Indexing ' + url)

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
      const title = await page.evaluate(
        function () {
          const titleElement = document.title
          let titleText = ''
          if (titleElement) {
            titleText = titleElement
              .replace(/"/g, '\'\'').replace(/\s+/g, ' ').trim()
          }
          return titleText
        }
      )

      // Get the page content
      const content = await page.evaluate(
        function () {
          const contentDiv = document.querySelector('.content')
          let contentText = ''
          if (contentDiv) {
            contentText = contentDiv.textContent
              .replace(/"/g, '\'\'').replace(/\s+/g, ' ').trim()
          }
          return contentText
        }
      )

      // Write the index entry object.
      // We want this for each page:
      // index.addDoc({
      //   id: n,
      //   title: "Title of page",
      //   content: "Content of page",
      // });
      const entry = 'index.addDoc({\n    id: ' +
                    count +
                    ',\n    title: "' +
                    title +
                    '",\n    content: "' +
                    content + '"\n});\n'

      // Strip out backslashes to avoid invalid unicode escape sequences
      // e.g. at MathJax you can get \\uparrow, where \u will throw a JS exception
      const entryCleaned = entry.replace(/\\/g, '')

      // Add entry to the searchIndex array
      searchIndex += entryCleaned

      // Increment counter
      count += 1

      // Close the page when we're done
      await page.close()
    }

    // If we've got all the pages, close the Puppeteer browser
    if (count === store.length) {
      browser.close()
    }

    // Write the search index file
    fs.writeFile('assets/js/search-index-' + output + '.js', searchIndex, function () {
      console.log('Writing search-index-' + output + '.js...')
      console.log('Done.')
    })
  })()
}

// Run the rendering process
generateIndex()
