/* global fetch, localStorage */
import ebUserSession from '../user-session'
import ebBookmarksGetLocalStorage from './get-local-storage'
import ebBookmarksHasApi from './has-api'
import ebBookmarksSessionDate from './session-date'
import ebBookmarksCheckForBookmarks from './check-for-bookmarks'
import ebBookmarksSelect from './select'
import ebBookmarksModal, { ebBookmarksModalSetLoading, ebBookmarksModalToggleSetLoading } from './modal'
import ebBookmarksCreateFingerprintIndex from './create-fingerprint-index'

// Decoupled subscription to sync, to avoid subsequent script blocking on page load
document.addEventListener('bookmarksSyncComplete', async (event) => {
  /* Debugging info
  const { firstLoad, success, synced, deletedFromServer, deletedFromLocal, syncedFromServer, syncedToServer, error } = event.detail
  if (success) {
    if (synced) {
      console.log(`Bookmarks sync completed: ${syncedFromServer} from server, ${syncedToServer} to server, ${deletedFromServer} deleted from server, ${deletedFromLocal} deleted from local.`)
    } else {
      console.log('Bookmarks sync skipped (user not logged in or no API).')
    }
  } else {
    console.error('Bookmarks Sync failed:', error)
  }
  */
  if (event.detail.firstLoad) {
    ebBookmarksSessionDate()
    ebBookmarksCreateFingerprintIndex()
    ebBookmarksModal()
    ebBookmarksSelect()
    ebBookmarksCheckForBookmarks()
  } else {
    await ebBookmarksCheckForBookmarks()
  }
  ebBookmarksModalToggleSetLoading(false)
  ebBookmarksModalSetLoading(false)
})

const ebBookmarksSync = async ({ firstLoad = false } = {}) => {
  firstLoad && ebBookmarksModalToggleSetLoading(true)
  ebBookmarksModalSetLoading(true)

  const syncResult = {
    firstLoad,
    success: false,
    synced: false,
    deletedFromServer: 0,
    deletedFromLocal: 0,
    syncedFromServer: 0,
    syncedToServer: 0,
    error: null
  }

  try {
    if (ebUserSession?.ID && ebBookmarksHasApi) {
      // Clean up deleted bookmarks first
      const bookmarkDeletedLocal = JSON.parse(localStorage.getItem('bookmark-deleted')) || []
      let bookmarkDeletedServer = await fetch('/api/bookmark/deleted/')
      bookmarkDeletedServer = await bookmarkDeletedServer.json()
      bookmarkDeletedServer = Array.isArray(bookmarkDeletedServer?.keys) ? [...bookmarkDeletedServer.keys] : []

      if (bookmarkDeletedServer.length > 0) {
        // Remove deleted bookmarks from localStorage
        bookmarkDeletedServer.forEach(function (key) {
          localStorage.removeItem(key)
        })
        syncResult.deletedFromServer = bookmarkDeletedServer.length
      }

      if (bookmarkDeletedLocal.length > 0) {
        // Delete locally deleted bookmarks off server
        await fetch('/api/bookmark/delete/', {
          method: 'POST',
          body: JSON.stringify({ keys: bookmarkDeletedLocal })
        })
        localStorage.removeItem('bookmark-deleted')
        syncResult.deletedFromLocal = bookmarkDeletedLocal.length
      }

      // Get cleaned list of bookmarks from server
      let bookmarkResults = await fetch('/api/bookmark/list/')
      bookmarkResults = await bookmarkResults.json()
      const bookmarks = Array.isArray(bookmarkResults?.results) ? bookmarkResults.results : []

      // Add server bookmarks to localStorage
      bookmarks.forEach(bookmark => {
        localStorage.setItem(bookmark.key, JSON.stringify(bookmark))
      })
      syncResult.syncedFromServer = bookmarks.length

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
        syncResult.syncedToServer = bookmarksNotOnServer.length
      }

      syncResult.success = true
      syncResult.synced = true
    } else {
      syncResult.success = true
      syncResult.synced = false
    }
  } catch (error) {
    syncResult.error = error.message || 'Unknown sync error'
  } finally {
    // Emit bookmark sync completion event
    const syncEvent = new CustomEvent('bookmarksSyncComplete', {
      detail: syncResult
    })
    document.dispatchEvent(syncEvent)
  }
}

export default ebBookmarksSync
