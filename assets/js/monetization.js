/*jslint browser */
/*globals window, gtag */

// Use Google Analytics to users with monetization extension
function monetizationCounter() {
    'use strict';

    var fs = require('fs');

    var bookTitle = locales['en']['project']['name'];

    console.log(bookTitle);

    if (document.monetization) {
        // When a user with monetization visits a page, we want to check whether
        // this is the first page they are viewing in this session

        repeatVisit = sessionStorage.getItem('repeatVisit');
        console.log('repeatVisit: ' + repeatVisit);

        // If this is the first page view in the session
        if (repeatVisit !== 'true') {
            sessionStorage.setItem('repeatVisit', 'true')
            console.log('repeatVisit: ' + repeatVisit);

            // We log information when it is the first page
            var timestamp = new Date();
            var logString = bookTitle + ' : ' +  timestamp.toUTCString();

            console.log(logString);

            fs.appendFile("../../monetization-counter.txt", logString, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                }
            });
        }
    }
}

setTimeout(monetizationCounter, 10000);