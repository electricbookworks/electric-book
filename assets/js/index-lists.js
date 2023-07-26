/* global ebSlugify, ebIndexTargets */

// Check the page for reference indexes.
// If we find any, look up each list item
// in the book-index-*.js, and add a link.

// Add a link to a specific reference-index entry
function ebIndexAddLink (listItem, pageReferenceSequenceNumber, entry) {
  'use strict'

  const link = document.createElement('a')
  link.href = entry.filename + '#' + entry.id
  link.innerHTML = pageReferenceSequenceNumber

  // If the listItem has child lists, insert the link
  // before the first one. Otherwise, append the link.
  if (listItem.querySelector('ul')) {
    listItem.insertBefore(link, listItem.querySelector('ul'))
  } else {
    listItem.appendChild(link)
  }

  // Add a class to flag whether this link starts
  // or ends a reference range.
  if (entry.range === 'from' || entry.range === 'to') {
    link.classList.add('index-range-' + entry.range)
  } else {
    link.classList.add('index-range-none')
  }
}

// Look up an entry's anchor targets to link to
function ebIndexFindLinks (listItem) {
  'use strict'

  // We're already looping through all `li`s`, even descendants.
  // For each one, contruct its tree from its parent nodes.
  // When we look up this entry in the db, we'll compare
  // the constructed tree with the one stored in the index 'database'.
  const listItemTree = []

  // If a list item has a parent list item, add its
  // text value to the beginning of the tree array.
  // Iterate up the tree to add each possible parent.

  // Get the text value of an li without its li children
  function getListItemText (li) {
    const listItemClone = li.cloneNode(true)
    listItemClone.querySelectorAll('li').forEach(function (childListItem) {
      childListItem.remove()
    })

    // If page refs have already been added to the li,
    // we don't want those in the text. They appear after
    // a line break, so we regex everything from that \n.
    const text = listItemClone.textContent.trim().replace(/\n.*/, '')
    return text
  }

  listItemTree.push(getListItemText(listItem))

  function buildTree (listItem) {
    if (listItem.parentElement &&
                listItem.parentElement.closest('li')) {
      listItemTree.unshift(getListItemText(listItem.parentElement.closest('li')))
      buildTree(listItem.parentElement.closest('li'))
    }
  }
  buildTree(listItem)

  // Reconstruct the reference's text value from the tree
  // and save its slug. The second argument indicates that we are slugifying
  // an index term.
  const listItemSlug = ebSlugify(listItemTree.join(' \\ '), true)

  // Get the book title and translation language (if any)
  // for the HTML page we're processing.
  const currentBookTitle = document.querySelector('.wrapper').dataset.title
  const currentTranslation = document.querySelector('.wrapper').dataset.translation

  // Look through the index 'database' of targets
  // Each child in the ebIndexTargets array represents
  // the index anchor targets on one HTML page.

  // Set this counter here, so that links are numbered
  // sequentially across target HTML files
  // (e.g. if a range spans two HTML files)
  let pageReferenceSequenceNumber = 1

  ebIndexTargets.forEach(function (pageEntries) {
    // First, check if the entries for this page
    // of entries are for files in the same book.
    // We just check against the first entry for the page.
    let titleMatches = false
    let languageMatches = false
    if (currentBookTitle === pageEntries[0].bookTitle) {
      titleMatches = true
    }
    // Note, both of these could be null,
    // if this is not a translation.
    // (Note we're being lazy here, so this code might need work.
    // Technically one could be undefined and the other null.
    // The gulp alternative in `renderIndexListReferences` has better logic.)
    if (currentTranslation === pageEntries[0].translationLanguage) {
      languageMatches = true
    }

    if (titleMatches && languageMatches) {
      // Find this entry's page numbers
      let rangeOpen = false
      pageEntries.forEach(function (entry) {
        if (entry.entrySlug === listItemSlug) {
          // If a 'from' link has started a reference range, skip
          // adding links till the next 'to' link that closes the range.
          if (entry.range === 'from') {
            rangeOpen = true
            ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry)
            pageReferenceSequenceNumber += 1
          }
          if (rangeOpen) {
            if (entry.range === 'to') {
              ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry)
              pageReferenceSequenceNumber += 1
              rangeOpen = false
            }
          } else {
            ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry)
            pageReferenceSequenceNumber += 1
          }
        }
      })
    }
  })
}

// Get all the indexes on the page, and start processing them.
function ebIndexPopulate () {
  'use strict'

  // Don't do this if the list links are already loaded.
  // This prevents us doing this work if the page has been
  // pre-processed. E.g. by gulp during PDF or epub output.
  if (document.body.getAttribute('data-index-list') === 'loaded') {
    return
  }

  const indexLists = document.querySelectorAll('.reference-index')
  let indexListsProcessed = 0

  indexLists.forEach(function (indexList) {
    const listItems = indexList.querySelectorAll('li')

    listItems.forEach(function (listItem) {
      ebIndexFindLinks(listItem)
    })

    // Flag when we're done
    if (indexListsProcessed === indexLists.length ||
                indexLists.length === 1) {
      document.body.setAttribute('data-index-list', 'loaded')
    }
    indexListsProcessed += 1
  })
}

// Go
ebIndexPopulate()
