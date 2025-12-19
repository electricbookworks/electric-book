const bookmarkApi = await fetch('/api/bookmark/list/')
const ebBookmarksHasApi = bookmarkApi.status !== 404

export default ebBookmarksHasApi
