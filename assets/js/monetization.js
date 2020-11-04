/*jslint browser */
/*globals window, gtag */

// Use Google Analytics to users with monetization extension
function monetizationCounter() {
    'use strict';

    var bookTitle = locales['en']['project']['name'];

    console.log(bookTitle);

    if (document.monetization) {
    	console.log('monetization is go');
        if (typeof gtag === 'function') {
        	console.log('gtag is go');
            gtag('event', 'monetization_on', {
                'event_category': 'Monetization',
                'event_label': 'Monetization: ' + bookTitle,
                'non_interaction': true
            });
        }
    }
}

setTimeout(monetizationCounter, 10000);