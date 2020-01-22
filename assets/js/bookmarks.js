/*jslint browser */
/*globals window, locales, pageLanguage,
    ebSlugify, ebGetParameterByName */

// A script for managing a user's bookmarks

// Remove scroll parameter from URL
function ebBookMarkRemoveScrollParameter(url) {
    'use strict';
    var hrefWithoutScrollParameter = url.replace(/[\?&]scroll=[^&]+/, '').replace(/^&/, '?');
    return hrefWithoutScrollParameter;
}

// Remember bookmark
function ebSetBookmark(name, description) {
    'use strict';

    // Create a bookmark object
    var bookmark = {
        type: 'bookmark',
        name: name,
        title: document.title,
        description: description,
        pageID: ebSlugify(ebBookMarkRemoveScrollParameter(window.location.href)),
        location: window.location,
        scrollPosition: window.pageYOffset || document.documentElement.scrollTop
    };
    localStorage.setItem(bookmark.type + '-' + bookmark.pageID, JSON.stringify(bookmark));
}

// Check if bookmark is on the current page
function ebBookmarksCheckForCurrentPage(url) {
    'use strict';
    var pageURL = window.location.href;
    var pageURLWithoutHashAndQueries = pageURL.split(/[?#]/)[0];

    if (url.includes(pageURLWithoutHashAndQueries)) {
        return true;
    }
}

// List bookmarks for user
function ebListBookmarks(bookmarks) {
    'use strict';

    // Get the bookmarks list
    var list = document.querySelector('.bookmarks-list');

    // Add all the bookmarks to it
    bookmarks.forEach(function (bookmark) {

        // Remove any existing ?scroll= parameter
        // from the bookmark URL, so that we can update that
        var hrefWithoutScrollParameter = ebBookMarkRemoveScrollParameter(bookmark.location.href);

        // Create list item
        var listItem = document.createElement('li');
        listItem.setAttribute('data-bookmark-name', bookmark.name);

        // Add link
        var link = document.createElement('a');
        link.href = hrefWithoutScrollParameter + '?scroll=' + bookmark.scrollPosition;
        link.innerHTML = bookmark.title + ': ' + bookmark.description;
        listItem.appendChild(link);

        // Add the list item to the list
        list.appendChild(listItem);

        // Check if this bookmark is on the current page
        ebBookmarksCheckForCurrentPage(bookmark.location.href);
    });
}

// Check if a page has bookmarks
function ebCheckForBookmarks() {
    'use strict';

    // Create an empty array to write to
    // when we read the localStorage bookmarks strings
    var bookmarks = [];
    Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith('bookmark-')) {
            bookmarks.push(JSON.parse(localStorage.getItem(key)));
        }
    });

    // List them for the user
    ebListBookmarks(bookmarks);
}

// Store the last location when user leaves page
window.addEventListener('beforeunload', function () {
    'use strict';
    ebSetBookmark('lastLocation', locales[pageLanguage].bookmarks['last-location']);
});

// Scroll to scrollPosition if query string includes ?scroll
function ebBookmarkScrollToPosition() {
    'use strict';
    var scrollParameter = ebGetParameterByName('scroll', window.location.href);

    // Convert the string to an integer
    // and scroll there if it's not zero.
    var scrollPosition = Number(scrollParameter);
    if (Number.isInteger(scrollPosition) && scrollPosition > 0) {
        window.scrollTo(0, scrollPosition);
    }
}

// Listen for clicks on bookmarks,
// which is necessary when we're using a bookmark link
// to go to our previous place on a page, rather than
// navigating to a different page.
function ebBookmarksListenForClicks() {
    'use strict';
    var bookmarksList = document.querySelector('.bookmarks-list');
    bookmarksList.addEventListener('click', function (event) {
        if (ebBookmarksCheckForCurrentPage(event.target.href) === true) {
            event.preventDefault();
            ebBookmarkScrollToPosition();
        }
    });
}




// Check for bookmarks
ebCheckForBookmarks();

// Scroll if URLs contain scroll positions
ebBookmarkScrollToPosition();

// Listen for clicks on internal bookmark links
ebBookmarksListenForClicks();
