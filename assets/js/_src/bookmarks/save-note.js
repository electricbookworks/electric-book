import ebUserSession from '../user-session'
import ebBookmarksCheckForBookmarks from './check-for-bookmarks'
import ebBookmarksHasApi from './has-api'

async function ebBookmarksSaveNote ({ bookmark, note }) {
  if (ebUserSession?.ID && ebBookmarksHasApi) {
    await fetch('/api/bookmark/note/upsert/', {
      method: 'POST',
      body: JSON.stringify({
        note,
        id: bookmark.id,
        key: bookmark.key
      })
    })
    ebBookmarksCheckForBookmarks()
  }
}

export default ebBookmarksSaveNote
