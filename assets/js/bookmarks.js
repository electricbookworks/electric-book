/* global window, IntersectionObserver, MutationObserver,
  Element, locales, pageLanguage, settings, ebSlugify,
  ebIsPositionRelative, ebNearestPrecedingSibling,
  ebTruncatedString, ebToggleClickout, ebAccordionListenForAnchorClicks,
  localStorage, sessionStorage, Storage */

// This is a script for managing a user's bookmarks.
// This script waits for setup.js to give elements IDs.
// Then it checks local storage for stored bookmarks,
// and does some housekeeping (e.g. deleting old last-location bookmarks).

// It then reads bookmarks from local storage, and marks the
// relevant bookmarked elements on the page with attributes.
// It then creates a list of bookmarks to show to the user.
// It makes it possible for users to select text in elements to bookmark them.
// It listens for new user bookmarks, and updates the bookmark list
// when a user places a new bookmark.
// It also saves a 'last location' bookmark every few seconds.
// It gives each session an ID, which is a 'sessionDate' timestamp.
// This 'sessionDate' is stored in session storage, and with each
// bookmark in local storage. For the 'last location' bookmarks,
// we only show the user the most recent last-location bookmark
// whose sessionDate does *not* match the current session's sessionDate.
// That way, the last location is always the last place the user
// visited in their last/previous session.

// This script also creates a fingerprint index, which is a map,
// stored in session storage, of IDs to element fingerprints.
// Fingerprints are created in setup.js as attributes, and aim to identify
// an element by its position in the DOM and its opening and closing strings,
// so that if its ID changes, we might still find it by its fingerprint.
// Each stored bookmark includes the bookmarked element's fingerprint.
// This script checks whether the ID of a bookmark in localStorage
// matches its fingerprint in session storage. If it doesn't, we know
// that IDs have shifted, and that bookmarked locations may be inaccurate.
// This script does not yet do anything about that inaccuracy.

// In future, we might offer the user the option of updating bookmarks
// using those fingerprints, in order to improve the accuracy of
// their bookmarks, after shifted content has changed elements' IDs.

// --

// Which elements should we make bookmarkable?
function ebBookmarkableElements () {
  'use strict'

  // Include anything in .content with an ID...
  let bookmarkableElements = document.querySelectorAll(settings.web.bookmarks.elements.include)
  // ... but exclude elements with data-bookmarkable="no",
  // or whose ancestors have data-bookmarkable="no",
  // or who are MathJax elements
  // or are footnote references
  // or those specified in settings.web.bookmarks.elements.exclude
  // (We also check for '[data-bookmarkable="no"]' there,
  // bacause settings.web.bookmarks.elements.exclude may be empty.)
  bookmarkableElements = Array.from(bookmarkableElements).filter(function (element) {
    let status
    if (element.getAttribute('data-bookmarkable') !== 'no' &&
                !element.closest('[data-bookmarkable="no"]') &&
                !element.id.startsWith('MathJax-') &&
                !element.id.startsWith('fnref:') &&
                !element.matches('[data-bookmarkable="no"]', settings.web.bookmarks.elements.exclude)) {
      status = true
    }
    return status
  })

  return bookmarkableElements
}

// Initialise global variables for general use
let ebCurrentSelectionText

// Disable bookmarks on browsers that don't support
// what we need to provide them.
function ebBookmarksSupport () {
  'use strict'
  if (Object.prototype.hasOwnProperty.call(window, 'IntersectionObserver') &&
            window.getSelection &&
            window.getSelection().toString &&
            window.localStorage &&
            Storage !== undefined &&
            document.querySelector('.bookmarks')) {
    return true
  } else {
    const bookmarking = document.querySelector('.bookmarks')
    if (bookmarking !== null) {
      bookmarking.style.display = 'none'
    }
    return false
  }
}

// Generate and store an index of fingerprints and IDs.
function ebBookmarksCreateFingerprintIndex () {
  'use strict'

  const indexOfBookmarks = {}
  const fingerprintedElements = document.querySelectorAll('[data-fingerprint]')
  fingerprintedElements.forEach(function (element) {
    const elementFingerprint = element.getAttribute('data-fingerprint')
    const elementID = element.id
    indexOfBookmarks[elementFingerprint] = elementID
  })
  sessionStorage.setItem('index-of-bookmarks', JSON.stringify(indexOfBookmarks))
}

// Return the indexed ID of an element's fingerprint.
// This is not used now, but may be useful when
// we extend this script to manage IDs that have moved
// after content changes.
function ebBookmarksFingerprintID (elementID) { // eslint-disable-line
  'use strict'

  // If a bookmark's fingerprint isn't in the index,
  // we know that the bookmarked element has moved,
  // because the document has changed.

  // Get the element
  let element
  if (document.getElementById(elementID)) {
    element = document.getElementById(elementID)
  } else {
    return false
  }

  // If we have an element to check, the element has a data-fingerprint,
  // and an index exists, return the ID. Otherwise return false.
  if (element.getAttribute('data-fingerprint') &&
            sessionStorage.getItem('index-of-bookmarks')) {
    // Fetch and return the ID for the fingerprint
    const indexOfBookmarks = JSON.parse(sessionStorage.getItem('index-of-bookmarks'))
    const fingerprintToCheck = element.getAttribute('data-fingerprint')
    const indexedID = indexOfBookmarks[fingerprintToCheck]
    if (elementID !== indexedID) {
      window.alert(locales[pageLanguage].bookmarks['bookmarks-shifted-warning'])
    } else {
      return indexedID
    }
  } else {
    return false
  }
}

