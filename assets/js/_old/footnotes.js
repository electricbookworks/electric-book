/* eslint no-var: off */

// The above comment is necessary because Prince 11
// can't use let and const, as Standard JS would prefer.

// Move footnote text to the bottoms of pages by moving them
// from the end of the document (where kramdown gathers them)
// to a container div beside their in-text references.

// A counter for footnote references created one-by-one,
// rather than for an entire page or books.
var manualFootnoteCounter = 1

function ebFootnotesToMove (wrapper) {
  'use strict'

  // If there are any footnotes ...
  if (wrapper.querySelector('.footnotes')) {
    // ... and if the page-footnotes setting is on,
    // or at least on for one of the footnotes
    if (wrapper.hasAttribute('data-page-footnotes') ||
        wrapper.querySelector('.footnotes .move-to-footnote')) {
      // ... then return true
      return true
    }
  }
}

function ebMoveEndnoteToFootnote (noteReference) {
  'use strict'

  // Get the footnote ID
  var footnoteReferenceID = noteReference.hash

  // NOTE: Prince's .hash behaviour is unusual: it strips the # out.
  // So, let's use getElementById instead of querySelector.
  // If it starts with a hash, chop it out.
  if (footnoteReferenceID.indexOf('#') === 0) {
    footnoteReferenceID = footnoteReferenceID.replace('#', '')
  }

  // Find the li with the ID from the .footnote's href
  var endnote = document.getElementById(footnoteReferenceID)

  // Check that we should actually process this footnote.
  // If the data-page-footnotes setting isn't applied to this doc...
  var wrapper = noteReference.closest('.wrapper')
  if (!wrapper.hasAttribute('data-page-footnotes')) {
    // ...check whether this particular footnote should be moved.
    if (!endnote.querySelector('.move-to-footnote')) {
      endnote.classList.add('endnote-text')
      noteReference.classList.add('endnote-reference')
      return
    }
  }

  // Make a div.page-footnote
  var pageFootnote = document.createElement('div')
  pageFootnote.classList.add('page-footnote')
  pageFootnote.id = footnoteReferenceID

  // Add and increment the manual-footnote counter
  if (endnote.querySelector('.move-to-footnote')) {
    pageFootnote.setAttribute('page-footnote-counter', manualFootnoteCounter)
    manualFootnoteCounter += 1
  }

  // Get the sup that contains the footnoteReference a.footnote
  var footnoteReferenceContainer = noteReference.parentNode

  // Get the element that contains the footnote reference
  var containingElement = noteReference.parentNode.parentNode

  // and add a class to it.
  containingElement.parentNode.className += ' contains-footnote'

  // Move the endnote contents inside the div.page-footnote
  pageFootnote.innerHTML = endnote.innerHTML

  // Insert the new .page-footnote at the reference.
  // Technically, before the <sup> that contains the reference <a>.
  // We have to use insertBefore because Prince borks at insertAdjacentElement.
  containingElement.insertBefore(pageFootnote, footnoteReferenceContainer)

  // Remove the old endnote, and the old reference to it
  // (Prince creates new references to page-footnotes)
  endnote.parentNode.removeChild(endnote)
  footnoteReferenceContainer.parentNode.removeChild(footnoteReferenceContainer)
}

function ebFootnotesRenumberEndnotes () {
  'use strict'

  // Get all the endnote lists in the doc
  var endNoteLists = document.querySelectorAll('div.footnotes ol')

  // For each list, update the endnote numbers
  endNoteLists.forEach(function (list) {
    var endnoteListItems = list.querySelectorAll('li.endnote-text')

    // If we moved any notes to on-page footnotes with .move-to-footnote,
    // and we still have a list of endnotes, then we must renumber the endnote
    // references, because now the reference numbers will not match the
    // auto-numbered list of endnotes.
    // Note that the endnote *references* might be repeated (e.g. two places
    // in the text that refer to the same endnote).

    var i
    for (i = 0; i < endnoteListItems.length; i += 1) {
      var endnoteNewNumber = i + 1
      var endnoteOldID = endnoteListItems[i].id
      var endnoteNewID = endnoteOldID.replace(/fn:\d+$/, 'fn:' + endnoteNewNumber)
      var endnoteReferences = document.querySelectorAll('[href="#' + endnoteOldID + '"]')

      // Update all the endnote references that refer to the old number
      endnoteReferences.forEach(function (reference) {
        reference.innerHTML = endnoteNewNumber
        reference.hash = endnoteNewID
      })

      // Update the IDs of the endnotes sequentially
      endnoteListItems[i].id = endnoteListItems[i].id.replace(/fn:\d+$/, 'fn:' + endnoteNewNumber)
    }
  })
}

function ebEndnotesToFootnotes (wrapper) {
  'use strict'

  // Get all the a.footnote links we want to move
  var footnoteReferences = wrapper.querySelectorAll('.footnote')

  // Process all those footnotes
  var i
  for (i = 0; i < footnoteReferences.length; i += 1) {
    ebMoveEndnoteToFootnote(footnoteReferences[i])

    if (i === footnoteReferences.length - 1) {
      console.log('On-page footnotes moved. Now to renumber endnotes ...')
      ebFootnotesRenumberEndnotes()
    }
  }
}

// If there are footnotes to move, move them.
function ebFootnotesForPDF () {
  'use strict'

  var wrappers = document.querySelectorAll('.wrapper')

  wrappers.forEach(function (wrapper) {
    if (ebFootnotesToMove(wrapper)) {
      console.log('We have endnotes to move to page footnotes ...')
      ebEndnotesToFootnotes(wrapper)
    }
  })
}

// Go
ebFootnotesForPDF()
