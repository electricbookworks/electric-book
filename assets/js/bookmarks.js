/*jslint browser */
/*globals window, IntersectionObserver, locales, pageLanguage,
    ebSlugify, ebIDsAssigned */

// A script for managing a user's bookmarks

// TODO
// 1. Scope ids to children of #content, to limit misplaced
//    bookmarks after content updates
// 2. [DONE] To fix last-location behaviour, only show lastLocation of *previous* session:
//    - create a session ID and store in sessionStorage
//    - save lastLocation as session ID
//    - show user most recent lastLocation whose session ID is *not* in sessionStorage
// 3. Apply new click-for-modal bookmark UX.
// 4. Allow multiple user bookmarks.

// Options
// --------------------------------------
// Which elements should we make bookmarkable?
// By default, anything in #content with an ID.
// Use querySelector strings.
var ebBookmarkableElements = '#content p[id], #content li[id], #content dd[id]';

// Disable bookmarks on browsers that don't support
// what we need to provide them.
function ebBookmarksSupport() {
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

// Create a session ID
function ebBookmarksSessionDate() {
    'use strict';
    // If a sessionDate has been set,
    // return the current sessionDate
    if (sessionStorage.getItem('sessionDate')) {
        return sessionStorage.getItem('sessionDate');
    } else {
        // create, set and return the session ID
        var sessionDate = Date.now();
        sessionStorage.setItem('sessionDate', sessionDate);
        return sessionDate;
    }
}

// Clean up last locations of a title
function ebBookmarksCleanLastLocations(bookTitleToClean) {
    'use strict';
    var lastLocations = [];

    // Loop through stored bookmarks and add them to the array.
    Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith('bookmark-') && key.includes('-lastLocation-')) {
            var bookmarkBookTitle = JSON.parse(localStorage.getItem(key)).bookTitle;
            if (bookTitleToClean === bookmarkBookTitle) {
                lastLocations.push(JSON.parse(localStorage.getItem(key)));
            }
        }
    });

    // Only keep the last two elements:
    // the previous session's lastLocation, and this session's one
    lastLocations = lastLocations.slice(Math.max(lastLocations.length - 2, 0));

    // Sort the lastLocations ascending by the number in their sessionDate
    lastLocations.sort(function (a, b) {
        return parseFloat(a.sessionDate) - parseFloat(b.sessionDate);
    });

    // Get the number of lastLocations that are not the current session
    var previousSessionLocations = lastLocations.filter(function (location) {
        if (location.sessionDate !== ebBookmarksSessionDate()) {
            return true;
        }
    }).length;
    // If there are more than one, drop the first of the lastLocations
    if (previousSessionLocations > 1) {
        lastLocations.splice(0, 1);
    }

    // Remove all localStorage entries for this title except those in lastLocations
    Object.keys(localStorage).forEach(function (key) {

        // Assume we'll discard this item unless it's in lastLocations
        var matches = 0;

        if (key.startsWith('bookmark-') && key.includes('-lastLocation-')) {
            var bookmarkBookTitle = JSON.parse(localStorage.getItem(key)).bookTitle;
            if (bookTitleToClean === bookmarkBookTitle) {
                lastLocations.forEach(function (lastLocation) {
                    if (key.includes(lastLocation.sessionDate)) {
                        matches += 1;
                    }
                });
                if (matches === 0) {
                    localStorage.removeItem(key);
                }
            }
        }
    });
}

// Check if bookmark is on the current page
function ebBookmarksCheckForCurrentPage(url) {
    'use strict';

    var pageURL = window.location.href.split('#')[0];
    var bookmarkURL = url.split('#')[0];

    if (pageURL === bookmarkURL) {
        return true;
    }
}

// Mark bookmarks in the document
function ebBookmarksMarkBookmarks(bookmarks) {
    'use strict';
    bookmarks.forEach(function (bookmark) {
        var elementToMark = document.getElementById(bookmark.id);

        // If this bookmark is on the current page,
        // mark the relevant bookmarked element.
        if (ebBookmarksCheckForCurrentPage(bookmark.location)) {
            elementToMark.setAttribute('data-bookmarked', 'true');
            elementToMark.setAttribute('data-bookmark-type', bookmark.type);
            elementToMark.setAttribute('title', bookmark.description);
            ebBookmarksToggleButtonOnElement(elementToMark);
        }
    });
}

// List bookmarks for user
function ebBookmarksListBookmarks(bookmarks) {
    'use strict';

    // Get the bookmarks list
    var list = document.querySelector('.bookmarks-list');

    // Get the icons
    var bookmarkIcon = document.querySelector('.bookmark-icon');
    var historyIcon = document.querySelector('.history-icon');

    // Clear the current list
    list.innerHTML = '';

    // Add all the bookmarks to it
    bookmarks.forEach(function (bookmark) {

        // Clean last locations
        ebBookmarksCleanLastLocations(bookmark.bookTitle);

        // If lastLocation and it's the same session, then
        // quit, because we only want the previous session's last location
        if (bookmark.type === 'lastLocation'
                && bookmark.sessionDate === ebBookmarksSessionDate()) {
            return;
        }

        // Create list item
        var listItem = document.createElement('li');
        listItem.setAttribute('data-bookmark-type', bookmark.type);

        // Add link
        var link = document.createElement('a');
        link.href = bookmark.location;
        link.innerHTML = bookmark.bookTitle;
        listItem.appendChild(link);

        // Add the relevant icon
        var icon;
        if (bookmark.type === 'lastLocation') {
            icon = historyIcon.outerHTML;
        } else {
            icon = bookmarkIcon.outerHTML;
        }
        listItem.innerHTML += icon;

        // Add the list item to the list
        list.appendChild(listItem);
    });
}

