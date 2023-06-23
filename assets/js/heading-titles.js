// Give all headings title attributes (unless they already have one)
function ebHeadingTitles () {
  'use strict'
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let i
  for (i = 0; i < headings.length; i += 1) {
    if (!headings[i].hasAttribute('title')) {
      headings[i].setAttribute('title', headings[i].textContent)
    }
  }
}
ebHeadingTitles()
