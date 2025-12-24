/* global localStorage */
import ebUserSession from '../user-session'
import ebBookmarksHasApi from './has-api'

async function ebBookmarksSave (bookmark) {
  localStorage.setItem(bookmark.key, JSON.stringify(bookmark))
  ebUserSession?.ID && ebBookmarksHasApi && await fetch('/api/bookmark/upsert/', {
    method: 'POST',
    body: JSON.stringify(bookmark)
  })
}

export default ebBookmarksSave
