/*jslint browser */
/*globals ebEmitEvent*/

// Setup tasks on pages

// Options
// -------
var ebElementsToGetIDs = '#content p:not([id]), #content li:not([id]), #content dt:not([id])';

// Assign IDs to text elements, e.g. for bookmarking
var ebIDsAssigned = false;
function ebAssignIDs() {
    'use strict';

    var elementsToID = document.querySelectorAll(ebElementsToGetIDs);
    var counter = 0;
    elementsToID.forEach(function (element) {
        element.id = 'id-' + counter;
        counter += 1;
    });
    // Set new status,e.g. for the accordion and bookmarking
    ebIDsAssigned = true;
}

// Assign IDs, then emit an event.
ebAssignIDs();
