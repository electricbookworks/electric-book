/* global ActiveXObject, XMLHttpRequest */

// Utility functions

// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
function ebSlugify (string, indexTerm) {
  'use strict'

  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz-----'
  const p = new RegExp(a.split('').join('|'), 'g')

  if (indexTerm) {
    // For dynamic index terms, we want to take a different approach
    // to ensure unique ids
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, function (c) {
        return b.charAt(a.indexOf(c))
      }) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
      .replace(/-\\\\-/g, '--') // Replace \\ with --
      .replace(/[^\w-]+/g, '') // Remove all non-word characters
  }

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, function (c) {
      return b.charAt(a.indexOf(c))
    }) // Replace special characters
    .replace(/\//g, '-') // Replace any / with - (in non-index strings)
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

// Or get the language from a URL parameter
// https://stackoverflow.com/a/901144/1781075
// eslint-disable-next-line no-unused-vars
function ebGetParameterByName (name, url) {
  'use strict'
  if (!url) {
    url = window.location.href
  }
  name = name.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) {
    return null
  }
  if (!results[2]) {
    return ''
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// Check if a page exists
// (Thanks https://stackoverflow.com/a/22097991/1781075)
// eslint-disable-next-line no-unused-vars
function ebCheckForPage (url) {
  'use strict'
  let request
  let pageStatus = false
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest()
  } else {
    request = new ActiveXObject('Microsoft.XMLHTTP')
  }
  request.open('GET', url, false)
  request.send() // this will pause the page while we check for the response
  if (request.status === 404) {
    pageStatus = false
  } else {
    pageStatus = true
  }
  return pageStatus
}

// Check if an element has a particular computed style
function ebHasComputedStyle (element, property, value) {
  'use strict'
  const style = window.getComputedStyle(element)

  // If the element has the property, and no value is specified,
  // return true. If a value is specified, and it matches, return true.
  if (property && style[property]) {
    if (value) {
      if (style[property] === value) {
        return true
      }
    } else {
      return true
    }
  }
}

// Check if an element or its ancestors are position: relative.
// Useful when positioning an element absolutely.
// Returns the first relatively positioned parent.
// Effectively equivalent to HTMLElement.offsetParent,
// but returns false, not BODY, if no relative parent.
// eslint-disable-next-line no-unused-vars
function ebIsPositionRelative (element) {
  'use strict'

  if (ebHasComputedStyle(element, 'position', 'relative')) {
    return element
  } else {
    if (element.tagName !== 'BODY') {
      return ebIsPositionRelative(element.parentElement)
    } else {
      return false
    }
  }
}

// Check if an element or its ancestors are position: fixed.
// Returns the first fixed positioned parent.
function ebIsPositionFixed (element) {
  'use strict'

  if (ebHasComputedStyle(element, 'position', 'fixed')) {
    return element
  } else {
    if (element.tagName !== 'BODY') {
      return ebIsPositionFixed(element.parentElement)
    } else {
      return false
    }
  }
}

// Get the nearest preceding sibling or cousin element
// eslint-disable-next-line no-unused-vars
function ebNearestPrecedingSibling (element, tagName, iterationTrue) {
  'use strict'

  if (element) {
    // If this is our second pass, and the element matches, return it.
    if (iterationTrue && element.tagName === tagName) {
      return element

      // Otherwise, if the element's previous sibling matches, return it
    } else if (element.previousElementSibling &&
                element.previousElementSibling.tagName === tagName) {
      return element.previousElementSibling

      // Otherwise, check the previous element and then its parents' siblings' children
    } else {
      if (element.previousElementSibling) {
        return ebNearestPrecedingSibling(element.previousElementSibling, tagName, true)
      } else {
        if (element.parentNode && element.parentNode.previousElementSibling) {
          return ebNearestPrecedingSibling(element.parentNode.previousElementSibling.lastElementChild, tagName, true)
        } else {
          return false
        }
      }
    }
  } else {
    return false
  }
}

// A regex alternative to String.prototype.lastIndexOf().
// Inspired by https://stackoverflow.com/a/21420210/1781075
function ebLastIndexOfRegex (string, regex, fromIndex) {
  'use strict'

  if (fromIndex) {
    string = string.substring(0, fromIndex)
  }

  const match = string.match(regex)

  if (match) {
    return string.lastIndexOf(match[match.length - 1])
  } else {
    return -1
  }
}

// Get a truncated string without cutting a word
// eslint-disable-next-line no-unused-vars
function ebTruncatedString (string, characters, suffix) {
  'use strict'

  // If the string is longer than the allowed characters,
  // we'll do a careful job of truncating it neatly.
  if (string.length > characters) {
    // Get a truncated string
    let truncatedString = string.slice(0, characters)

    // Where is the last space in the truncated string?
    // We want to elide from that space to get a whole word.
    const indexOfLastSpace = ebLastIndexOfRegex(truncatedString, /\s/gi)
    const elideFrom = indexOfLastSpace
    truncatedString = truncatedString.slice(0, elideFrom)

    // We don't want certain punctuation marks at the
    // end of our nice, neat string. If the neatened, truncated string
    // ends in one of those characters, chop it off.
    const unwantedTrailingPunctuation = /[:;,]/
    if (truncatedString.slice(-1).match(unwantedTrailingPunctuation)) {
      truncatedString = truncatedString.slice(0, elideFrom - 1)
    }

    // If a suffix was passed to this functio (e.g. ' …')
    // add it to the end of the string.
    if (suffix) {
      truncatedString = truncatedString + suffix
    }

    return truncatedString
  } else {
    return string
  }
}

// Toggle clickable area for exiting a modal.
// The callback should be a function that toggles
// the visibility of the modal itself.
// It will be called on every click.
let ebCurrentModalZIndex
// eslint-disable-next-line no-unused-vars
function ebToggleClickout (modalElement, callback) {
  'use strict'

  let clickOut

  if (ebCurrentModalZIndex > 0) {
    ebCurrentModalZIndex += 1
  } else {
    ebCurrentModalZIndex = 1000
  }

  // If the clickout is present, and this modal
  // is visible (as opposed to another modal)
  if (document.getElementById('clickOut-' + modalElement.id) &&
            modalElement.getAttribute('data-modal-visible')) {
    // Don't set the z-index in the style attribute,
    // which should let stylesheets determine z-index again
    modalElement.style.zIndex = ''
    modalElement.setAttribute('data-modal-visible', false)

    // Remove the clickOut element
    clickOut = document.getElementById('clickOut-' + modalElement.id)
    clickOut.remove()

    if (callback) {
      callback()
    }
  } else {
    // Bring the modal to the front
    modalElement.style.zIndex = ebCurrentModalZIndex
    modalElement.setAttribute('data-modal-visible', true)

    // If the modal has a fixed position parent,
    // we also must set the z-index there, since it
    // creates a different stacking context that might
    // fall below our clickOut
    const fixedParent = ebIsPositionFixed(modalElement.parentElement)
    if (fixedParent) {
      fixedParent.style.zIndex = ebCurrentModalZIndex
    }

    // Add a clickOut element
    clickOut = document.createElement('div')
    clickOut.id = 'clickOut-' + modalElement.id
    clickOut.style.zIndex = ebCurrentModalZIndex - 1
    clickOut.style.position = 'fixed'
    clickOut.style.top = '0'
    clickOut.style.right = '0'
    clickOut.style.bottom = '0'
    clickOut.style.left = '0'
    clickOut.style.backgroundColor = 'black'
    clickOut.style.opacity = '0.2'
    document.body.insertAdjacentElement('beforeend', clickOut)

    if (callback) {
      callback()
    }
    // Clicking on the clickOut should remove it
    clickOut.addEventListener('click', function () {
      ebToggleClickout(modalElement)

      if (callback) {
        callback()
      }
    }, { once: true })
  }
}

// This lets us use a function from here in Node (e.g. gulp).
// This must only run in Node, hence the `window` check.
if (typeof window === 'undefined') {
  module.exports.ebSlugify = ebSlugify
}
