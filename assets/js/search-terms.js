/* global locales, pageLanguage, Mark,
    ebTruncatedString, MutationObserver */

// get query search term from GET query string
function getQueryVariable (variable) {
  'use strict'
  const query = window.location.search.substring(1)
  const vars = query.split('&')

  let i, pair
  for (i = 0; i < vars.length; i += 1) {
    pair = vars[i].split('=')

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, '%20'))
    }
  }
}

// Get some elements
const searchTerm = getQueryVariable('query')
const searchBox = document.querySelectorAll('.search-box')

// Fill the search boxes with the current search term
function fillSearchBox () {
  'use strict'
  if (searchTerm && searchBox) {
    // show the just-searched-term
    let j
    for (j = 0; j < searchBox.length; j += 1) {
      searchBox[j].setAttribute('value', searchTerm)
    }
  }
}

// Check whether this is a search-page
function isSearchPage () {
  'use strict'
  const searchPageCheck = document.querySelector('.search-page, .content form.search')
  if (searchPageCheck) {
    return true
  } else {
    return false
  }
}

function ebSearchTermsOnPage () {
  'use strict'
  let searchTerms = document.querySelectorAll('[data-markjs]')

  // Filter out any results we don't want in the list:
  // - results inside noscript tags (e.g. image filenames)
  // - results in the main #nav menu
  if (searchTerms) {
    searchTerms = Array.from(searchTerms).filter(function (term) {
      if (term.closest('noscript') ||
                    term.closest('#nav')) {
        return false
      } else {
        return true
      }
    })

    if (searchTerms.length && searchTerms.length > 0) {
      // Create a box with a list inside it
      const wrapper = document.createElement('div')
      wrapper.classList.add('search-results-nav')
      const list = document.createElement('ol')
      list.classList.add('search-results-list')
      wrapper.append(list)

      // Give the box a heading
      const heading = document.createElement('h2')
      let headingPhrase = locales[pageLanguage].search['results-for-singular']
      if (searchTerms.length > 1) {
        headingPhrase = locales[pageLanguage].search['results-for-plural']
      }
      heading.innerHTML = searchTerms.length +
                    ' ' +
                    headingPhrase +
                    ' ' +
                    ' <span class="search-results-nav-term">' +
                    searchTerm +
                    '</span>'
      wrapper.insertAdjacentElement('afterbegin', heading)

      // Add a hide button to the box
      const hideButton = document.createElement('button')
      hideButton.classList.add('search-results-nav-hide')
      hideButton.innerHTML = locales[pageLanguage].input.hide
      wrapper.insertAdjacentElement('afterbegin', hideButton)
      hideButton.addEventListener('click', function () {
        if (wrapper.getAttribute('data-hidden') === 'true') {
          wrapper.setAttribute('data-hidden', 'false')
          hideButton.innerHTML = locales[pageLanguage].input.hide
        } else {
          wrapper.setAttribute('data-hidden', 'true')
          hideButton.innerHTML = locales[pageLanguage].input.show
        }
      })

      // Add a close button to the box,
      // which also hides marked search terms on page.
      const closeButton = document.createElement('button')
      closeButton.title = locales[pageLanguage].input.close
      closeButton.classList.add('search-results-nav-close')
      closeButton.innerHTML = '✕'
      hideButton.insertAdjacentElement('afterend', closeButton)
      closeButton.addEventListener('click', function () {
        wrapper.remove()
        document.body.setAttribute('data-markjs', 'unmark')
      })

      // If the search term is actually multiple search terms
      // (e.g "Florence Nightingale" is florence and nightingale)
      // then we must not add the same link that many times.
      // We need to check if the element we're linking to
      // is already in the search results. This array is for
      // remembering each link we create.
      const links = []

      // Start a counter for search terms
      let searchTermCounter = 0

      // Add the search terms to the list
      searchTerms.forEach(function (term) {
        // Get a surrounding text snippet
        // from the first ancestor with an ID,
        // unless it's in a figure with an ID, in which case
        // get us the figure's ID. This is mainly because
        // the accordion can't find elements inside slidelines.
        let parentTextElement
        const potentialFigureAncestor = term.closest('.figure[id]')
        if (potentialFigureAncestor) {
          parentTextElement = potentialFigureAncestor
        } else {
          parentTextElement = term.closest('[id]')
        }

        // If the link has not already been used,
        // continue to add it to the list.
        if (parentTextElement && links.indexOf(parentTextElement) === -1) {
          // Add this link to the links array
          links.push(parentTextElement)

          // If there is a snippet, use that to create a link
          // to the relevant snippet
          if (parentTextElement.id) {
            // Truncate the text
            const text = ebTruncatedString(parentTextElement.innerText, 60, ' …')

            // Create a link containing the text,
            // and put the link in a list item.
            const link = document.createElement('a')
            link.innerHTML = text
            link.href = '#' + parentTextElement.id
            const listItem = document.createElement('li')
            listItem.append(link)
            list.append(listItem)
          }
        }

        searchTermCounter += 1
        if (searchTermCounter === searchTerms.length) {
          // Flag that result are ready, so that other scripts
          // like accordion.js, can listen for clicks on its links.
          document.body.setAttribute('data-search-results', 'active')
        }
      })

      // Add the box to the page
      document.body.append(wrapper)
    }
  } else {
    document.body.setAttribute('data-search-results', 'none')
  }
}

function ebMarkSearchTermsOnPage () {
  'use strict'

  // Ask mark.js to mark all the search terms.
  // We mark both the searchTerm and the search-query stem
  const markInstance = new Mark(document.querySelector('.content'))
  if (searchTerm || getQueryVariable('search_stem')) {
    // Create an array containing the search term
    // and the search stem to pass to mark.js
    const arrayToMark = []

    // Add them to the array if they exist
    if (searchTerm) {
      arrayToMark.push(searchTerm)
    }
    if (getQueryVariable('search_stem')) {
      arrayToMark.push(getQueryVariable('search_stem'))
    }

    // Mark their instances on the page
    markInstance.unmark().mark(arrayToMark)

    // Show the search-results nav
    ebSearchTermsOnPage()
  } else {
    document.body.setAttribute('data-search-results', 'none')
  }
}

// Wait for ids to be on the page, and the indexing stuff,
// before marking search terms, so that IDs are stable.
function ebPrepareSearchTermsOnPage () {
  'use strict'

  const searchTermsObserver = new MutationObserver(function (mutations) {
    let readyForSearchTerms = false
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && readyForSearchTerms === false) {
        if (document.body.getAttribute('data-index-targets') &&
                        document.body.getAttribute('data-ids-assigned')) {
          readyForSearchTerms = true
          ebMarkSearchTermsOnPage()
          searchTermsObserver.disconnect()
        }
      }
    })
  })

  searchTermsObserver.observe(document.body, {
    attributes: true // listen for attribute changes
  })
}

// Start
if (isSearchPage() === false) {
  ebPrepareSearchTermsOnPage()
} else {
  fillSearchBox()
  document.body.setAttribute('data-search-results', 'none')
}
