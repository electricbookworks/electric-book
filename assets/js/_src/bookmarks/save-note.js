import ebUserSession from '../user-session'
import ebBookmarksHasApi from './has-api'
import ebBookmarksSessionDate from './session-date'

async function ebBookmarksSaveNote ({ bookmark, note }) {
  if ((await ebUserSession())?.ID && await ebBookmarksHasApi()) {
    await fetch('/api/bookmark/note/upsert/', {
      method: 'POST',
      body: JSON.stringify({
        note,
        id: bookmark.id,
        key: bookmark.key,
        sessionDate: ebBookmarksSessionDate()
      })
    })
  }
}

export default ebBookmarksSaveNote