// Prompt user to go to last location
function ebBookmarksLastLocationPrompt (link) {
  'use strict'

  // We need to detect if the user has only just arrived.
  // Checking the history length is unreliable, because
  // browsers differ. So we use sessionStorage to store
  // whether the user has just arrived.
  let newSession
  if (sessionStorage.getItem('sessionUnderway')) {
    newSession = false
  } else {
    newSession = true
    sessionStorage.setItem('sessionUnderway', true)
  }

  // If there is a link to go to, this is a new session,
  // and the prompt string has been set in locales, then prompt.
  if (link && newSession &&
            locales[pageLanguage].bookmarks['last-location-prompt']) {
    const prompt = document.createElement('div')
    prompt.classList.add('last-location-prompt')
    prompt.innerHTML = '<a href="' + link + '">' +
                locales[pageLanguage].bookmarks['last-location-prompt'] +
                '</a>'
    document.body.appendChild(prompt)

    // Add class to animate by. Wait a few milliseconds
    // so that CSS transitions will work.
    window.setTimeout(function () {
      prompt.classList.add('last-location-prompt-open')
    }, 50)

    // Let users hide the prompt
    const closeButton = document.createElement('button')
    closeButton.innerHTML = '&#9587;' // &#9587; is ╳
    prompt.appendChild(closeButton)

    // Listen for clicks on close
    closeButton.addEventListener('click', function () {
      prompt.remove()
    })
  }
}

// Create a session ID
function ebBookmarksSessionDate () {
  'use strict'
  // If a sessionDate has been set,
  // return the current sessionDate
  if (sessionStorage.getItem('sessionDate')) {
    return sessionStorage.getItem('sessionDate')
  } else {
    // create, set and return the session ID
    const sessionDate = Date.now()
    sessionStorage.setItem('sessionDate', sessionDate)
    return sessionDate
  }
}

// Clean up last locations of a title
function ebBookmarksCleanLastLocations (bookTitleToClean) {
  'use strict'
  let lastLocations = []

  // Loop through stored bookmarks and add them to the array.
  Object.keys(localStorage).forEach(function (key) {
    if (key.startsWith('bookmark-') && key.includes('-lastLocation-')) {
      const bookmarkBookTitle = JSON.parse(localStorage.getItem(key)).bookTitle
      if (bookTitleToClean === bookmarkBookTitle) {
        lastLocations.push(JSON.parse(localStorage.getItem(key)))
      }
    }
  })

  // Only keep the last two elements:
  // the previous session's lastLocation, and this session's one
  lastLocations = lastLocations.slice(Math.max(lastLocations.length - 2, 0))

  // Sort the lastLocations ascending by the number in their sessionDate
  lastLocations.sort(function (a, b) {
    return parseFloat(a.sessionDate) - parseFloat(b.sessionDate)
  })

  // Get the number of lastLocations that are not the current session
  const previousSessionLocations = lastLocations.filter(function (location) {
    let status = false
    if (location.sessionDate !== ebBookmarksSessionDate()) {
      status = true
    }
    return status
  }).length
  // If there are more than one, drop the first of the lastLocations
  if (previousSessionLocations > 1) {
    lastLocations.splice(0, 1)
  }

  // Remove all localStorage entries for this title except those in lastLocations
  Object.keys(localStorage).forEach(function (key) {
    // Assume we'll discard this item unless it's in lastLocations
    let matches = 0

    if (key.startsWith('bookmark-') && key.includes('-lastLocation-')) {
      const bookmarkBookTitle = JSON.parse(localStorage.getItem(key)).bookTitle
      if (bookTitleToClean === bookmarkBookTitle) {
        lastLocations.forEach(function (lastLocation) {
          if (key.includes(lastLocation.sessionDate)) {
            matches += 1
          }
        })
        if (matches === 0) {
          localStorage.removeItem(key)
        }
      }
    }
  })
}

// Check if bookmark is on the current page
function ebBookmarksCheckForCurrentPage (url) {
  'use strict'

  const pageURL = window.location.href.split('#')[0]
  const bookmarkURL = url.split('#')[0]

  if (pageURL === bookmarkURL) {
    return true
  }
}

