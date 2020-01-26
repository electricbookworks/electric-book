/*jslint browser */
/*globals ebEmitEvent*/

// Setup tasks on pages

// Assign IDs to text elements, e.g. for bookmarking
function ebAssignIDs(callback) {
    'use strict';

    var elementsToID = document.querySelectorAll('#content p:not([id]), #content ol:not([id]), #content ul:not([id]), #content dl:not([id])');
    var counter = 0;
    elementsToID.forEach(function (element) {
        element.id = 'id-' + counter;
        counter += 1;
    });
    callback();
}

// Assign IDs, then emit an event,
// e.g. for the accordion and bookmarking.
ebAssignIDs(function () {
    'use strict';
    ebEmitEvent('idsAssigned', document.body);
});
