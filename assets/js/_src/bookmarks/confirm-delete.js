import { locales, pageLanguage } from '../locales'
import { ebBookmarksDeleteBookmark, ebBookmarksDeleteAllBookmarks } from './delete'

function ebBookmarksConfirmDelete (button, bookmark) {
  // Only run if a delete button exists and a bookmark argument.
  // E.g. if there are no bookmarks after deletion,
  // there is no button, nor its parent element.
  if (button && bookmark && button.parentElement) {
    // Determine the confirmation message based on bookmark type
    let confirmMessage
    if (typeof bookmark === 'string') {
      confirmMessage = locales[pageLanguage].bookmarks['delete-all-bookmarks-confirm']
    } else {
      confirmMessage = locales[pageLanguage].bookmarks['delete-bookmark-confirm']
    }

    // Show confirmation dialog
    if (window.confirm(confirmMessage)) {
      // If we've been passed a bookmark type as a string
      // we want to delete all bookmarks of that type.
      // Otherwise, delete the specific bookmark object.
      if (typeof bookmark === 'string') {
        ebBookmarksDeleteAllBookmarks(bookmark)
      } else {
        ebBookmarksDeleteBookmark(bookmark)
      }
    }
  }
}

export default ebBookmarksConfirmDelete
