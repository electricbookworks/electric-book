// Check if bookmark is on the current page
function ebBookmarksCheckForCurrentPage (url) {
  const pageURL = window.location.href.split('#')[0]
  const bookmarkURL = url.split('#')[0]
  return pageURL === bookmarkURL
}

export default ebBookmarksCheckForCurrentPage
