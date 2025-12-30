/* global localStorage */

import { ebTruncatedString, ebSlugify, ebNearestPrecedingSibling } from '../utilities'
import ebBookmarksSessionDate from './session-date'
import ebBookmarksCheckForBookmarks from './check-for-bookmarks'
import ebBookmarksSave from './save'
import ebBookmarksElementID from './element-id'

// Create and store bookmark
async function ebBookmarksSetBookmark (type, element, description) {
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
  const sessionDate = `${ebBookmarksSessionDate()}`
  const bookmark = {
    sessionDate,
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
  let bookmarkKey
  if (bookmark.type === 'lastLocation') {
    bookmarkKey = 'bookmark-' +
                ebSlugify(bookmark.bookTitle) +
                '-' +
                bookmark.type +
                '-' +
                sessionDate
  } else {
    bookmarkKey = 'bookmark-' + Date.now() // current timestamp makes it unique
  }

  // Add the key to the bookmark object for easy reference
  bookmark.key = bookmarkKey

  // Save the bookmark
  if (type !== 'lastLocation') {
    await ebBookmarksSave(bookmark)
  } else {
    // The current approach of using a set interval to save last locations may significantly increase storage usage costs,
    // so continuing to use local storage for these types
    localStorage.setItem(bookmarkKey, JSON.stringify(bookmark))
  }

  // Refresh the bookmarks list.
  // No need to refresh for a lastLocation,
  // since that only applies to the next visit.
  if (type !== 'lastLocation') {
    ebBookmarksCheckForBookmarks()
  }
}

export default ebBookmarksSetBookmark
