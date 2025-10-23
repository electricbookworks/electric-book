import elasticlunr from 'elasticlunr'
import { locales, pageLanguage } from './locales'
import { index } from './search-index'
import { fillSearchBox, searchTerm } from './search-terms'
import config from './config'

const store = config.collections.docs.output === true
  ? (Array.isArray(require(`./search-index-with-docs-${process.env.output}.js`)) ? require(`./search-index-with-docs-${process.env.output}.js`) : [])
  : (Array.isArray(require(`./search-index-${process.env.output}.js`)) ? require(`./search-index-${process.env.output}.js`) : [])

store.forEach(doc => index.addDoc(doc))

let ebSearchIndexLoading = null

// Get current variant
const searchResultsVariant = document.querySelector('.wrapper').getAttribute('data-variant')

// Get an array of works
let searchResultsWorks
if (process.env.works) {
  searchResultsWorks = Object.keys(process.env.works)
}

// Add at top of file, assuming metadata is globally available
const searchResultsAvailableFiles = []

if (searchResultsWorks) {
  searchResultsWorks.forEach(function (work) {
    if (process.env.works[work]?.[searchResultsVariant]?.products?.web?.files?.length > 0) {
      const files = process.env.works[work][searchResultsVariant].products.web.files
      files.forEach(function (file) {
        const pathFragment = work + '/' + file
        searchResultsAvailableFiles.push(pathFragment)
      })
    }
  })
}

// Display the search results
function displaySearchResults (results, store) {
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

      // Extract filename from path
      const itemPath = item.path

      let isDocsPage = false
      // Check if it's a docs page
      if (itemPath.startsWith('docs/')) {
        isDocsPage = true
      }

      // Check if file is available by matching path fragments
      let isAvailable = true
      if (isDocsPage) {
        isAvailable = true
      } else if (searchResultsAvailableFiles && searchResultsAvailableFiles.length > 0) {
        isAvailable = searchResultsAvailableFiles.some(fragment => itemPath.includes(fragment))
      }

      appendString += '<li class="search-result' +
                     (isAvailable ? ' search-result-available' : ' search-result-unavailable') + '">'
      appendString += '<h3><a href="' +
                    item.path +
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
      appendString += '<p>' + item.description + '</p>'
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
  if (store && store.length > 0) {
    checkForSearchTerm()
    window.clearInterval(ebSearchIndexLoading)
  }
}

export default function ebSearchResults () {
  ebSearchIndexLoading = window.setInterval(ebSearchIndexLoadingCheck, 100)
  fillSearchBox()
}
