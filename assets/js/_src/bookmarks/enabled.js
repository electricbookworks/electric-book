/* globals Storage */

function ebBookmarksBrowserSupport () {
  return Object.prototype.hasOwnProperty.call(window, 'IntersectionObserver') &&
          window.getSelection &&
          window.getSelection().toString &&
          window.localStorage &&
          Storage !== undefined &&
          document.querySelector('.bookmarks') &&
          window.CustomEvent
}

function ebBookmarksEnabled () {
  const isReady = process.env.settings.web.bookmarks.enabled &&
                  document.body.getAttribute('data-ids-assigned') &&
                  document.body.getAttribute('data-fingerprints-assigned') &&
                  ebBookmarksBrowserSupport()
  const bookmarksUI = document.querySelector('.bookmarks')
  if (isReady && bookmarksUI) {
    bookmarksUI.classList.remove('visuallyhidden')
    return true
  }
  bookmarksUI && (bookmarksUI.style.display = 'none')
  return false
}

export default ebBookmarksEnabled
