/* global Prince, pageLanguage, locales */

// Page cross-reference in print
// Use with css:
// content: prince-script(pagereference);

// From here, we use a function to generate content, either
// content: " (page " target-counter(attr(href), page) ")";
// or, if we're on the page we're targeting
// content: normal;

// Get the locale phrases for cross-references for this HTML document's language
// pageLanguage is provided by locales.js
const prePageNumberPhrase = locales[pageLanguage]['cross-references']['pre-page-number']
const postPageNumberPhrase = locales[pageLanguage]['cross-references']['post-page-number']

// A global variable for holding the page number being
// inserted into a book's index, for comparison with
// the last number inserted.
let ebCurrentBookIndexPageNumber = ''

function addPageReferenceFunc () {
  'use strict'

  if (typeof Prince === 'object') {
    console.log('Adding page references in Prince.')
    Prince.addScriptFunc('pagereference', function (currentPage, targetPage) {
      // if the target is on this page, return blank
      if (currentPage === targetPage) {
        return ''
      }

      // otherwise show a space and the page number in parentheses
      return '\u00A0' + prePageNumberPhrase + targetPage + postPageNumberPhrase
    })

    // Add a page reference in a book index
    Prince.addScriptFunc('indexPageReference', function (page, entryPosition, prepend) {
      // If this is the first link in a new index entry,
      // reset the ebCurrentBookIndexPageNumber.
      if (entryPosition === 'first') {
        ebCurrentBookIndexPageNumber = ''
      }

      // If the page number isn't the ebCurrentBookIndexPageNumber,
      // return the page number for the target link.
      if (page !== ebCurrentBookIndexPageNumber) {
        // Update the ebCurrentBookIndexPageNumber
        ebCurrentBookIndexPageNumber = page

        // Return the page plus any prepended string
        return prepend + page
      } else {
        // Otherwise, return an empty string.
        return ''
      }
    })
  }
}

addPageReferenceFunc()
