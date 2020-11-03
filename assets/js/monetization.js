/*jslint browser */
/*globals window, gtag */

// Use Google Analytics to users with monetization extension
function monetizationCounter() {
    'use strict';

    var bookTitle = locales.en.project.name;

    if (document.monetization) {
        if (typeof gtag === 'function') {
            gtag('event', 'select_content', {
                'event_category': 'Monetization',
                'event_label': 'Monetization' + bookTitle
            });
        }
    }
}