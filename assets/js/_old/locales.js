/* global ebCheckForPage, ebGetParameterByName, locales, searchTerm */

// Load locales.yml into a locales array.

// Convert locales.yml into a JSON string.
// Note that some keys use hyphens, which are invalid JS. So to use them
// as variables, use square brackets and quotes, e.g. search['search-placeholder'].
// The following line is populated by Jekyll during site build.
var locales = {{ site.data.locales | jsonify }};

// Various content localisations

function localiseText (pageLanguage) {
  // Get the current URL, without any query strings or hashes
  const currentURL = window.location.href.split('?')[0].split('#')[0]

  // If this is a home page and we're redirecting to translated HTML,
  // and the language concerned is defined in locales,
  // and the page we're redirecting to exists, redirect.
  // Otherwise return to quit localising.
  if (document.body.classList.contains('home')) {
    // Create a URL to redirect to, and remove possible duplicate slashes
    // (i.e. currentURL may already end with a slash)
    const proposedTranslatedLandingPage = currentURL + '/' + pageLanguage + '/'
    const possibleDoubleSlashString = '//' + pageLanguage
    const translatedLandingPage = proposedTranslatedLandingPage.replace(possibleDoubleSlashString, '/' + pageLanguage)

    // If the translated landing page actually exists,
    // redirect to it and exit here; do not continue localising.
    if (ebCheckForPage(translatedLandingPage + 'index.html')) {
      window.location.replace(translatedLandingPage)
      // And don't continue localising
      return
    }
  }
  // Localise HTML title element on home page
  const titleElement = document.querySelector('title')
  if (titleElement &&
    document.querySelector('body.home') !== 'undefined' &&
    locales[pageLanguage].project.name &&
    locales[pageLanguage].project.name !== '') {
    titleElement.innerHTML = locales[pageLanguage].project.name
  }

  // Localise masthead
  const mastheadProjectName = document.querySelector('.masthead .masthead-project-name a')
  if (mastheadProjectName &&
    locales[pageLanguage].project.name &&
    locales[pageLanguage].project.name !== '') {
    mastheadProjectName.innerHTML = locales[pageLanguage].project.name
  }

  // Localise search
  const searchPageHeading = document.querySelector('.search-page .content h1:first-of-type')
  if (searchPageHeading &&
        locales[pageLanguage].search['search-title'] &&
        locales[pageLanguage].search['search-title'] !== '') {
    searchPageHeading.innerHTML = locales[pageLanguage].search['search-title']
  }

  // Localise search form
  const searchLanguageToLocalise = document.querySelector('#search-language')
  if (searchLanguageToLocalise) {
    searchLanguageToLocalise.setAttribute('value', pageLanguage)
  }

  // Localise search-box placeholder
  const searchInputBox = document.querySelector('.search input.search-box')
  if (searchInputBox) {
    let searchInputBoxPlaceholder = document.querySelector('.search input.search-box').placeholder
    if (searchInputBoxPlaceholder) {
      searchInputBoxPlaceholder = locales[pageLanguage].search['search-placeholder']
    }
  }

  // Localise search-box submit button
  const searchSubmitInput = document.querySelector('.search input.search-submit')
  if (searchSubmitInput) {
    searchSubmitInput.setAttribute('value', locales[pageLanguage].search['search-title'])
  }

  // Localise search form label for screen readers
  const searchFormLabel = document.querySelector('.search label.visuallyhidden')
  if (searchFormLabel) {
    searchFormLabel.innerHTML = locales[pageLanguage].search['search-title']
  }

  // Localise searching... notice
  const searchProgressPlaceholder = document.querySelector('.search-progress')
  if (searchProgressPlaceholder) {
    searchProgressPlaceholder.innerHTML = locales[pageLanguage].search['placeholder-searching']
  }

  // Localise Google CSE search snippets
  const googleCSESearchBox = document.querySelector('.search input.search-box')
  if (googleCSESearchBox) {
    googleCSESearchBox.placeholder = locales[pageLanguage].search.placeholder
  }

  // Add any notices set in locales as search.notice
  if (searchPageHeading &&
    locales[pageLanguage].search.notice &&
    locales[pageLanguage].search.notice !== '') {
    const searchNotice = document.createElement('div')
    searchNotice.classList.add('search-page-notice')
    searchNotice.innerHTML = '<p>' + locales[pageLanguage].search.notice + '</p>'
    searchPageHeading.insertAdjacentElement('afterend', searchNotice)
  };

  // To do: localise the nav/TOC on search pages. This is tricky since
  // the root search page always uses the parent-language.

  // If no results with GSE, translate 'No results' phrase
  window.addEventListener('load', function (event) {
    const noResultsGSE = document.querySelector('.gs-no-results-result .gs-snippet')
    if (noResultsGSE) {
      noResultsGSE.innerHTML = locales[pageLanguage].search['results-for-none'] +
        ' ‘' + searchTerm + '’'
    }
  })

  // Localise questions
  const questionButtons = document.querySelectorAll('.question .check-answer-button')
  function replaceText (button) {
    button.innerHTML = locales[pageLanguage].questions['check-answers-button']
  }
  if (questionButtons) {
    questionButtons.forEach(replaceText)
  }
}

function ebCheckLanguageAndLocalise () {
  'use strict'

  // Get the language in the query string
  const requestedPagePanguage = ebGetParameterByName('lang')

  // If the URL parameter specifies a language,
  // and that language is defined in locales,
  // and it is not already the page language,
  // localise the page with it.
  if (requestedPagePanguage &&
        locales[requestedPagePanguage]) {
    localiseText(requestedPagePanguage)
  };
}

// Go

// Get the page language and localise accordingly
// (also check xml:lang for epub).
// The pageLanguage variable is used by other scripts.

// eslint-disable-next-line no-unused-vars
const pageLanguage = ebGetParameterByName('lang') ||
    document.documentElement.lang ||
    document.documentElement.getAttribute('xml:lang')

ebCheckLanguageAndLocalise()