// Mark bookmarks in the document
function ebBookmarksMarkBookmarks (bookmarks) {
  'use strict'

  // Clear existing bookmarks
  const bookmarkedElements = document.querySelectorAll('[data-bookmarked]')
  bookmarkedElements.forEach(function (element) {
    element.removeAttribute('data-bookmarked')
  })

  // Mark bookmarked elements
  bookmarks.forEach(function (bookmark) {
    // If this bookmark is on the current page,
    // mark the relevant bookmarked element.
    if (ebBookmarksCheckForCurrentPage(bookmark.location)) {
      // Find the element by bookmark ID.
      // If the bookmark ID isn't on the page, try the fingerprint.
      // If that doesn't work, mark the first element with an ID.
      // If no element has an ID, return.
      let elementToMark
      if (document.getElementById(bookmark.id)) {
        elementToMark = document.getElementById(bookmark.id)
      } else if (document
        .querySelector('[data-fingerprint="' + bookmark.fingerprint + '"')) {
        elementToMark = document
          .querySelector('[data-fingerprint="' + bookmark.fingerprint + '"')
        // console.log('Bookmark ID %s not found on page, trying fingerprint.', bookmark.id);
      } else if (document.querySelector('[id]')) {
        elementToMark = document.querySelector('[id]')
        // console.log('Bookmark fingerprint %s not found on page, using first ID on page.', bookmark.fingerprint);
      } else {
        // console.log('Could not identify element with bookmark ID %s', bookmark.id);
        return
      }

      elementToMark.setAttribute('data-bookmarked', 'true')

      // If the element has already been marked as a user bookmark,
      // leave it a user bookmark. They trump last locations.
      if (elementToMark.getAttribute('data-bookmark-type') === 'userBookmark') {
        elementToMark.setAttribute('data-bookmark-type', 'userBookmark')
      } else {
        elementToMark.setAttribute('data-bookmark-type', bookmark.type)
      }

      ebBookmarksToggleButtonOnElement(elementToMark)
    }
  })
}

// Have user confirm a deletion
function ebBookmarksConfirmDelete (button, bookmark) {
  'use strict'

  // Only run if a delete button exists and a bookmark argument.
  // E.g. if there are no bookmarks after deletion,
  // there is no button, nor its parent element.
  if (button && bookmark && button.parentElement) {
    // Hide the existing button
    button.style.display = 'none'
    const confirmButton = document.createElement('button')
    confirmButton.classList = button.classList
    confirmButton.id = 'bookmarkConfirmDelete'
    button.parentElement.appendChild(confirmButton)

    // If we've been passed a bookmark type as a string
    // we want to delete all bookmarks. Otherwise,
    // we want to delete a single bookmark.
    if (typeof bookmark === 'string') {
      confirmButton.innerHTML = locales[pageLanguage].bookmarks['delete-all-bookmarks-confirm']
    } else {
      confirmButton.innerHTML = locales[pageLanguage].bookmarks['delete-bookmark-confirm']
    }

    // Remove the confirmation after three seconds unclicked
    window.setTimeout(function () {
      confirmButton.remove()
      button.style.display = 'inline-block'
    }, 2000)

    function confirmed () {
      confirmButton.remove()
      button.style.display = 'inline-block'

      // If we've been passed a bookmark type as a string
      // we want to delete all bookmarks of that type.
      // Otherwise, delete the specific bookmark object.
      if (typeof bookmark === 'string') {
        ebBookmarksDeleteAllBookmarks(bookmark)
      } else {
        ebBookmarksDeleteBookmark(bookmark)
      }
    }

    // If the confirmation button is clicked, return the original text
    confirmButton.addEventListener('click', confirmed)
  }
}

