/* global localStorage */
import ebBookmarksCanSync from './can-sync'

async function ebBookmarksSave (bookmark) {
  localStorage.setItem(bookmark.key, JSON.stringify(bookmark))
  const canSync = await ebBookmarksCanSync()
  if (canSync.canSync) {
    await fetch('/api/bookmark/upsert/', {
      method: 'POST',
      body: JSON.stringify(bookmark)
    })
  }
}

export default ebBookmarksSave
