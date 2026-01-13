let ebBookmarksHasApi

try {
  const bookmarkApi = await fetch('/api/bookmark/list/')
  ebBookmarksHasApi = bookmarkApi.status !== 404
} catch (error) {
  ebBookmarksHasApi = false
}

export default ebBookmarksHasApi
