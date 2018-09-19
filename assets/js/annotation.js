// highlighting must check toggle and highlight checkboxes


// check whether highlights are showing

// toggle highlights on

// open sidebar

// listen for toggle on annotation-toggle

// listen for toggle
function listenForToggle(target) {
    'use strict';
    if (target) {
        target.addEventListener('change', function () {
            if (this.checked) {
                console.log(target + ' is checked');
            } else {
                console.log(target + ' is not checked');
            }
        });
    }
}

// get the checkboxes
var showSidebarToggle = document.querySelector('#annotator-toggle-sidebar');
var showAnnotationsToggle = document.querySelector('#annotator-show-annotations');

// process
listenForToggle(showSidebarToggle);
listenForToggle(showAnnotationsToggle);
