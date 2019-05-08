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


// Options: use a querySelector string
var ebMarkParentsOfTheseChildren = '.lb-reference';

// Promote
function ebMarkParent(child) {
    'use strict';

    // Add a '-parent' class to the child element's parent element
    var i;
    for (i = 0; i < child.classList.length; i += 1) {
        child.parentNode.classList.add(child.classList[i] + '-parent');
    }
}

// Loop through the child elements
function ebMarkParents(query) {
    'use strict';
    var children = document.querySelectorAll(query);
    var i;
    for (i = 0; i < children.length; i += 1) {
        ebMarkParent(children[i]);
    }
}

ebMarkParents(ebMarkParentsOfTheseChildren);
