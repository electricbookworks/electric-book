/* global localStorage, IntersectionObserver, Element */

import { locales, pageLanguage } from '../locales'
import { ebBookmarksDeleteBookmark } from './delete'
import ebBookmarksSetBookmark from './set-bookmark'
import { ebIsPositionRelative } from '../utilities'

const settings = process.env.settings

// Which elements should we make bookmarkable?
function ebBookmarkableElements () {
  // Include anything in .content with an ID...
  let bookmarkableElements = document.querySelectorAll(process.env.settings.web.bookmarks.elements.include)
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
                !element.matches('[data-bookmarkable="no"]', process.env.settings.web.bookmarks.elements.exclude)) {
      status = true
    }
    return status
  })

  return bookmarkableElements
}

function ebBookmarksListenForTextSelection () {
  document.onselectionchange = function () {
    // console.log('New selection made');
    window.ebCurrentSelectionText = document.getSelection().toString()

    // If the browser supports anchorNode, use that
    // to get the starting element, otherwise second prize
    // we use the focusNode, where the selection ends
    // (IE supports focusNode but maybe not anchorNode)
    const selectionStartPoint = window.getSelection().anchorNode
      ? window.getSelection().anchorNode
      : false
    const selectionEndPoint = window.getSelection().focusNode

    if (!selectionEndPoint) return

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

// Mark an element that has been user-bookmarked
function ebBookmarkMarkBookmarkedElement (element) {
  // Set the new bookmark
  element.setAttribute('data-bookmarked', 'true')
}

// Remove a bookmark by clicking its icon
function ebBookmarksRemoveByIconClick (button) {
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
  button.addEventListener('click', function (event) {
    // Don't let click on bookmark trigger accordion-close etc.
    event.stopPropagation()

    // If the bookmark is pending, set the bookmark
    if (button.parentElement.classList.contains('bookmark-pending')) {
      ebBookmarksSetBookmark('userBookmark',
        button.parentNode, window.ebCurrentSelectionText.trim())
      ebBookmarkMarkBookmarkedElement(button.parentNode)
      button.parentElement.classList.remove('bookmark-pending')
    } else {
      ebBookmarksRemoveByIconClick(button)
    }
  })
}

// Add a bookmark button to bookmarkable elements
function ebBookmarksToggleButtonOnElement (element, positionX, positionY) {
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
export default function ebBookmarksSelect () {
  const elements = ebBookmarkableElements()
  ebBookmarksMarkVisibleElements(elements)
  ebBookmarksListenForTextSelection()
}

export { ebBookmarksToggleButtonOnElement }
