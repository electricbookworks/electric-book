/*jslint browser */
/*globals window, console */

// A script for managing a user's bookmarks

console.log('Debugging bookmarks...');

function ebBookmarksRememberLastLocation() {
    'use strict';

    var location = {
        url: window.location,
        scrollPosition: window.pageYOffset || document.documentElement.scrollTop
    };
    localStorage.setItem(window.location + 'location', JSON.stringify(location)); 
}
window.addEventListener('beforeunload', function () {
    'use strict';
    ebBookmarksRememberLastLocation();
});
