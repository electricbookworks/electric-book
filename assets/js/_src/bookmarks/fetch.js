import ebBookmarksGetLocalStorage from './get-local-storage'
import ebBookmarksCanSync from './can-sync'

async function ebBookmarksFetch () {
  const bookmarks = ebBookmarksGetLocalStorage({ prefix: 'bookmark-', excludePrefix: 'bookmark-deleted' })
  let bookmarkNotes = []
  const canSync = await ebBookmarksCanSync()
  if (canSync.canSync) {
    let bookmarkNoteResults = await fetch('/api/bookmark/note/list/')
    bookmarkNoteResults = await bookmarkNoteResults.json()
    bookmarkNotes = Array.isArray(bookmarkNoteResults?.results) ? bookmarkNoteResults.results : []
  }
  return { bookmarks, bookmarkNotes }
}

export default ebBookmarksFetch
