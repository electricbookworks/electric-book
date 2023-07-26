/* global window, settings, locales, pageLanguage, getQueryVariable */

// display a 'Searching' progress placeholder
function ebSearchShowSearchingNotice () {
  'use strict'

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
  'use strict'
  const searchProgressPlaceholder = document.querySelector('.search-progress-placeholder')
  if (searchProgressPlaceholder) {
    searchProgressPlaceholder.classList.add('visuallyhidden')
  }
}

// Load the search index and the script for showing results.
// We load these here so that they don't block the main thread.
// This does not seem to work in file:///'s, only on a webserver.
function ebSearchLoadIndexAndResults () {
  'use strict'

  let searchIndex = 'assets/js/search-index-' + settings.site.output + '.js'
  if (settings.site.docs === true) {
    searchIndex = 'assets/js/search-index-with-docs-' + settings.site.output + '.js'
  }

  [
    searchIndex,
    'assets/js/search-results.js'
  ].forEach(function (src) {
    const script = document.createElement('script')
    script.src = src
    script.async = false
    document.body.appendChild(script)
  })
}

// Check whether the index has loaded
let ebSearchCheckForResultsLoad
function ebSearchWaitingForResults () {
  'use strict'
  const results = document.getElementById('search-results')
  if (results !== null) {
    ebSearchHideSearchingNotice()
    window.clearInterval(ebSearchCheckForResultsLoad)
  } else {
    ebSearchShowSearchingNotice()
  }
}

function ebSearchResultsProcess () {
  'use strict'
  ebSearchCheckForResultsLoad = window.setInterval(ebSearchWaitingForResults, 500)

  // Let notification show before loading index and results
  window.setTimeout(
    ebSearchLoadIndexAndResults,
    500
  )
}

function ebSearchCheckForSearchString () {
  'use strict'
  const query = getQueryVariable('query')
  if (query && query !== '') {
    ebSearchResultsProcess()
  }
}

ebSearchCheckForSearchString()