// List bookmarks for user
function ebBookmarksListBookmarks (bookmarks) {
  'use strict'

  // Get the bookmarks lists
  const bookmarksList = document.querySelector('.bookmarks-list ul')
  const lastLocationsList = document.querySelector('.last-locations-list ul')

  // Clear the current list
  if (bookmarksList) {
    bookmarksList.innerHTML = ''
  }
  if (lastLocationsList) {
    lastLocationsList.innerHTML = ''
  }

  // A variable to store the first, i.e. most recent, last-location link
  let lastLocationLink

  // Add all the bookmarks to it
  bookmarks.forEach(function (bookmark) {
    // Clean last locations
    ebBookmarksCleanLastLocations(bookmark.bookTitle)

    // If lastLocation and it's the same session, then
    // quit, because we only want the previous session's last location
    if (bookmark.type === 'lastLocation' &&
                bookmark.sessionDate === ebBookmarksSessionDate()) {
      return
    }

    // Create list item
    const listItem = document.createElement('li')
    listItem.setAttribute('data-bookmark-type', bookmark.type)

    // Add the page title
    if (bookmark.pageTitle) {
      const page = document.createElement('span')
      page.classList.add('bookmark-page')
      page.innerHTML = '<a href="' + bookmark.location + '">' +
                    bookmark.pageTitle +
                    '</a>'
      listItem.appendChild(page)
    }

    // Add the section heading, if any
    if (bookmark.sectionHeading) {
      const sectionHeading = document.createElement('span')
      sectionHeading.classList.add('bookmark-section')
      sectionHeading.innerHTML = '<a href="' + bookmark.location + '">' +
                    bookmark.sectionHeading +
                    '</a>'
      listItem.appendChild(sectionHeading)
    }

    // Add the description
    if (bookmark.description) {
      const description = document.createElement('span')
      description.classList.add('bookmark-description')
      description.innerHTML = bookmark.description
      listItem.appendChild(description)
    }

    // Add title span with link
    if (bookmark.bookTitle) {
      const title = document.createElement('span')
      title.classList.add('bookmark-title')
      title.innerHTML = '<a href="' + bookmark.location + '">' +
                    bookmark.bookTitle +
                    '</a>'
      listItem.appendChild(title)
    }

    // Format the bookmark date from sessionDate,
    // then add it to the listItem. Leave locale undefined,
    // so that the user gets their default locale's format.
    if (bookmark.sessionDate) {
      const readableSessionDate = new Date(Number(bookmark.sessionDate))
        .toLocaleDateString(undefined, {
          // weekday: 'long',
          // hour: 'numeric',
          // minute: 'numeric',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      const date = document.createElement('span')
      date.classList.add('bookmark-date')
      date.innerHTML = '<a href="' + bookmark.location + '">' +
                    readableSessionDate +
                    '</a>'
      listItem.appendChild(date)
    }

    // Add a delete button and listen for clicks on it
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('bookmark-delete')
    deleteButton.innerHTML = locales[pageLanguage].bookmarks['delete-bookmark']
    listItem.appendChild(deleteButton)
    deleteButton.addEventListener('click', function (event) {
      ebBookmarksConfirmDelete(event.target, bookmark)
    })

    // Add the list item to the list
    if (bookmark.type === 'lastLocation') {
      lastLocationsList.appendChild(listItem)
    } else {
      bookmarksList.appendChild(listItem)
    }

    // If the lastLocationLink isn't yet set, set it because
    // this iteration in the loop must be the most recent lastLocation.
    if (bookmark.type === 'lastLocation' && lastLocationLink === undefined) {
      lastLocationLink = bookmark.location
    }
  })

  // Add button to delete all bookmarks
  const deleteAllBookmarksListItem = document.createElement('li')
  deleteAllBookmarksListItem.classList.add('bookmarks-delete-all')
  const deleteAllBookmarksButton = document.createElement('button')
  deleteAllBookmarksButton.innerHTML = locales[pageLanguage].bookmarks['delete-all']
  deleteAllBookmarksListItem.appendChild(deleteAllBookmarksButton)
  bookmarksList.appendChild(deleteAllBookmarksListItem)
  deleteAllBookmarksButton.addEventListener('click', function (event) {
    ebBookmarksConfirmDelete(event.target, 'userBookmark')
  })

  // Copy to the last-locations list, too
  const deleteAllBookmarksListItemLastLocations = deleteAllBookmarksListItem.cloneNode(true)
  lastLocationsList.appendChild(deleteAllBookmarksListItemLastLocations)
  deleteAllBookmarksListItemLastLocations.addEventListener('click', function (event) {
    ebBookmarksConfirmDelete(event.target, 'lastLocation')
  })

  // Listen for clicks on the new anchor links,
  // if we're using the content accordion.
  if (typeof ebAccordionListenForAnchorClicks === 'function') {
    ebAccordionListenForAnchorClicks('.bookmarks-modal a')
  }

  // Prompt the user about their last location
  ebBookmarksLastLocationPrompt(lastLocationLink)
}

// Check if a page has bookmarks
function ebBookmarksCheckForBookmarks () {
  'use strict'

  // Create an empty array to write to
  // when we read the localStorage bookmarks strings
  const bookmarks = []

  // Loop through stored bookmarks and clean out old ones.
  Object.keys(localStorage).forEach(function (key) {
    if (key.startsWith('bookmark-')) {
      const entry = JSON.parse(localStorage.getItem(key))
      if (entry) {
        const title = entry.bookTitle
        ebBookmarksCleanLastLocations(title)
      }
    }
  })

  // Now loop through the remaining stored bookmarks and add them to the array.
  Object.keys(localStorage).forEach(function (key) {
    if (key.startsWith('bookmark-')) {
      const bookmark = JSON.parse(localStorage.getItem(key))

      // Add any bookmark that isn't a last-location,
      // only last-locations that are not from the current session.
      if (bookmark.type !== 'lastLocation') {
        bookmarks.push(bookmark)
      } else if (bookmark.sessionDate !== ebBookmarksSessionDate()) {
        bookmarks.push(bookmark)
      }
    }
  })

  // Mark them in the document
  ebBookmarksMarkBookmarks(bookmarks)

  // List them for the user
  ebBookmarksListBookmarks(bookmarks)
}

// Delete a bookmark
function ebBookmarksDeleteBookmark (bookmark) {
  'use strict'

  // Delete from local storage
  localStorage.removeItem(bookmark.key)
  // Remove the entry from the list
  ebBookmarksCheckForBookmarks()
}

// Delete all bookmarks
function ebBookmarksDeleteAllBookmarks (type) {
  'use strict'

  // Loop through stored bookmarks and delete
  Object.keys(localStorage).forEach(function (key) {
    if (key.startsWith('bookmark-')) {
      // If a type has been specified, only delete
      // bookmarks of that type. Otherwise,
      // delete all bookmarks of any type.
      const bookmarkType = JSON.parse(localStorage[key]).type
      if (type) {
        if (type === bookmarkType) {
          localStorage.removeItem(key)
        }
      } else {
        localStorage.removeItem(key)
      }
    }
  })

  // Refresh the bookmarks lists
  ebBookmarksCheckForBookmarks()
}

// Return the ID of a bookmarkable element
function ebBookmarksElementID (element) {
  'use strict'

  // If we're bookmarking a specified element,
  // i.e. an element was passed to this function,
  // use its hash, otherwise use the first
  // visible element in the viewport.
  if (!element) {
    element = document.querySelector('[data-bookmark="onscreen"]') || document.body
  }
  if (element.id) {
    return element.id
  } else if (window.location.hash) {
    // If for some reason the element has no ID,
    // return the hash of the current window location.
    return window.location.hash
  } else {
    // And in desperation, use the first element
    // with an ID on the page.
    return document.querySelector('[id]').id
  }
}

// Create and store bookmark
function ebBookmarksSetBookmark (type, element, description) {
  'use strict'

  // Get fallback description text
  if (!description) {
    // Use the opening characters of the text.
    // Note that textContent includes line breaks etc.,
    // so we remove any at the starts and ends of the string
    const descriptionText = element.textContent
      .trim()
      .replace(/^[\n]+/g, '')
      .replace(/[\n]+$/g, '')
      .trim()
    description = ebTruncatedString(descriptionText, 120, ' …')
  }

  // Get the page heading and the most recent section heading, if any.
  // If the page starts with an h1, check for an h2.
  // If an h2, check for an h3, up to h4 sections. Otherwise no section heading.
  let pageTitle, sectionHeadingElement, sectionHeading
  if (document.querySelector('h1')) {
    pageTitle = document.querySelector('h1').textContent.trim()
    if (ebNearestPrecedingSibling(element, 'H2')) {
      sectionHeadingElement = ebNearestPrecedingSibling(element, 'H2')
      sectionHeading = sectionHeadingElement.textContent

      // If the sectionHeading contains links (e.g. it's an accordion header)
      // only grab the textContent of the first link
      if (sectionHeadingElement.querySelector('a')) {
        sectionHeadingElement = sectionHeadingElement.querySelector('a')
        sectionHeading = sectionHeadingElement.textContent
      }
    }
  } else if (document.querySelector('h2')) {
    pageTitle = document.querySelector('h2').textContent.trim()
    if (ebNearestPrecedingSibling(element, 'H3')) {
      sectionHeadingElement = ebNearestPrecedingSibling(element, 'H3')
      sectionHeading = sectionHeadingElement.textContent
      if (sectionHeadingElement.querySelector('a')) {
        sectionHeadingElement = sectionHeadingElement.querySelector('a')
        sectionHeading = sectionHeadingElement.textContent
      }
    }
  } else if (document.querySelector('h3')) {
    pageTitle = document.querySelector('h3').textContent.trim()
    if (ebNearestPrecedingSibling(element, 'H4')) {
      sectionHeadingElement = ebNearestPrecedingSibling(element, 'H4')
      sectionHeading = sectionHeadingElement.textContent
      if (sectionHeadingElement.querySelector('a')) {
        sectionHeadingElement = sectionHeadingElement.querySelector('a')
        sectionHeading = sectionHeadingElement.textContent
      }
    }
  } else {
    pageTitle = document.title.trim()
    sectionHeading = ''
  }

  // Trim the section heading to 50 characters of textContent.
  // Remove from the last space, to end on a full word.
  if (sectionHeading && sectionHeading.length > 50) {
    sectionHeading = ebTruncatedString(sectionHeading, 50, ' …')
  }

  // Create a bookmark object
  const bookmark = {
    sessionDate: ebBookmarksSessionDate(),
    type,
    bookTitle: document.querySelector('.wrapper').dataset.title,
    pageTitle,
    sectionHeading,
    description, // potential placeholder for a user-input description
    id: ebBookmarksElementID(element),
    fingerprint: element.getAttribute('data-fingerprint'),
    location: window.location.href.split('#')[0] + '#' + ebBookmarksElementID(element)
  }

  // Set a bookmark named for its type only.
  // So there will only ever be one bookmark of each type saved.
  // To save more bookmarks, make the key more unique.
  // Note that the prefix 'bookmark-' is used in ebBookmarksCheckForBookmarks().
  let bookmarkKey
  if (bookmark.type === 'lastLocation') {
    bookmarkKey = 'bookmark-' +
                ebSlugify(bookmark.bookTitle) +
                '-' +
                bookmark.type +
                '-' +
                ebBookmarksSessionDate()
  } else {
    bookmarkKey = 'bookmark-' +
                ebSlugify(bookmark.bookTitle) +
                '-' +
                bookmark.type +
                '-' +
                Date.now() // this makes each userBookmark unique
  }

  // Add the key to the bookmark object for easy reference
  bookmark.key = bookmarkKey

  // Save the bookmark
  localStorage.setItem(bookmarkKey, JSON.stringify(bookmark))

  // Refresh the bookmarks list.
  // No need to refresh for a lastLocation,
  // since that only applies to the next visit.
  if (type !== 'lastLocation') {
    ebBookmarksCheckForBookmarks()
  }
}

// Mark an element that has been user-bookmarked
function ebBookmarkMarkBookmarkedElement (element) {
  'use strict'

  // Set the new bookmark
  element.setAttribute('data-bookmarked', 'true')
}

// Remove a bookmark by clicking its icon
function ebBookmarksRemoveByIconClick (button) {
  'use strict'
  const bookmarkLocation = window.location.href.split('#')[0] + '#' + button.parentElement.id

  // Loop through stored bookmarks,
  // find this one, and delete it.
  // Note there is no 'confirm delete' step here.
  Object.keys(localStorage).forEach(function (key) {
    if (key.startsWith('bookmark-')) {
      const entry = JSON.parse(localStorage.getItem(key))
      if (entry.location === bookmarkLocation) {
        ebBookmarksDeleteBookmark(entry)
      }
    }
  })
}

// Listen for bookmark clicks
function ebBookmarksListenForClicks (button) {
  'use strict'
  button.addEventListener('click', function (event) {
    // Don't let click on bookmark trigger accordion-close etc.
    event.stopPropagation()

    // If the bookmark is pending, set the bookmark
    if (button.parentElement.classList.contains('bookmark-pending')) {
      ebBookmarksSetBookmark('userBookmark',
        button.parentNode, ebCurrentSelectionText.trim())
      ebBookmarkMarkBookmarkedElement(button.parentNode)
      button.parentElement.classList.remove('bookmark-pending')
    } else {
      ebBookmarksRemoveByIconClick(button)
    }
  })
}

// Add a bookmark button to bookmarkable elements
function ebBookmarksToggleButtonOnElement (element, positionX, positionY) {
  'use strict'

  // Exit if no element
  if (!element) {
    return
  }

  // Get the main bookmark icons from the page,
  const bookmarkIcon = document.querySelector('.bookmark-icon')
  const historyIcon = document.querySelector('.history-icon')

  // Get the type of bookmark we're setting
  let bookmarkType = ''
  if (element.getAttribute('data-bookmark-type')) {
    bookmarkType = element.getAttribute('data-bookmark-type')
  }

  // If the user is setting a bookmark, don't use history icon
  if (element.classList.contains('bookmark-pending')) {
    bookmarkType = 'userBookmark'
  }

  // If the element has no button, add one.
  let button
  if (!element.querySelector('button.bookmark-button')) {
    // Copy the icon SVG code to our new button.
    button = document.createElement('button')
    button.classList.add('bookmark-button')

    // Set icon based on bookmark type
    if (bookmarkType === 'lastLocation') {
      button.innerHTML = historyIcon.outerHTML
      button.title = locales[pageLanguage].bookmarks['last-location']
    } else {
      button.innerHTML = bookmarkIcon.outerHTML
      button.title = locales[pageLanguage].bookmarks.bookmark
    }

    // Append the button
    element.insertAdjacentElement('afterbegin', button)

    // Listen for clicks
    ebBookmarksListenForClicks(button)

    // Otherwise, if the element has a last-location icon
    // the user it trying to set a user bookmark, so
    // switch the icon for a user bookmark icon.
  } else if (element.querySelector('button.bookmark-button .history-icon') &&
            bookmarkType === 'userBookmark') {
    button = element.querySelector('button.bookmark-button')
    button.innerHTML = bookmarkIcon.outerHTML

    // Otherwise, if the element needs a user-bookmark button, add it
  } else if (element.querySelector('button.bookmark-button') &&
            bookmarkType === 'userBookmark') {
    button = element.querySelector('button.bookmark-button')
    button.innerHTML = bookmarkIcon.outerHTML

    // Otherwise, if we are placing a bookmark (not jsut
    // showing a pending bookmark icon) add a last-location icon button
  } else if (element.querySelector('button.bookmark-button') &&
            bookmarkType === '') {
    button = element.querySelector('button.bookmark-button')
    button.innerHTML = bookmarkIcon.outerHTML
  } else {
    button = element.querySelector('button.bookmark-button')
    button.innerHTML = historyIcon.outerHTML
  }

  // Position the button after the selection,
  // on browsers that support custom properties
  if (positionX !== undefined && positionY !== undefined) {
    // If the vertical height is not zero, we have to deduct
    // the height of the button, to align it with the selected text.
    if (positionY > 0) {
      positionY = positionY - button.offsetHeight
    }

    // To avoid letting the bookmark appear off screen,
    // don't let the horizontal position exceed the width
    // of its parent. The browser doesn't give us the button
    // width in time for us to use it here. So we have to guess.
    let buttonWidth = '30' // px
    if (button.clientWidth > 0) {
      buttonWidth = button.clientWidth
    }
    const maxHorizontalPosition = button.parentElement.clientWidth +
                button.parentElement.getBoundingClientRect().left -
                buttonWidth
    if (positionX > maxHorizontalPosition) {
      positionX = maxHorizontalPosition
    }

    // Add the positions as CSS variables
    let positionUnitX = ''
    let positionUnitY = ''
    if (positionX !== 'auto') {
      positionUnitX = 'px'
    }
    if (positionY !== 'auto') {
      positionUnitY = 'px'
    }
    button.setAttribute('style',
      '--bookmark-button-position: absolute;' +
                '--bookmark-button-position-x: ' + positionX + positionUnitX + ';' +
                '--bookmark-button-position-y: ' + positionY + positionUnitY + ';')
  } else {
    // Remove prior position settings, e.g. on a second click
    button.removeAttribute('style')
  }
}

// Mark elements in the viewport so we can bookmark them
function ebBookmarksMarkVisibleElements (elements) {
  'use strict'

  // Ensure we only use elements with IDs
  const elementsWithIDs = Array.from(elements).filter(function (element) {
    // Reasons not to include an element, e.g.
    // it is a MathJax element.
    let status
    if (element.id && element.id.startsWith('MathJax-')) {
      status = false
    }
    // Otherwise, if it has an ID, include it.
    if (element.id !== 'undefined') {
      status = true
    }
    return status
  })

  // If IntersectionObserver is supported, create one.
  // In the config, we set rootMargin slightly negative,
  // so that at least a meaningful portion of the element
  // is visible before it gets a bookmark icon.
  const ebBookmarkObserverConfig = {
    rootMargin: '-50px'
  }
  if (Object.prototype.hasOwnProperty.call(window, 'IntersectionObserver')) {
    const bookmarkObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-bookmark', 'onscreen')
        } else {
          entry.target.setAttribute('data-bookmark', 'offscreen')
        }
      })
    }, ebBookmarkObserverConfig)

    // Observe each element
    elementsWithIDs.forEach(function (element) {
      bookmarkObserver.observe(element)
    })
  } else {
    // If the browser doesn't support IntersectionObserver,
    // maybe this will work -- largely untested code this.
    // Test and fix it if we need old IE support.
    const scrollTop = window.scrollTop
    const windowHeight = window.offsetHeight
    elementsWithIDs.forEach(function (element) {
      if (scrollTop <= element.offsetTop &&
                    (element.offsetHeight + element.offsetTop) < (scrollTop + windowHeight) &&
                    element.dataset['in-view'] === 'false') {
        element.target.setAttribute('data-bookmark', 'onscreen')
        ebBookmarksToggleButtonOnElement(element.target)
      } else {
        element.target.setAttribute('data-bookmark', 'offscreen')
        ebBookmarksToggleButtonOnElement(element.target)
      }
    })
  }
}

