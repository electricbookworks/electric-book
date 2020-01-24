/*jslint browser */
/*globals window, IntersectionObserver, locales, pageLanguage,
    ebSlugify */

// A script for managing a user's bookmarks


// Options
// --------------------------------------
// Which elements should we make bookmarkable?
// By default, paras and lists in the content area.
// Use querySelector strings.
var ebBookmarkableElements = '#content p, #content ul, #content ol, #content dl';

// Disable bookmarks on browsers that don't support
// what we need to provide them.
function ebBookmarkSupport() {
    'use strict';
    if (window.hasOwnProperty('IntersectionObserver')
            && window.localStorage
            && Storage !== 'undefined') {
        return true;
    } else {
        var bookmarking = document.querySelector('.bookmarks');
        bookmarking.style.display = 'none';
        return false;
    }
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

    // Clear the current list
    list.innerHTML = '';

    // Add all the bookmarks to it
    bookmarks.forEach(function (bookmark) {

        // Create list item
        var listItem = document.createElement('li');
        listItem.setAttribute('data-bookmark-name', bookmark.name);

        // Add link
        var link = document.createElement('a');
        link.href = bookmark.location;
        link.innerHTML = bookmark.bookTitle + ': ' + bookmark.description;
        listItem.appendChild(link);

        // Add the list item to the list
        list.appendChild(listItem);

        // Check if this bookmark is on the current page
        ebBookmarksCheckForCurrentPage(bookmark.location);
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

// Return the ID of a bookmarkable element
function ebBookMarkLocation(element) {
    'use strict';

    // If we're bookmarking a specified element,
    // i.e. an element was passed to this function,
    // use its hash, otherwise use the first
    // visible element in the viewport.
    if (!element) {
        element = document.querySelector('[data-bookmark="onscreen"]');
    }
    if (element.id) {
        return element.id;
    } else if (window.location.hash) {
        // If for some reason the element has no ID,
        // return the hash of the current window location.
        return window.location.hash;
    } else {
        // And in desperation, use the first element
        // with an ID on the page.
        return document.querySelector('[id]').id;
    }
}

// Remember bookmark
function ebSetBookmark(type, description, element) {
    'use strict';

    // Create a bookmark object
    var bookmark = {
        type: type,
        bookTitle: document.body.dataset.title,
        pageTitle: document.title,
        description: description,
        pageID: ebSlugify(window.location.href.split('#')[0]),
        location: window.location.href.split('#')[0] + '#' + ebBookMarkLocation(element)
    };

    // Set a bookmark named for its type only.
    // So there will only ever be one bookmark of each type saved.
    // To save more bookmarks, make the key more unique.
    // Note that the prefix 'bookmark-' is used in ebCheckForBookmarks().
    localStorage.setItem('bookmark-' + ebSlugify(bookmark.bookTitle) + '-' + bookmark.type, JSON.stringify(bookmark));

    // Refresh the bookmarks list
    ebCheckForBookmarks();
}

// Mark an element that has been user-bookmarked
function ebBookmarkMarkBookmarkedElement(element) {
    'use strict';

    // Remove any existing bookmarks
    var bookmarkedElements = document.querySelectorAll('[data-bookmarked]');
    bookmarkedElements.forEach(function (element) {
        element.removeAttribute('data-bookmarked');
    });

    // Set the new bookmark
    element.setAttribute('data-bookmarked', 'true');
}

// Listen for bookmark clicks
function ebBookmarksListenForClicks(button) {
    'use strict';
    button.addEventListener('click', function () {
        ebSetBookmark('userBookmark', locales[pageLanguage].bookmarks.bookmark, button.parentNode);
        ebBookmarkMarkBookmarkedElement(button.parentNode);
    });
}

// Add a bookmark button to bookmarkable elements
function ebBookmarkToggleButtonOnElement(element) {
    'use strict';

    // Get the main bookmark icon from the page,
    var icon = document.querySelector('.bookmark-icon');

    // If the element has no button, add one.
    if (!element.querySelector('button.bookmark-button')) {
        // Copy the icon SVG code to our new button.
        var button = document.createElement('button');
        button.classList.add('bookmark-button');
        button.innerHTML = icon.outerHTML;

        // Append the button
        element.appendChild(button);

        // Listen for clicks
        ebBookmarksListenForClicks(button);
    }
}

// Mark elements in the viewport so we can bookmark them
function ebBookMarkMarkVisibleElements(elements) {
    'use strict';

    var elementsWithIDs = Array.from(elements).filter(function (element) {
        return element.id !== 'undefined';
    });

    // If IntersectionObserver is supported, create one.
    // In the config, we set rootMargin slightly negative,
    // so that at least a meaningful portion of the element
    // is visible before it gets a bookmark icon.
    var ebBookmarkObserverConfig = {
        rootMargin: '-50px'
    };
    if (window.hasOwnProperty('IntersectionObserver')) {
        var bookmarkObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                // Count the elements we've marked 'on'
                if (entry.isIntersecting) {
                    entry.target.setAttribute('data-bookmark', 'onscreen');
                    ebBookmarkToggleButtonOnElement(entry.target);
                } else {
                    entry.target.setAttribute('data-bookmark', 'offscreen');
                    ebBookmarkToggleButtonOnElement(entry.target);
                }
            });
        }, ebBookmarkObserverConfig);

        // Observe each image
        elementsWithIDs.forEach(function (element) {
            bookmarkObserver.observe(element);
        });
    } else {
        // If the browser doesn't support IntersectionObserver,
        // maybe this will work -- largely untested code this.
        // Test and fix it if we need old IE support.
        var scrollTop = window.scrollTop;
        var windowHeight = window.offsetHeight;
        elementsWithIDs.forEach(function (element) {
            if (scrollTop <= element.offsetTop
                    && (element.offsetHeight + element.offsetTop) < (scrollTop + windowHeight)
                    && element.dataset['in-view'] === 'false') {
                element.target.setAttribute('data-bookmark', 'onscreen');
                ebBookmarkToggleButtonOnElement(element.target);
            } else {
                element.target.setAttribute('data-bookmark', 'offscreen');
                ebBookmarkToggleButtonOnElement(element.target);
            }
        });
    }
}

// The main process
function ebBookmarkProcess() {
    'use strict';

    // Store the last location when user leaves page
    window.addEventListener('beforeunload', function () {
        ebSetBookmark('lastLocation', locales[pageLanguage].bookmarks['last-location']);
    });

    // Mark which elements are available for bookmarking
    ebBookMarkMarkVisibleElements(document.querySelectorAll(ebBookmarkableElements));

    // Check for bookmarks
    ebCheckForBookmarks();

}

// Check for support before running the main process
if (ebBookmarkSupport()) {
    ebBookmarkProcess();
}
