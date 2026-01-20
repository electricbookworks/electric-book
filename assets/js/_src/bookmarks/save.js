/* global localStorage */
import ebUserSession from '../user-session'
import ebBookmarksHasApi from './has-api'

async function ebBookmarksSave (bookmark) {
  localStorage.setItem(bookmark.key, JSON.stringify(bookmark))
  await ebUserSession()?.ID && await ebBookmarksHasApi() && await fetch('/api/bookmark/upsert/', {
    method: 'POST',
    body: JSON.stringify(bookmark)
  })
}

export default ebBookmarksSave