// Listen for user interaction to show bookmark button
function ebBookmarksAddButtons (elements, action) {
  'use strict'

  // If an action is specified e.g. 'click',
  // add the button when an element is clicked.
  if (action) {
    elements.forEach(function (element) {
      element.addEventListener(action, function (event) {
        // Toggle the button on the element, currentTarget,
        // (not necessarily the clicked element, which might be a child).
        ebBookmarksToggleButtonOnElement(event.currentTarget)
      })
    })
  }
}

// Toggle the modal visibility
function ebBookmarksToggleModal (modal) {
  'use strict'

  if (!modal) {
    modal = document.getElementById('bookmarks-modal')
  }

  // Toggle the clickable clickOut area
  ebToggleClickout(modal, function () {
    // If the modal is open, close it
    if (document.querySelector('[data-bookmark-modal="open"]')) {
      modal.style.display = 'none'
      modal.setAttribute('data-bookmark-modal', 'closed')

      // Otherwise, show it
    } else {
      modal.style.display = 'flex'
      modal.setAttribute('data-bookmark-modal', 'open')
    }
  })
}

// Open the modal when the bookmarks button is clicked
function ebBookmarksOpenOnClick () {
  'use strict'
  const button = document.querySelector('.bookmarks > .bookmark-icon')
  if (button !== null) {
    button.addEventListener('click', function () {
      ebBookmarksToggleModal()
    })
  }
}

