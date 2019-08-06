// For rotating figures:
// 1. Put the figure's contents in a div we can rotate
// 2. Let CSS rotate it

var figuresToRotate = document.querySelectorAll('.figure.rotate');

function rotate(figure) {
    'use strict';

    // Create a new rotating div
    var rotator = document.createElement('div');
    // Create a wrapper around that
    var rotatorWrapper = document.createElement('div');
    rotatorWrapper.appendChild(rotator);
    // Add the figure as its child
    rotator.appendChild(figure.cloneNode(true));
    // Replace the figure with the rotator wrapper,
    // which contains the rotator and figure.
    figure.parentNode.replaceChild(rotatorWrapper, figure);
    // Assign classes to the rotator and rotatorWrapper
    rotator.setAttribute('class', 'figure-rotator');
    rotatorWrapper.setAttribute('class', 'figure-rotator-wrapper');
}

function rotateGetFigures() {
    'use strict';

    var i;

    for (i = 0; i < figuresToRotate.length; i += 1) {
        rotate(figuresToRotate[i]);
    }
}

if (figuresToRotate.length > 0) {
    console.log('Found figures to rotate.');
    rotateGetFigures();
}
