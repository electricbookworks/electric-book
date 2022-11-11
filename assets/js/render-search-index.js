/*jslint node, browser */
/*globals */

var puppeteer = require('puppeteer');
var fs = require('fs');
var searchIndex = '';

// Get the file list from search-store.js,
// which is included in search-engine.js.
// The store includes a list of all pages
// that Jekyll parsed when building.
var {store, output} = require('./search-engine.js');

// The main process for generating a search index
function generateIndex() {
    'use strict';

    // Start an async function to scrape all URLs
    (async function () {

        // Launch the browser
        var browser = await puppeteer.launch({headless: true});

        var i;
        var count = 0;
        for (i = 0; i < store.length; i += 1) {

            // Make the URL path absolute, because
            // we might be indexing file system files,
            // not web-served pages. Assume this script
            // is run from the repo root, e.g as
            // node _site/assets/js/render-search-index.js
            // in which case the repo root is the current working directory (cwd)
            var url = process.cwd() + '/_site/' + store[i].url;

            // User feedback
            console.log('Indexing ' + url);

            // Open a new tab
            var page = await browser.newPage();

            // Set debug to true to return any browser-console
            // messages to the Node console
            var debug = false;
            if (debug === true) {
                page.on('console', function (consoleObj) {
                    console.log(consoleObj.text());
                });
            }

            // Go to the page URL
            await page.goto(url);

            // Get the page title
            const title = await page.evaluate(
                function () {
                    const titleElement = document.title;
                    let titleText = '';
                    if (titleElement) {
                        titleText = titleElement
                            .replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim()
                    }
                    return titleText
                }
            );

            // Get the page content
            const content = await page.evaluate(
                function () {
                    var contentDiv = document.querySelector('.content');
                    var contentText = '';
                    if (contentDiv) {
                        contentText = contentDiv.textContent
                            .replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim();
                    }
                    return contentText;
                }
            );

            // Write the index entry object.
            // We want this for each page:
            // index.addDoc({
            //   id: n,
            //   title: "Title of page",
            //   content: "Content of page",
            // });
            var entry = 'index.addDoc({\n    id: '
                    + count
                    + ',\n    title: "'
                    + title
                    + '",\n    content: "'
                    + content + '"\n});\n';

            // Strip out backslashes to avoid invalid unicode escape sequences
            // e.g. at MathJax you can get \\uparrow, where \u will throw a JS exception
            var entryCleaned = entry.replace(/\\/g, '');

            // Add entry to the searchIndex array
            searchIndex += entryCleaned;

            // Increment counter
            count += 1;

            // Close the page when we're done
            await page.close();
        }

        // If we've got all the pages, close the Puppeteer browser
        if (count === store.length) {
            browser.close();
        }

        // Write the search index file
        fs.writeFile('assets/js/search-index-' + output + '.js', searchIndex, function () {
            console.log('Writing search-index-' + output + '.js...');
            console.log('Done.');
        });

    })();
}

// Run the rendering process
generateIndex();
