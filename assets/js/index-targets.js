/* global Prince, ebSlugify, NodeFilter */

// This script helps create dynamic book indexes.
// It finds all HTML comments that start with
// <!-- index or <!--index and parses each line,
// assuming each line represents an entry in the index.
// It then adds <a> targets to the start of the element
// that follows the comment, using slugs of the line.
// Comment lines that start or end with a hyphen
// start or end ranges of content that contain the
// ongoing presence of a given concept. Those targets
// take 'to' or 'from' classes, which are important
// for the separate process that generates hyperlinks
// in the final book index.

// Notes on development:
// To find comment nodes, TreeWalker is fastest.
// If the browser doesn't support TreeWalker, we iterate
// over the entire DOM ourselves, which is slower.

// This script is not used for PDF and epub outputs.
// PrinceXML does not 'see' HTML comments at all.
// So for PrinceXML output, we prerender the HTML with gulp/cheerio.
// In epub readers, the links don't work from the index
// because the targets would only exist when the target
// page is rendered. Browsers handle this fine, but not ereaders.
// So if you change this script, you may need to make similar
// changes to `renderIndexCommentsAsTargets` in gulpfile.js.

// Options
// -------
// Block-level elements are those tags that will be
// index targets for any index comment that appears
// immediately before them in the DOM. Any other elements
// not included in this list will not be targets.
// Rather, index targets will be inserted inside them
// where the index comment appears in the DOM.
// Note that element names must be uppercase here.
// (Note: our gulp equivalent uses a different logic
// that may be more reliable than this.)
// We include `script` tags so that MathJax blocks,
// which are in script tags, can also be considered
// when determining inline vs block-level index tags.
const ebIndexOptions = {
  blockLevelElements: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'P', 'BLOCKQUOTE', 'OL', 'UL', 'TABLE', 'DL', 'DIV', 'SCRIPT']
}

