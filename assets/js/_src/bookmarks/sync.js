/* global fetch, localStorage */
import ebUserSession from '../user-session'
import ebBookmarksGetLocalStorage from './get-local-storage'
import ebBookmarksHasApi from './has-api'

const ebBookmarksSync = async () => {
  if (ebUserSession?.ID && ebBookmarksHasApi) {
    let bookmarkResults = []
    let bookmarkDeletedResults = []
    let bookmarks = []
    let bookmarkDeleted = JSON.parse(localStorage.getItem('bookmark-deleted')) || []

    // Clean up deleted bookmarks first
    bookmarkDeletedResults = await fetch('/api/bookmark/deleted/')
    bookmarkDeletedResults = await bookmarkDeletedResults.json()
    bookmarkDeleted = Array.isArray(bookmarkDeletedResults?.keys) ? [...new Set([...bookmarkDeleted, ...bookmarkDeletedResults.keys])] : []

    if (bookmarkDeleted.length > 0) {
      // Remove deleted bookmarks from localStorage
      bookmarkDeleted.forEach(function (key) {
        localStorage.removeItem(key)
      })
      // Delete locally deleted bookmarks from server
      await fetch('/api/bookmark/delete/', {
        method: 'POST',
        body: JSON.stringify({ keys: bookmarkDeleted })
      })
    }

    // Get cleaned list of bookmarks from server
    bookmarkResults = await fetch('/api/bookmark/list/')
    bookmarkResults = await bookmarkResults.json()
    bookmarks = Array.isArray(bookmarkResults?.results) ? bookmarkResults.results : []

    // Add server bookmarks to localStorage
    bookmarks.forEach(bookmark => {
      localStorage.setItem(bookmark.key, JSON.stringify(bookmark))
    })

    // Check for any local bookmarks not on the server and sync them
    const localBookmarks = ebBookmarksGetLocalStorage({ prefix: 'bookmark-', excludePrefix: 'bookmark-deleted', excludeType: 'lastLocation' })
    const bookmarksNotOnServer = []
    localBookmarks.forEach(localBookmark => {
      const match = bookmarks.find(bookmark => bookmark.key === localBookmark.key)
      !match && bookmarksNotOnServer.push(localBookmark)
    })
    if (bookmarksNotOnServer.length > 0) {
      await fetch('/api/bookmark/upsert/batch/', {
        method: 'POST',
        body: JSON.stringify({
          bookmarks: bookmarksNotOnServer
        })
      })
    }
  }
}

export default ebBookmarksSync
