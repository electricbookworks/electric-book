/*jslint browser */

function ebShareButtons() {
    'use strict';

    var shareButtons = document.querySelectorAll('.share-button');

    if (shareButtons) {
        shareButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var shareModal = button.parentNode.querySelector('.share-links');
                var buttonIcon = button.querySelector('svg');
                shareModal.classList.toggle('visuallyhidden');
                buttonIcon.classList.toggle('active');
            });
        });
    }
}

// Go
ebShareButtons();
