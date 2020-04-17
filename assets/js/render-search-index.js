---
# Jekyll processes this file to generate the array of URLs.
# Then the output script runs this with Node,
# which generates the search index as search-index-web.js
# or search-index-app.js, depending on current output format.
layout: null
---

/*jslint node, browser */
/*globals */

{% comment %} Get the URLs to include in the index {% endcomment %}
{% include files-listed.html %}

var urls = [{% for url in array-of-files %}'{{ url }}'{% unless forloop.last %}, {% endunless %}{% endfor %}];

{% comment %} From here, the Javascript that tells
Puppeteer to generate a search index. {% endcomment %}

var puppeteer = require('puppeteer');
var fs = require('fs');
var searchIndex = '';

// The main process for generating a search index
function generateIndex() {
    'use strict';

    // Start an async function to scrape all URLs
    (async function () {

        // Launch the browser
        var browser = await puppeteer.launch({headless: true});

        var i;
        var count = 0;
        for (i = 0; i < urls.length; i += 1) {

            // Make the URL path absolute, because
            // we might be indexing file system files,
            // not web-served pages. Assume this script
            // is run from the repo root, e.g as
            // node _site/assets/js/render-search-index.js
            // in which case the repo root is the current working directory (cwd)
            var url = process.cwd() + '/_site' + urls[i];

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
            const title = await page.evaluate(() => document.title.replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim());

            // Get the page content
            const content = await page.evaluate(() => document.body.querySelector('#content').textContent.replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim());

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
        if (count === urls.length) {
            browser.close();
        }

        // Write the search index file
        fs.writeFile('assets/js/search-index-{{ site.output }}.js', searchIndex, function () {
            console.log('Writing search-index-{{ site.output }}.js...');
            console.log('Done.');
        });

    })();
}

// Run the rendering process
generateIndex();
