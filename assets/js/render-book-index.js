/*jslint node, browser, es6 */
/*globals */

var puppeteer = require('puppeteer');
var fs = require('fs');

// Initialise an array that will an index
// of the book-index targets
var targetsIndex = [];

// We'll piggyback on the same code used
// for generating search indexes.
// Get the file list from search-store.js,
// which is included in search-engine.js.
var {store, output} = require('./search-engine.js');

// The main process for generating an index of targets
function generateTargetsIndex() {
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
            // node _site/assets/js/render-book-index.js
            // in which case the repo root is the current working directory (cwd)
            var path = process.cwd() + '/_site/' + store[i].url;

            // Get the filename from the path
            var filename = path.split('/').pop();

            // // Exit if the file is an index.html page
            // if (filename === '' || filename === 'index.html') {
            //     return;
            // }

            // User feedback
            console.log('Indexing ' + path);

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

            // Go to the page path
            await page.goto(path);

            // Wait for index targets to load
            await page.waitForSelector('[data-index-targets]');

            // Get the page content. We can only pass serialized
            // data back to the parent process.
            var indexEntries = await page.evaluate(function () {

                var targetArray = [];
                var targets = document.querySelectorAll('.index-target');
                targets.forEach(function (entry) {
                    var entryObject = {
                        entrySlug: entry.id.split('--iid-')[0],
                        entryText: entry.title,
                        id: entry.id
                    }
                    targetArray.push(entryObject);
                });

                return JSON.stringify(targetArray);
            });

            // Write index objects to targetsIndex.
            // We want this for each entry on each page:
            // {
            //   entrySlug: 'entry-text'
            //   entryText: 'Entry Text',
            //   filename: 'filename.html',
            //   id: '#entry-text--iid-1',
            //   path: samples/text/filename.html
            // }

            // Parse the serialized entries and add
            // the filename and path for this file.
            indexEntries = JSON.parse(indexEntries);
            indexEntries.forEach(function (entry) {
                entry.filename = filename;
                entry.path = store[i].url;
            });

            // Add the entries to the master index,
            // if there are any.
            if (indexEntries.length > 0) {
                targetsIndex.push(indexEntries);
            }

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
        fs.writeFile('assets/js/book-index-' + output + '.js',
                'var ebIndexTargets = ' + JSON.stringify(targetsIndex) + ';',
                function () {
            console.log('Writing book-index-' + output + '.js...');
            console.log('Done.');
        });

    })();
}

// Run the rendering process
generateTargetsIndex();
