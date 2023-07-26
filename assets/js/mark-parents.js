// Give a parent elements a class name based on its child
// ------------------------------------------------------
//
// Useful for targeting an element because it contains
// a given child element. Currently not possible with CSS,
// because CSS can't target an element's parent node.
//
// E.g. before, we cannot target this h2 just because
// it contains a .place:
//
// <h2>Rebels in Snow
//     <span class="place">(Hoth)</span>
// </h2>
//
// but, after this script runs, we get:
//
// <h2 class="place-parent">Rebels in Snow
//     <span class="place">(Hoth)</span>
// </h2>
//
// Set the child element's class at Options below.

// Options: use querySelectorAll strings, comma-separated
const ebMarkParentsOfTheseChildren = 'p > img:only-child'

// Promote
function ebMarkParent (child, prefix) {
  'use strict'

  // If the child has a classlist, copy those class names
  // to the parent with a '-parent' suffix. This creates elegant classnames.
  // Otherwise, add a class to the parent made from the selector we've used.
  if (child.classList.length > 0) {
    let i
    for (i = 0; i < child.classList.length; i += 1) {
      child.parentNode.classList.add(child.classList[i] + '-parent')
    }
  } else {
    child.parentNode.classList.add(prefix + '-parent')
  }
}

// Find the child elements we're after and, if we find any,
// loop through them to mark their parents.
function ebMarkParents (queryStrings) {
  'use strict'

  // Create an array of query strings and loop through it, so that
  // we can treat each query string separately. This lets us use each query
  // string as a fallback prefix for a parent-element class name.
  const queryArray = queryStrings.split(',')
  let i, query, children, prefix, j
  for (i = 0; i < queryArray.length; i += 1) {
    query = queryArray[i].trim()
    children = document.querySelectorAll(query)
    prefix = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '')

    if (children.length > 0) {
      for (j = 0; j < children.length; j += 1) {
        ebMarkParent(children[j], prefix)
      }
    }
  }
}

ebMarkParents(ebMarkParentsOfTheseChildren)
