---
# Jekyll processes this file to generate the array of URLs.
# Then the output script passes this to phantomjs,
# which generates the search index as search-index.js.
layout: null
---

{% comment %} Get the URLs to include in the index {% endcomment %}
{% include files-listed.html %}

var urls = [{% for url in array-of-files %}'../..{{ url }}'{% unless forloop.last %},{% endunless %}{% endfor %}]

{% comment %} From here, the Javascript that tells
phantomjs how to generate a search index. {% endcomment %}

var fs = require('fs');
var page = require('webpage').create();
var index = "";
var count = 0;

function getPageData(url, count, callback) {
    'use strict';
    page.open(url, function () {

        // Get the title and scrub it
        var title = page.evaluate(function () {
            return document.title.replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim();
        });

        // Get the content and scrub it
        var content = page.evaluate(function () {
            return document.body.querySelector('#content').textContent.replace(/\"/g, '\'\'').replace(/\s+/g, ' ').trim();
        });

        // We want this for each page:
        // index.addDoc({
        //   id: n,
        //   title: "Title of page",
        //   content: "Content of page",
        // });
        var entry = 'index.addDoc({\n    id: ' + count + ',\n    title: "' + title + '",\n    content: "' + content + '"\n});\n';

        // Add entry to the index array
        index += entry;

        callback();

        return true;

    });

}

function process() {
    'use strict';
    if (urls.length > 0) {

        console.log('Indexing ' + urls[0]);

        // Grab the first URL, then
        // drop it from the array
        var url = urls[0];
        urls.splice(0, 1);

        // do getPageData
        getPageData(url, count, process);

        // increment the counter for id
        count = count + 1;

    } else {
        console.log('Writing search-index.js...');
        fs.write('../../../assets/js/search-index.js', index, 'w');
        console.log('Done.');
        page.close();
        phantom.exit();
    }
}

console.log('Starting...');
process();
