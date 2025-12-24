/* global sessionStorage */

// Generate and store an index of fingerprints and IDs.
function ebBookmarksCreateFingerprintIndex () {
  const indexOfBookmarks = {}
  const fingerprintedElements = document.querySelectorAll('[data-fingerprint]')
  fingerprintedElements.forEach(function (element) {
    const elementFingerprint = element.getAttribute('data-fingerprint')
    const elementID = element.id
    indexOfBookmarks[elementFingerprint] = elementID
  })
  sessionStorage.setItem('index-of-bookmarks', JSON.stringify(indexOfBookmarks))
}

export default ebBookmarksCreateFingerprintIndex
