import ebBookmarksFetch from './fetch'
import ebBookmarksList from './list'
import ebBookmarksCheckForCurrentPage from './check-for-current-page'
import { ebBookmarksToggleButtonOnElement } from './select'

// Mark bookmarks in the document
function ebBookmarksMarkBookmarks (bookmarks) {
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

async function ebBookmarksCheckForBookmarks () {
  const { bookmarks, bookmarkNotes } = await ebBookmarksFetch()
  // Mark them in the document
  ebBookmarksMarkBookmarks(bookmarks)
  // List them for the user
  ebBookmarksList({ bookmarks, bookmarkNotes })
}

export default ebBookmarksCheckForBookmarks