// In addition to CSS hover, mark clicked lists
function ebBookmarkListsOpenOnClick () {
  'use strict'
  const listHeaders = document.querySelectorAll('.bookmarks-list-header, .last-locations-list-header')
  listHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      if (document.querySelector('.bookmarks-list-header-open')) {
        // Mark the headers ...
        const openHeader = document.querySelector('.bookmarks-list-header-open')
        openHeader.classList.remove('bookmarks-list-header-open')
        header.classList.add('bookmarks-list-header-open')

        // ... and their parents
        openHeader.parentElement.classList.remove('bookmarks-list-open')
        header.parentElement.classList.add('bookmarks-list-open')

        // Firefox doesn't repaint here, forcing users to reclick.
        // Not sure how to handle that here yet.
      }
    })
  })

  // Set default view
  const bookmarksListHeader = document.querySelector('.bookmarks-list-header')
  if (bookmarksListHeader !== null) {
    bookmarksListHeader.classList.add('bookmarks-list-header-open')
  }
}

// Always listen for and store user's text selection
function ebBookmarksListenForTextSelection () {
  'use strict'
  document.onselectionchange = function () {
    // console.log('New selection made');
    ebCurrentSelectionText = document.getSelection().toString()

    // If the browser supports anchorNode, use that
    // to get the starting element, otherwise second prize
    // we use the focusNode, where the selection ends
    // (IE supports focusNode but maybe not anchorNode)
    const selectionStartPoint = window.getSelection().anchorNode
      ? window.getSelection().anchorNode
      : false
    const selectionEndPoint = window.getSelection().focusNode

    // Check if an excluded element is being clicked/selected
    // If not a DOM Element, assign to parent element
    const clickedElement = selectionEndPoint instanceof Element
      ? selectionEndPoint
      : selectionEndPoint.parentElement

    // Exit if element is excluded in settings.js
    // ebBookmarkableElements() can't be re-used here in its current form,
    // because its approach requires testing the closest parent containing an ID,
    // which we don't want to do here. We also check for '[data-bookmarkable="no"]'
    // because settings.web.bookmarks.elements.exclude may be empty.
    if (clickedElement.matches('[data-bookmarkable="no"]', settings.web.bookmarks.elements.exclude)) {
      return
    }

    // Try bookmark a valid selection
    let selectedElement = selectionStartPoint || selectionEndPoint
    // If not a DOM Element, assign to parent element
    selectedElement = selectedElement instanceof Element
      ? selectedElement
      : selectedElement.parentElement
    const bookmarkableElement = selectedElement.closest('[id]')
    // Exit if the element isn't bookmarkable
    if (!ebBookmarkableElements().includes(bookmarkableElement)) {
      return
    }

    // Mark the element as pending a bookmark, so that
    // in CSS we can show the bookmark button
    if (document.querySelector('.bookmark-pending')) {
      const previousBookmarkableElement = document.querySelector('.bookmark-pending')
      previousBookmarkableElement.classList.remove('bookmark-pending')
    }
    if (bookmarkableElement) {
      bookmarkableElement.classList.add('bookmark-pending')

      // Remove pending icon soon if not clicked
      // and no text is currently selected
      setTimeout(function () {
        if (window.getSelection().isCollapsed) {
          bookmarkableElement.classList.remove('bookmark-pending')
        }
      }, 3000)
    }

    // Add the bookmark button. If no text is selected,
    // add the button in the default position. Otherwise,
    // position it at the end of the text selection.
    if (window.getSelection().isCollapsed) {
      ebBookmarksToggleButtonOnElement(bookmarkableElement, 'auto', 'auto')
    } else {
      // If the button has a position: relative parent,
      // we want to set its absolute position based on that parent.
      // Otherwise, we can set it relative to the page.
      let positionX, positionY
      if (ebIsPositionRelative(bookmarkableElement)) {
        const relativeParent = ebIsPositionRelative(bookmarkableElement)
        positionX = window.getSelection().getRangeAt(0).getBoundingClientRect().right -
                        relativeParent.getBoundingClientRect().left
        positionY = window.getSelection().getRangeAt(0).getBoundingClientRect().bottom -
                        relativeParent.getBoundingClientRect().top
      } else {
        positionX = window.getSelection().getRangeAt(0).getBoundingClientRect().right +
                        window.pageXOffset
        positionY = window.getSelection().getRangeAt(0).getBoundingClientRect().bottom +
                        window.pageYOffset
      }

      ebBookmarksToggleButtonOnElement(bookmarkableElement, positionX, positionY)
    }
  }
}

