import { locales, pageLanguage } from '@electricbookworks/electric-book-modules/assets/js/locales'
import { getQueryVariable } from '@electricbookworks/electric-book-modules/assets/js/search-terms'
import ebSearchResults from '@electricbookworks/electric-book-modules/assets/js/search-results.js'

const storeFileName = process.env.config.collections?.docs?.output === true ? 'search-index-with-docs-' + process.env.output : 'search-index-' + process.env.output
const store = require(`../../_indexes/${storeFileName}`)

// display a 'Searching' progress placeholder
function ebSearchShowSearchingNotice () {
  let searchProgressPlaceholder = document.querySelector('.search-progress-placeholder')
  if (searchProgressPlaceholder) {
    searchProgressPlaceholder.classList.remove('visuallyhidden')
  } else {
    searchProgressPlaceholder = document.createElement('div')
    searchProgressPlaceholder.classList.add('search-progress-placeholder')
    searchProgressPlaceholder.innerHTML = '<p>' + locales[pageLanguage].search['placeholder-searching'] + '</p>'
    const searchForm = document.querySelector('form.search')
    searchForm.insertAdjacentElement('afterend', searchProgressPlaceholder)
  }
}

// Hide the search-progress placeholder
function ebSearchHideSearchingNotice () {
  const searchProgressPlaceholder = document.querySelector('.search-progress-placeholder')
  if (searchProgressPlaceholder) {
    searchProgressPlaceholder.classList.add('visuallyhidden')
  }
}

// Check whether the index has loaded
let ebSearchCheckForResultsLoad
function ebSearchWaitingForResults () {
  const results = document.getElementById('search-results')
  if (results !== null) {
    ebSearchHideSearchingNotice()
    window.clearInterval(ebSearchCheckForResultsLoad)
  } else {
    ebSearchShowSearchingNotice()
  }
}

function ebSearchResultsProcess () {
  ebSearchCheckForResultsLoad = window.setInterval(ebSearchWaitingForResults, 500)

  // Let notification show before loading index and results
  window.setTimeout(function () {
    ebSearchResults(store)
  },
  500)
}

function ebSearchCheckForSearchString () {
  const query = getQueryVariable('query')
  if (query && query !== '') {
    ebSearchResultsProcess()
  }
}

ebSearchCheckForSearchString()