// Process the comments, inserting anchor-tag targets
// into the DOM, which we'll link to from the book index.
function ebIndexProcessComments (comments) {
  'use strict'

  // Create an array to store IDs, which we'll test
  // for uniqueness when we create anchor tags.
  const entries = []

  // If there are no comments, note that in the
  // `data-index-targets` attribute.
  if (comments.length < 1) {
    document.body.setAttribute('data-index-targets', 'none')
  }

  // Create a counter for tracking this process
  let commentCounter = 0

  // Process each comment in the `comments` array.
  comments.forEach(function (comment) {
    // Parse each line: add to an array called
    // `commentLines`, because each line in the comment
    // will be a separate index target.
    const commentLines = comment.commentText.split('\n')

    // Process each line, i.e. each index target in the comment.
    commentLines.forEach(function (line) {
      // Remove the opening 'index:' prefix.
      const indexKeywordRegex = /^\s*index:/
      if (indexKeywordRegex.test(line)) {
        line = line.replace(indexKeywordRegex, '')
      }

      // Strip white space at start and end of line.
      line = line.trim()

      // Exit if the stripped line is now empty.
      if (line === '') {
        return
      }

      // Split the line into its entry components.
      // It might be a nested entry, where each level
      // of nesting appears after double backslash \\.
      // e.g. software \\ book-production
      const rawEntriesByLevel = line.split('\\')

      // Trim whitespace from each entry
      // https://stackoverflow.com/a/41183617/1781075
      // and remove any leading or trailing hyphens.
      const entriesByLevel = rawEntriesByLevel.map(function (str) {
        return str.trim().replace(/^-+|-+$/, '')
      })

      // Check for starting or ending hyphens.
      // If one exists, flag it as `from` or `to`.
      // Then strip the hyphen.
      // Note, JS's `startsWith` and `endsWith` are not
      // supported in PrinceXML, so we didn't use those
      // in early dev. Prince output is now handled by
      // our alternative gulp/cheerio process. So, we could
      // use them now. But this code isn't broken, so doesn't
      // need fixing.
      let from = false
      let to = false

      if (line.substring(0, 1) === '-') {
        to = true
        line = line.substring(1)
      }
      if (line.substring(line.length - 1) === '-') {
        from = true
        line = line.substring(0, line.length - 1)
      }

      // Slugify the target text to use in an ID
      // and to check for duplicate instances later.
      // The second argument indicates that we are slugifying an index term.
      const entrySlug = ebSlugify(line, true)

      // Add the slug to the array of entries,
      // where will we count occurrences of this entry.
      entries.push(entrySlug)

      // Create an object that counts occurrences
      // of this entry on the page so far.
      const entryOccurrences = entries.reduce(function (allEntries, entry) {
        if (entry in allEntries) {
          allEntries[entry] += 1
        } else {
          allEntries[entry] = 1
        }
        return allEntries
      }, {})

      // Get the number of occurrences of this entry so far.
      const occurrencesSoFar = entryOccurrences[entrySlug]

      // Use that to add a unique index-ID suffix to the entry slug.
      const id = entrySlug + '--iid-' + occurrencesSoFar

      // Create a target for each line.
      // Note: we can't use one target element for several index entries,
      // because one element can't have multiple IDs.
      // And we don't try to link index entries to IDs of existing elements
      // because those elements' IDs could change, and sometimes
      // we want our target at a specific point inline in a textnode.

      // Create a target element to link to from the index.
      const target = document.createElement('a')
      target.id = id
      target.classList.add('index-target')
      target.setAttribute('data-index-entry', entriesByLevel.slice(-1).pop())
      target.setAttribute('data-index-markup', line)

      // If this target starts or ends an indexed range,
      // add the relevant class.
      if (to) {
        target.classList.add('index-target-to')
      }
      if (from) {
        target.classList.add('index-target-from')
      }

      // Set a string that we'll use for the target below.
      // It's easiest to use `outerHTML` for this,
      // but PrinceXML doesn't support `outerHTML`, so
      // if this script ever runs in PrinceXML we have to use
      // `innerHTML`, putting the target in a temporary container.
      // This could be refactored now that we handle Prince
      // output in pre-processing with gulp/cheerio.
      let targetElementString = ''
      if (typeof Prince === 'object') {
        // Prince requires that the element contain a string
        // in order for the target to be present at all in the DOM.
        // So we give it a zero-width space character and keep it
        // out of the flow with position: absolute.
        target.innerHTML = '​' // contains zero-width space character
        target.style.position = 'absolute'

        const temporaryContainer = document.createElement('span')
        temporaryContainer.appendChild(target)
        targetElementString = temporaryContainer.innerHTML
      } else {
        targetElementString = target.outerHTML
      }

      // If the comment is between elements (e.g. between two paras)
      // then we insert the target as the first child of the next element.
      // (Look out for CSS problems caused by this. You may need CSS tweaks.)
      // Otherwise, if it's *inline* between two text nodes, we insert
      // the target exactly where it appears between those text nodes.
      // This way, a target can appear at any exact point in the text.

      if (comment.targetType === 'inline') {
        const positionOfTarget = comment.element.innerHTML.indexOf(comment.targetText)
        const newInnerHTML = comment.element.innerHTML.slice(0, positionOfTarget) +
                        targetElementString +
                        comment.element.innerHTML.slice(positionOfTarget)
        comment.element.innerHTML = newInnerHTML
      } else {
        comment.element.insertBefore(target, comment.element.firstChild)
      }
    })

    // Add this comment to the counter
    commentCounter += 1

    // Add an attribute to flag that we're done.
    if (commentCounter === comments.length) {
      document.body.setAttribute('data-index-targets', 'loaded')
    }
  })
}

