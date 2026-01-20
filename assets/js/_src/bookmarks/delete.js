/* global localStorage */
import ebUserSession from '../user-session'
import ebBookmarksCheckForBookmarks from './check-for-bookmarks'
import ebBookmarksHasApi from './has-api'
import { ebBookmarksModalSetLoading } from './modal'
import ebBookmarksSessionDate from './session-date'
import ebBookmarksGetLocalStorage from './get-local-storage'

async function ebBookmarksDeleteSync ({ keys, all = false }) {
  const canSync = await ebUserSession()?.ID && await ebBookmarksHasApi()
  Array.isArray(keys) && keys.forEach((key) => {
    localStorage.removeItem(key)
    if (!canSync) {
      // create deleted record to prevent logged-out to logged-in resurection
      const deleted = JSON.parse(localStorage.getItem('bookmark-deleted')) || []
      localStorage.setItem('bookmark-deleted', JSON.stringify([...deleted, key]))
    }
  })
  if (canSync) {
    if (all) {
      // Make sure all bookmarks are deleted server-side, even if not in localStorage for whatever reason
      await fetch('/api/bookmark/delete/all/')
    } else {
      fetch('/api/bookmark/delete/', {
        method: 'POST',
        body: JSON.stringify({ keys, sessionDate: ebBookmarksSessionDate() })
      })
    }
  }
}

// Delete a bookmark
async function ebBookmarksDeleteBookmark (bookmark) {
  ebBookmarksModalSetLoading(true)

  if (bookmark.type === 'userBookmark') {
    await ebBookmarksDeleteSync({ keys: [bookmark.key] })
  } else {
    localStorage.removeItem(bookmark.key)
  }

  // Remove the entry from the list
  await ebBookmarksCheckForBookmarks()
  ebBookmarksModalSetLoading(false)
}

async function ebBookmarksDeleteAllBookmarks (type) {
  // Bookmark type is compulsory
  if (!type) return

  ebBookmarksModalSetLoading(true)
  const userBookmarksToDelete = []

  const bookmarks = ebBookmarksGetLocalStorage({ prefix: 'bookmark-', excludePrefix: 'bookmark-deleted' })
  bookmarks.forEach(function (bookmark) {
    if (bookmark.type === type) {
      if (type === 'userBookmark') {
        userBookmarksToDelete.push(bookmark.key)
      } else {
        localStorage.removeItem(bookmark.key)
      }
    }
  })

  // Delete userBookmarks, which requires hybrid localStorage + server sync
  if (type === 'userBookmark' && userBookmarksToDelete.length > 0) {
    await ebBookmarksDeleteSync({ keys: userBookmarksToDelete, all: true })
  }

  // Refresh the bookmarks lists
  await ebBookmarksCheckForBookmarks()
  ebBookmarksModalSetLoading(false)
}

export {
  ebBookmarksDeleteBookmark,
  ebBookmarksDeleteAllBookmarks
}
