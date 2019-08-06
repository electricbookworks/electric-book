/*jslint browser*/
/*globals window*/

console.log('Running heading-titles.js...');

// Give all headings title attributes (unless they already have one)
function ebHeadingTitles() {
    'use strict';
    var headings = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    var i;
    for (i = 0; i < headings.length; i += 1) {
        if (!headings[i].hasAttribute('title')) {
            headings[i].setAttribute('title', headings[i].textContent);
            console.log('Set title attribute on heading "' + headings[i].textContent + '"');
        } else {
            console.log('Heading "' + headings[i].textContent + '" already has title attribute.');
        }
    }
}
ebHeadingTitles();
