// Let JS Lint allow window global variable
/*global window */

// This script shows and hide the annotation sidebar
// and the annotations in the page text.

// Options
var annotationOptions = {
    highlightsColor: '#eee'
};

// Get the elements we need
var openSidebarToggle = document.querySelector('#annotator-toggle-sidebar');
var showAnnotationsToggle = document.querySelector('#annotator-show-annotations');

// Turn highlighting on
function showAnnotationHighlights() {
    'use strict';
    var css = '.annotator-hl{background-color:' + annotationOptions.highlightsColor + '}';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'annotation-styles';

    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);
}

// Turn highlighting off
function hideAnnotationHighlights() {
    'use strict';
    if (document.querySelector('#annotation-styles')) {
        document.querySelector('#annotation-styles').remove();
    }
}

// Open sidebar
function annotatorOpenSidebar() {
    'use strict';
    openSidebarToggle.checked = true;
}

// Close sidebar
function annotatorCloseSidebar() {
    'use strict';
    openSidebarToggle.checked = false;
}

// Listen for checkbox toggle. This function takes three arguments:
// target: the checkbox to listen on,
// on: the function if it's checked,
// off: the function if it's not checked.
function annotatorListenForToggle(target, on, off) {
    'use strict';
    if (target) {
        target.addEventListener('change', function () {
            if (this.checked) {
                on();
            } else {
                off();
            }
        });
    }
}

// Listen for clicks
function annotatorListenForClick(target, action) {
    'use strict';
    if (target) {
        console.log('listening?');
        target.addEventListener('click', function () {
            console.log('heard something');
            action();
        });
    }
}

// Start
window.onload = function () {
    'use strict';

    // Get the annotator button
    // Todo: On Chrome this is in a shadowRoot. Can't get at it this way.
    var annotatorTool = document.querySelector('.js-annotate-btn');

    annotatorListenForToggle(openSidebarToggle, annotatorOpenSidebar, annotatorCloseSidebar);
    annotatorListenForToggle(showAnnotationsToggle, showAnnotationHighlights, hideAnnotationHighlights);
    annotatorListenForClick(annotatorTool, annotatorOpenSidebar);
};
