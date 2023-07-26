/* global window, locales, pageLanguage, elasticlunr
    index, searchTerm, store, fillSearchBox */

// Display the search results
function displaySearchResults (results, store) {
  'use strict'

  const localisedSearchResults = locales[pageLanguage].search['search-results']
  let appendString = ''

  let localisedSearchResultsNumberSuffix

  if (results.length) {
    appendString += '<div class="search-results" id="search-results">'

    appendString += '<h2>' + localisedSearchResults + '</h2>'

    if (results.length === 1) {
      localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-singular']
    } else {
      localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-plural']
    }

    appendString += '<p>' + results.length + ' ' + localisedSearchResultsNumberSuffix
    appendString += ' "<mark>' + searchTerm + '</mark>".</p>'
    appendString += '<ul>'

    let i, item
    for (i = 0; i < results.length; i += 1) {
      // If the store doesn't contain this result's ref number,
      // skip it and continue with the loop.
      if (!store[results[i].ref]) {
        continue
      }

      item = store[results[i].ref]
      appendString += '<li>'
      appendString += '<h3><a href="' +
                    item.url +
                    '?query=' +
                    searchTerm +

                    // Also add the stem that elasticlunr
                    // used to find this in the index.
                    // E.g. a search for 'processing'
                    // will look for the stem 'process'.
                    '&search_stem=' +
                    elasticlunr.stemmer(searchTerm) +
                    '">' +
                    item.title +
                    ' </a></h3>'
      appendString += '<p>' + item.excerpt + '</p>'
      appendString += '</li>'
    }

    appendString += '</ul>'
    appendString += '</div>'
  } else {
    localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-none']

    appendString += '<div class="search-results" id="search-results">'
    appendString += '<p>' + localisedSearchResultsNumberSuffix + ' "' + searchTerm + '".</p>'
    appendString += '</div>'
  }

  const searchForm = document.querySelector('.content .search')
  searchForm.parentNode.innerHTML += appendString
}

function checkForSearchTerm () {
  'use strict'
  if (searchTerm) {
    // perform the search
    const results = index.search(searchTerm, {
      bool: 'AND'
    })

    // display the results
    displaySearchResults(results, store)
  }
}

function ebSearchIndexLoadingCheck () {
  'use strict'
  if (store && store.length > 0) {
    checkForSearchTerm()
    window.clearInterval(ebSearchIndexLoading)
  }
}
const ebSearchIndexLoading = window.setInterval(ebSearchIndexLoadingCheck, 100)

fillSearchBox()
