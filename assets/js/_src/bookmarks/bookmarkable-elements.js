// Which elements should we make bookmarkable?
function ebBookmarkableElements () {
  // Include anything in .content with an ID...
  let bookmarkableElements = document.querySelectorAll(process.env.settings.web.bookmarks.elements.include)
  // ... but exclude elements with data-bookmarkable="no",
  // or whose ancestors have data-bookmarkable="no",
  // or who are MathJax elements
  // or are footnote references
  // or those specified in settings.web.bookmarks.elements.exclude
  // (We also check for '[data-bookmarkable="no"]' there,
  // bacause settings.web.bookmarks.elements.exclude may be empty.)
  bookmarkableElements = Array.from(bookmarkableElements).filter(function (element) {
    let status
    if (element.getAttribute('data-bookmarkable') !== 'no' &&
                !element.closest('[data-bookmarkable="no"]') &&
                !element.id.startsWith('MathJax-') &&
                !element.id.startsWith('fnref:') &&
                !element.matches('[data-bookmarkable="no"]', process.env.settings.web.bookmarks.elements.exclude)) {
      status = true
    }
    return status
  })

  return bookmarkableElements
}

export default ebBookmarkableElements
