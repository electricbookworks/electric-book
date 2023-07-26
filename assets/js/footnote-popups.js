/* global locales, pageLanguage */

function ebFootnotePopups () {
  'use strict'

  // List the features we use
  const featuresSupported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== 'undefined' &&
            window.addEventListener !== 'undefined' &&
            !!Array.prototype.forEach

  // Get all the .footnote s
  const footnoteLinks = document.querySelectorAll('.footnote')

  // Early exit for unsupported or if there are no footnotes
  if (!featuresSupported || footnoteLinks.length === 0) {
    return
  }

  // Loop through footnotes
  footnoteLinks.forEach(function (current) {
    // Get the target ID
    const targetHash = current.hash
    const targetID = current.hash.replace('#', '')

    // Escape it with double backslashes, for querySelector
    const sanitisedTargetHash = targetHash.replace(':', '\\:')

    // Find the li with the ID from the .footnote's href
    const targetReference = document.querySelector(sanitisedTargetHash)

    // Make a div.reference
    const footnoteContainer = document.createElement('div')
    footnoteContainer.classList.add('footnote-detail')
    footnoteContainer.classList.add('visuallyhidden')
    footnoteContainer.setAttribute('data-bookmarkable', 'no')
    footnoteContainer.id = 'inline-' + targetID

    // The a, up to the sup
    const theSup = current.parentNode
    const theContainingElement = current.parentNode.parentNode

    // Add the reference div to the sup
    // (Technically, this creates invalid HTML because a sup
    // should not contain a div. But this is necessary to
    // position the popup under the sup, and no worse than
    // making the popup a span that contains a p.)
    theSup.appendChild(footnoteContainer)

    // Move the li contents inside the div.reference
    footnoteContainer.innerHTML = targetReference.innerHTML

    // Show on hover
    // Note: 'click' event does not work here.
    theSup.addEventListener('mouseup', function (ev) {
      // If this is indeed a footnote, show the
      // footnote-detail container.
      if (ev.target.classList.contains('footnote')) {
        footnoteContainer.classList.remove('visuallyhidden')
      }
    })

    // Add a class to the parent
    theContainingElement.parentNode.classList.add('contains-footnote')

    // Clicking on the reverseFootnote link closes the footnote
    const reverseFootnote = footnoteContainer.querySelector('.reversefootnote')

    // Remove the contents since we're using
    // CSS and :before to show a close button marker
    reverseFootnote.innerText = ''

    // Add hidden link text for screen readers
    const closeFootnoteLabel = document.createElement('span')
    closeFootnoteLabel.classList.add('visuallyhidden')
    closeFootnoteLabel.innerText = locales[pageLanguage].footnotes['close-footnote']
    reverseFootnote.appendChild(closeFootnoteLabel)

    reverseFootnote.addEventListener('click', function (ev) {
      ev.preventDefault()
      footnoteContainer.classList.add('visuallyhidden')
    })

    // Remove the href to avoiding jumping down the page
    current.removeAttribute('href')
  })
  // Format the footnotes at the bottom of the page
  const footnoteItems = document.querySelectorAll('.footnotes a.reversefootnote')
  const reverseFootnoteAlt = locales[pageLanguage].footnotes['reversefootnote-alt']

  function reverseFootnoteSVGElement () {
    const reversefootnoteArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    reversefootnoteArrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    reversefootnoteArrow.setAttribute('viewBox', '0 0 28 15')
    reversefootnoteArrow.setAttribute('width', '28')
    reversefootnoteArrow.setAttribute('height', '25')
    reversefootnoteArrow.setAttribute('class', 'reverse-footnote-arrow')
    reversefootnoteArrow.innerHTML = '<title>' + reverseFootnoteAlt + '</title><path d="M2.69 14L8.6 8.09V13h10.28A4.21 4.21 0 0022 11.7a4.24 4.24 0 001.28-3.1A4.24 4.24 0 0022 5.5a4.21 4.21 0 00-3.11-1.29h-.33v-2h.33a6.14 6.14 0 014.54 1.88 6.17 6.17 0 011.86 4.51 6.17 6.17 0 01-1.87 4.53A6.14 6.14 0 0118.88 15H8.6v4.9z" fill="gray"/>'
    return reversefootnoteArrow
  }

  footnoteItems.forEach(function (reverseFootnoteLink) {
    reverseFootnoteLink.innerHTML = ''
    reverseFootnoteLink.appendChild(reverseFootnoteSVGElement())
  })
}

ebFootnotePopups()