// Check if a page has bookmarks
function ebBookmarksCheckForBookmarks() {
    'use strict';

    // Create an empty array to write to
    // when we read the localStorage bookmarks strings
    var bookmarks = [];

    // Loop through stored bookmarks and clean out old ones.
    Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith('bookmark-')) {
            var entry = JSON.parse(localStorage.getItem(key));
            var title = entry.bookTitle;
            ebBookmarksCleanLastLocations(title);
        }
    });

    // Now loop through the remaining stored bookmarks and add them to the array.
    Object.keys(localStorage).forEach(function (key) {
        if (key.startsWith('bookmark-')) {
            bookmarks.push(JSON.parse(localStorage.getItem(key)));
        }
    });

    // Mark them in the document
    ebBookmarksMarkBookmarks(bookmarks);

    // List them for the user
    ebBookmarksListBookmarks(bookmarks);
}

// Return the ID of a bookmarkable element
function ebBookmarksElementID(element) {
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
function ebBookmarksSetBookmark(type, description, element) {
    'use strict';

    // Create a bookmark object
    var bookmark = {
        sessionDate: ebBookmarksSessionDate(),
        type: type,
        bookTitle: document.body.dataset.title,
        pageTitle: document.title,
        description: description,
        id: ebBookmarksElementID(element),
        location: window.location.href.split('#')[0] + '#' + ebBookmarksElementID(element)
    };

    // Set a bookmark named for its type only.
    // So there will only ever be one bookmark of each type saved.
    // To save more bookmarks, make the key more unique.
    // Note that the prefix 'bookmark-' is used in ebBookmarksCheckForBookmarks().
    var bookmarkKey;
    if (bookmark.type === 'lastLocation') {
        bookmarkKey = 'bookmark-'
                + ebSlugify(bookmark.bookTitle)
                + '-'
                + bookmark.type
                + '-'
                + ebBookmarksSessionDate();
    } else {
        bookmarkKey = 'bookmark-'
                + ebSlugify(bookmark.bookTitle)
                + '-'
                + bookmark.type;
    }
    localStorage.setItem(bookmarkKey, JSON.stringify(bookmark));

    // Refresh the bookmarks list
    ebBookmarksCheckForBookmarks();
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
        ebBookmarksSetBookmark('userBookmark', locales[pageLanguage].bookmarks.bookmark, button.parentNode);
        ebBookmarkMarkBookmarkedElement(button.parentNode);
    });
}

// Add a bookmark button to bookmarkable elements
function ebBookmarksToggleButtonOnElement(element) {
    'use strict';

    // Get the main bookmark icons from the page,
    var bookmarkIcon = document.querySelector('.bookmark-icon');
    var historyIcon = document.querySelector('.history-icon');

    // If the element has no button, add one.
    if (!element.querySelector('button.bookmark-button')) {
        // Copy the icon SVG code to our new button.
        var button = document.createElement('button');
        button.classList.add('bookmark-button');

        // Set icon based on bookmark type
        var bookmarkType = element.getAttribute('data-bookmark-type');
        if (bookmarkType === 'lastLocation') {
            button.innerHTML = historyIcon.outerHTML;
        } else {
            button.innerHTML = bookmarkIcon.outerHTML;
        }

        // Append the button
        element.appendChild(button);

        // Listen for clicks
        ebBookmarksListenForClicks(button);
    }
}

// Mark elements in the viewport so we can bookmark them
function ebBookmarksMarkVisibleElements(elements) {
    'use strict';

    // Ensure we only use elements with IDs
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
                if (entry.isIntersecting) {
                    entry.target.setAttribute('data-bookmark', 'onscreen');
                } else {
                    entry.target.setAttribute('data-bookmark', 'offscreen');
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
                ebBookmarksToggleButtonOnElement(element.target);
            } else {
                element.target.setAttribute('data-bookmark', 'offscreen');
                ebBookmarksToggleButtonOnElement(element.target);
            }
        });
    }
}

// Listen for clicks and show bookmark button
function ebBookmarksAddButtonOnSelect(elements) {
    'use strict';
    elements.forEach(function (element) {
        element.addEventListener('click', function (event) {
            // Toggle the button on the element, currentTarget,
            // (not necessarily the clicked element, which might be a child).
            ebBookmarksToggleButtonOnElement(event.currentTarget);
        });
    });
}

// The main process
function ebBookmarksProcess() {
    'use strict';

    // Set the sessionDate
    ebBookmarksSessionDate();

    // Show the bookmarks controls
    var bookmarksControls = document.querySelector('.bookmarks');
    bookmarksControls.classList.remove('visuallyhidden');

    // Store the last location when user leaves page
    window.addEventListener('beforeunload', function () {
        ebBookmarksSetBookmark('lastLocation', locales[pageLanguage].bookmarks['last-location']);
    });

    // Mark which elements are available for bookmarking
    ebBookmarksMarkVisibleElements(document.querySelectorAll(ebBookmarkableElements));
    ebBookmarksAddButtonOnSelect(document.querySelectorAll(ebBookmarkableElements));

    // Check for bookmarks
    ebBookmarksCheckForBookmarks();

}

// Start bookmarking
function ebBookmarksInit() {
    'use strict';
    // Check for support before running the main process
    if (ebBookmarksSupport()) {
        ebBookmarksProcess();
    }
}

// Load the bookmarks when IDs have been assigned
var ebBookmarksCheckForIDs = window.setInterval(function () {
    'use strict';
    if (ebIDsAssigned === true) {
        ebBookmarksInit();
        clearInterval(ebBookmarksCheckForIDs);
    }
}, 500);
