// Return the ID of a bookmarkable element
function ebBookmarksElementID (element) {
  // If we're bookmarking a specified element,
  // i.e. an element was passed to this function,
  // use its hash, otherwise use the first
  // visible element in the viewport.
  if (!element) {
    element = document.querySelector('[data-bookmark="onscreen"]') || document.body
  }
  if (element.id) {
    return element.id
  } else if (window.location.hash) {
    // If for some reason the element has no ID,
    // return the hash of the current window location.
    return window.location.hash
  } else {
    // And in desperation, use the first element
    // with an ID on the page.
    return document.querySelector('[id]').id
  }
}

export default ebBookmarksElementID
