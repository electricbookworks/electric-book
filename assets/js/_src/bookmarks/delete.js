/* global localStorage */
import ebUserSession from '../user-session'
import ebBookmarksCheckForBookmarks from './check-for-bookmarks'
import ebBookmarksHasApi from './has-api'
import { ebBookmarksModalSetLoading } from './modal'

async function ebBookmarksBookmarkStoreDelete (bookmark) {
  const deleted = JSON.parse(localStorage.getItem('bookmark-deleted')) || []
  deleted.push(bookmark.key)
  localStorage.setItem('bookmark-deleted', JSON.stringify(deleted))
  localStorage.removeItem(bookmark.key)
  ebUserSession?.ID && ebBookmarksHasApi && fetch('/api/bookmark/delete/', {
    method: 'POST',
    body: JSON.stringify({ keys: [bookmark.key] })
  })
}

// Delete a bookmark
async function ebBookmarksDeleteBookmark (bookmark) {
  ebBookmarksModalSetLoading(true)
  if (bookmark.type === 'lastLocation') {
    localStorage.removeItem(bookmark.key)
  } else {
    await ebBookmarksBookmarkStoreDelete(bookmark)
  }

  // Remove the entry from the list
  await ebBookmarksCheckForBookmarks()
  ebBookmarksModalSetLoading(false)
}

// Delete all bookmarks
async function ebBookmarksDeleteAllBookmarks (type) {
  ebBookmarksModalSetLoading(true)
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

  // Delete from storage
  if (type === 'userBookmark' || !type) {
    ebUserSession?.ID && ebBookmarksHasApi && await fetch('/api/bookmark/delete/all/')
  }

  // Refresh the bookmarks lists
  await ebBookmarksCheckForBookmarks()
  ebBookmarksModalSetLoading(false)
}

export {
  ebBookmarksDeleteBookmark,
  ebBookmarksDeleteAllBookmarks
}
