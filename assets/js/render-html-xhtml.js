---
# Lets phantomjs change html to xhtml in epubs.
# Jekyll will populate this script with the files
# that need changing from .html to .xhtml
layout: null
---

// TODO The problem with this script is that PhantomJs uses WebKit,
// which is all very well for web and even Prince, but epub
// is an asshole. WebKit does things like remove trailing slashes from
// self-closing tags, which epubcheck borks at. So we have to
// rewrite this script to use a simpler DOM parser that will only
// touch the attributes we're trying to rewrite, and do nothing else.
// It also needs to be able to parse package.opf and toc.ncx.

{% comment %}This include gets us a liquid array-of-files.{% endcomment %}
{% include files-listed.html %}

// Setup
var fs = require('fs');
var page = require('webpage').create();
var loadInProgress = false;
var pageIndex = 0;

// Get an array of files to process in the epub,
// including package.opf and toc.ncx
// and make a copy for files to rename
var filesToProcess = [{% for file in array-of-files  %}"{{ file | split: "/" | last }}"{% unless forloop.last %},{% endunless %}{% endfor %}];

// "../../epub/package.opf","../../epub/toc.ncx"

    // Log messages on the headless page to our command line
    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };

var htmlToXhtml = function() {

    // Polyfill includes (https://stackoverflow.com/a/31361163/1781075)
    if (!String.prototype.includes) {
        String.prototype.includes = function() {'use strict';
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    };

    var htmlLinks = document.querySelectorAll('[href*=".html"]'), i;

    console.log('htmlLinks: ' + htmlLinks);

    for (i = 0; i < htmlLinks.length; ++i) {
        
        console.log('Processing link: ' + htmlLinks[i]);

        var target = htmlLinks[i].getAttribute('href');

        console.log('Found target: ' + target);

        if (target.includes('.html') && !target.includes('http')) {

            console.log('Target includes ".html", replacing with ".xhtml"');

            var newTarget = target.replace('.html', '.xhtml');
            htmlLinks[i].setAttribute('href', newTarget);

            console.log('Link now: ' + htmlLinks[i]);

        } else {
            console.log('This target is an external link or doesn\'t include ".html".');
        }
    };

};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log(filesToProcess[pageIndex] + ' loading...');
};

page.onLoadFinished = function(status) {
    loadInProgress = false;
    console.log('Status: ' + status);

    if (status == "success") {
        console.log(filesToProcess[pageIndex] + ' loaded.');
        page.evaluate(htmlToXhtml);

        fs.write('../../../_output/phantom/' + filesToProcess[pageIndex], page.content, 'w');
        console.log('Wrote _output/phantom' + filesToProcess[pageIndex]);
        fs.remove('../../epub/text/' + filesToProcess[pageIndex]);
        console.log('Deleted _site/epub/text/' + filesToProcess[pageIndex]);
        fs.move('../../../_output/phantom/' + filesToProcess[pageIndex], '../../epub/text/' + filesToProcess[pageIndex]);
        console.log('Moved _output/phantom/' + filesToProcess[pageIndex] + ' to _site/epub/text/' + filesToProcess[pageIndex]);

    } else {
        console.log('Could not load page.');
    }

    pageIndex++;
};

// Open a page if one isn't currently being processed,
// checking every .25 seconds
setInterval(function() {
    if (pageIndex < filesToProcess.length) {
        if (!loadInProgress) {
            page.open('../../epub/text/' + filesToProcess[pageIndex]);
            console.log('---');
        }
    } else {
        fs.removeTree('../../../_output/phantom');
        console.log('Removed temporary _output/phantom directory.');
        phantom.exit();
    }
}, 250);

// User feedback and make temp dir
console.log('Preparing to rename .html to .xhtml...');

if (fs.makeDirectory('../../../_output/phantom/')) {
    var directoryReady = true;
    console.log('Made temporary phantom directory inside _output.');
} else {
    var directoryReady = false;
    console.log('Could not create temporary _output/phantom directory. If one already exists, you may need to delete it manually. Then run this script again.');
};