// Set the lastLocation bookmark
function ebBookmarksSetLastLocation () {
  'use strict'
  if (ebBookmarksElementID()) {
    ebBookmarksSetBookmark('lastLocation',
      document.getElementById(ebBookmarksElementID()))
  }
}

// Move the modal HTML to an independent location
function ebBookmarksMoveModal () {
  'use strict'
  const modal = document.getElementById('bookmarks-modal')
  if (modal !== null) {
    document.body.appendChild(modal)
  }
}

// The main process
function ebBookmarksProcess () {
  'use strict'

  // Set the sessionDate
  ebBookmarksSessionDate()

  // Create the fingerprint index
  ebBookmarksCreateFingerprintIndex()

  // Move the modal
  ebBookmarksMoveModal()

  // Show the bookmarks controls
  const bookmarksControls = document.querySelector('.bookmarks')
  if (bookmarksControls !== null) {
    bookmarksControls.classList.remove('visuallyhidden')
  }
  ebBookmarksOpenOnClick()
  ebBookmarkListsOpenOnClick()

  // Mark which elements are available for bookmarking
  ebBookmarksMarkVisibleElements(ebBookmarkableElements())
  ebBookmarksAddButtons(ebBookmarkableElements())

  // Check for bookmarks
  ebBookmarksCheckForBookmarks()

  // Store the last location.
  // We might have done this on beforeunload, when user leaves page,
  // but that isn't supported on many mobile browsers, and may
  // prevent browsers from using in-memory page navigation caches.
  // So we set the lastLocation every 5 seconds.
  window.setInterval(ebBookmarksSetLastLocation, 5000)

  // Listen for text selections for bookmarking
  ebBookmarksListenForTextSelection()
}

// Start bookmarking
function ebBookmarksInit () {
  'use strict'
  // Check for support before running the main process
  if (ebBookmarksSupport()) {
    ebBookmarksProcess()
  }
}

// Wait for IDs and fingerprints to be loaded
// and IDs to be assigned
// before applying the accordion.
function ebPrepareForBookmarks () {
  'use strict'

  const bookmarksObserver = new MutationObserver(function (mutations) {
    let readyForBookmarks = false
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && readyForBookmarks === false) {
        if (document.body.getAttribute('data-ids-assigned') &&
                        document.body.getAttribute('data-fingerprints-assigned')) {
          readyForBookmarks = true
          ebBookmarksInit()
          bookmarksObserver.disconnect()
        }
      }
    })
  })

  bookmarksObserver.observe(document.body, {
    attributes: true // listen for attribute changes
  })
}

if (settings.web.bookmarks.enabled) {
  window.onload = ebPrepareForBookmarks()
}
