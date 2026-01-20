async function ebBookmarksHasApi () {
  try {
    const bookmarkApi = await fetch('/api/bookmark/list/')
    return bookmarkApi.status !== 404
  } catch (error) {
    return false
  }
}

export default ebBookmarksHasApi
