/*globals window, Prince, pageLanguage, locales */

// Page cross-reference in print
// Use with css:
// content: prince-script(pagereference);

// From here, we use a function to generate content, either
// content: " (page " target-counter(attr(href), page) ")";
// or, if we're on the page we're targeting
// content: normal;

// Get the locale phrases for cross-references for this HTML document's language
// pageLanguage is provided by locales.js
var prePageNumberPhrase = locales[pageLanguage]['cross-references']['pre-page-number'];
var postPageNumberPhrase = locales[pageLanguage]['cross-references']['post-page-number'];

function addPageReferenceFunc() {
    'use strict';

    // exit if we're in phantom; we only want Prince to do this
    if (typeof window.callPhantom === 'function') {
        return;
    }

    if (Prince) {
        console.log('Adding page references in Prince.');
        Prince.addScriptFunc("pagereference", function (currentPage, targetPage) {

            // if the target is on this page, return blank
            if (currentPage === targetPage) {
                return '';
            }

            // otherwise show a space and the page number in parentheses
            return '\u00A0' + prePageNumberPhrase + targetPage + postPageNumberPhrase;
        });
    }
}

addPageReferenceFunc();
