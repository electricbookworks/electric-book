import ebBookmarksGetLocalStorage from './get-local-storage'
import ebUserSession from '../user-session'
import ebBookmarksHasApi from './has-api'

async function ebBookmarksFetch () {
  const bookmarks = ebBookmarksGetLocalStorage({ prefix: 'bookmark-', excludePrefix: 'bookmark-deleted' })
  let bookmarkNotes = []
  if (ebUserSession?.ID && ebBookmarksHasApi) {
    let bookmarkNoteResults = await fetch('/api/bookmark/note/list/')
    bookmarkNoteResults = await bookmarkNoteResults.json()
    bookmarkNotes = Array.isArray(bookmarkNoteResults?.results) ? bookmarkNoteResults.results : []
  }
  return { bookmarks, bookmarkNotes }
}

export default ebBookmarksFetch
