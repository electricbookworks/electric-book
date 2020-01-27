/*jslint browser */
/*globals ebEmitEvent*/

// Setup tasks on pages

var ebIDsAssigned = false;

// Assign IDs to text elements, e.g. for bookmarking
function ebAssignIDs() {
    'use strict';

    var elementsToID = document.querySelectorAll('#content p:not([id]), #content ol:not([id]), #content ul:not([id]), #content dl:not([id])');
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
