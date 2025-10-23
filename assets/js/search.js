import { locales, pageLanguage } from './_src/locales'
import { getQueryVariable } from './_src/search-terms'
import ebSearchResults from './_src/search-results.js'

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
  window.setTimeout(
    ebSearchResults,
    500
  )
}

function ebSearchCheckForSearchString () {
  const query = getQueryVariable('query')
  if (query && query !== '') {
    ebSearchResultsProcess()
  }
}

ebSearchCheckForSearchString()
