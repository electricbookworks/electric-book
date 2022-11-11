/*jslint browser*/
/*globals window */

// Shits an element up or down the DOM.
// Designed to run in PDF outputs only.

function ebPreviousElement(element) {
    'use strict';
    do {
        element = element.previousElementSibling;
    } while (element && element.nodeType !== 1);
    return element;
}

function ebNextElement(element) {
    'use strict';
    do {
        element = element.nextElementSibling;
    } while (element && element.nodeType !== 1);
    return element;
}

function ebShiftNumber(element, direction) {
    'use strict';

    // How many shifts? If the shift number is not specified
    // (i.e. class is just 'shift-up'), assume one-element shift.
    var shiftNumber;
    if (element.className.indexOf('shift-' + direction + '-') !== -1) {
        var search = new RegExp('shift-' + direction + '-(\\d+)', 'g');
        var result = search.exec(element.className);
        if (result[1]) {
            shiftNumber = result[1];
        }
    } else {
        shiftNumber = 1;
    }
    return shiftNumber;
}

function ebShiftUp(element) {
    'use strict';

    var shiftNumber = ebShiftNumber(element, 'up');

    var i, previous;
    for (i = 0; i < shiftNumber; i += 1) {
        previous = ebPreviousElement(element);
        if (previous) {
            element.parentNode.insertBefore(element, previous);
        }
    }
}

function ebShiftDown(element) {
    'use strict';

    var shiftNumber = ebShiftNumber(element, 'down');

    var i, next;
    for (i = 0; i < shiftNumber; i += 1) {
        next = ebNextElement(element);
        if (next) {
            element.parentNode.insertBefore(element, next.nextElementSibling);
        }
    }
}

window.onload = function () {
    'use strict';

    console.log('Checking for elements to shift...');

    var elementsToShiftUp = document.querySelectorAll('[class*="shift-up"]');
    var i;
    for (i = 0; i < elementsToShiftUp.length; i += 1) {
        ebShiftUp(elementsToShiftUp[i]);
    }

    var elementsToShiftDown = document.querySelectorAll('[class*="shift-down"]');
    var j;
    for (j = 0; j < elementsToShiftDown.length; j += 1) {
        ebShiftDown(elementsToShiftDown[j]);
    }
};
