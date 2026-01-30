import ebUserSession from '../user-session'
import ebBookmarksHasApi from './has-api'
import ebBookmarksSessionDate from './session-date'

let userSessionCache = null
let hasApiCache = null

async function ebBookmarksSaveNote ({ bookmark, note }) {
  const userSession = userSessionCache || await ebUserSession()
  userSessionCache = userSession
  const hasApi = hasApiCache || await ebBookmarksHasApi()
  hasApiCache = hasApi
  if (userSession?.ID && hasApi) {
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