// Get all the comments and add them to an array.
function ebIndexGetComments () {
  'use strict'

  const comments = []

  let indexedElement, commentValue, previousElementSibling,
    nextElementSibling, nextSibling, targetType, targetText

  // Regex for testing if a comment is an indexing comment
  const isAnIndexComment = /^\s*index:/

  // Check for TreeWalker support.
  const useTreeWalker = true // debugging option
  if (document.createTreeWalker && useTreeWalker) {
    // https://www.bennadel.com/blog/2607-finding-html-comment-nodes-in-the-dom-using-treewalker.htm
    // By default, the TreeWalker will show all of the matching DOM nodes that it
    // finds. However, we can use an optional 'filter' method that will inform the
    // DOM traversal.
    function filter (node) {
      if (node.nodeValue === ' Load scripts. ') {
        return (NodeFilter.FILTER_SKIP)
      }
      return (NodeFilter.FILTER_ACCEPT)
    }

    // IE and other browsers differ in how the filter method is passed into the
    // TreeWalker. Mozilla takes an object with an 'acceptNode' key. IE takes the
    // filter method directly. To work around this difference, we will define the
    // acceptNode function a property of itself.
    filter.acceptNode = filter

    // NOTE: The last argument [] is a deprecated, optional parameter. However, in
    // IE, the argument is not optional and therefore must be included.
    const treeWalker = document.createTreeWalker(
      document.querySelector('.content'),
      NodeFilter.SHOW_COMMENT,
      filter,
      false
    )

    while (treeWalker.nextNode()) {
      if (isAnIndexComment.test(treeWalker.currentNode.nodeValue)) {
        nextSibling = treeWalker.currentNode.nextSibling
        previousElementSibling = treeWalker.currentNode.previousElementSibling
        nextElementSibling = treeWalker.currentNode.nextElementSibling

        // If the previous or next sibling elements of the comment
        // are elements, then this comment contains index entries
        // that should point to the start of the next element.

        // If the next sibling node is a text node, and
        // it actually contains text (isn't just space),
        // then we know that the index target must be inline, i.e.
        // inside a text element like a paragraph.

        if (previousElementSibling !== null &&
                        nextElementSibling !== null &&
                        ebIndexOptions.blockLevelElements.includes(previousElementSibling.tagName) &&
                        ebIndexOptions.blockLevelElements.includes(nextElementSibling.tagName)) {
          indexedElement = treeWalker.currentNode.nextElementSibling
          targetType = 'element'
          targetText = ''
        } else {
          indexedElement = treeWalker.currentNode.parentElement
          targetType = 'inline'
          targetText = nextSibling.nodeValue
        }

        commentValue = treeWalker.currentNode.nodeValue

        // Note: do not use ES6 Object Property Shorthand,
        // it is not supported by Prince. Hence eslint-disable-line here.
        comments.push({
          commentText: commentValue,
          element: indexedElement,
          targetText: targetText, // eslint-disable-line
          targetType: targetType // eslint-disable-line
        })
      }
    }
  } else {
    function lookForComments (thisNode) {
      // Polyfill for IE < 9
      if (!Node) { // eslint-disable-line
        var Node = {} // eslint-disable-line
      }
      if (!Node.COMMENT_NODE) {
        Node.COMMENT_NODE = 8
      }

      for (thisNode = thisNode.firstChild; thisNode; thisNode = thisNode.nextSibling) {
        // If it's a comment node and it is not just whitespace
        if (thisNode.nodeType === Node.COMMENT_NODE &&
                        isAnIndexComment.test(thisNode.nodeValue)) {
          nextSibling = thisNode.nextSibling
          previousElementSibling = thisNode.previousElementSibling
          nextElementSibling = thisNode.nextElementSibling

          if (previousElementSibling !== null &&
                            nextElementSibling !== null &&
                            ebIndexOptions.blockLevelElements.includes(previousElementSibling.tagName) &&
                            ebIndexOptions.blockLevelElements.includes(nextElementSibling.tagName)) {
            indexedElement = thisNode.nextElementSibling
            targetType = 'element'
            targetText = ''
          } else {
            indexedElement = thisNode.parentElement
            targetType = 'inline'
            targetText = nextSibling.nodeValue
          }

          commentValue = thisNode.nodeValue

          // Note: do not use ES6 Object Property Shorthand,
          // it is not supported by Prince. Hence eslint-disable-line here.
          comments.push({
            commentText: commentValue,
            element: indexedElement,
            targetText: targetText, // eslint-disable-line
            targetType: targetType // eslint-disable-line
          })
        } else {
          lookForComments(thisNode)
        }
      }
    }
    lookForComments(document.body)
  }

  ebIndexProcessComments(comments)
}

// Triage before processing comments.
function ebIndexInit () {
  'use strict'

  // Don't run this if the targets are already loaded
  // (e.g. by pre-processing)
  if (document.querySelector('[data-index-targets]')) {
    return
  }

  ebIndexGetComments()
}

// Go
ebIndexInit()
