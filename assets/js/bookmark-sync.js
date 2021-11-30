/*jslint browser */
/*globals window, settings */

function ebBookmarkWordpressIsLoggedIn() {
    return true;
    // core session cookie set
    return (document.cookie.indexOf('coreproject_sess') !== -1);
}

function ebBookmarkSyncInit() {
    // Check if logged into wordpress and web worker compatibility, 
    // if either is false we do not enable bookmark syncing
    if (!ebBookmarkWordpressIsLoggedIn() || !window.Worker) {
        return false;
    }

    // Create the service worker that syncs bookmarks in the background
    const workerScriptUrl = settings.site.baseurl + "/assets/js/bookmark-sync-worker.js";
    const worker = new Worker(workerScriptUrl);

    if (!sessionStorage.getItem("ebt-bookmarks-synced")) {
        var storageBookmarks = ebBookmarkFetchFromLocalStorage();

        // Ask web worker to fetch bookmarks saved in Wordpress.
        ebBookmarkFetchFromWorker(worker);

        worker.onmessage = function (e) {
            console.debug('Message received from bookmark worker');
            let wpBookmarks = e.data;

            // Merge the bookmarks with storage taking priority
            let mergedBookmarks = { ...wpBookmarks, ...storageBookmarks };

            // If what we have in localstorage does not match our merged we need to update localstorage
            if (!_.isEqual(storageBookmarks, mergedBookmarks)) {
                // Clear localstorage bookmarks and reset with new merged values.
                ebBookmarksDeleteAllBookmarks();
                Object.entries(mergedBookmarks).forEach(([key, value]) => {
                    localStorage.setItem(key, JSON.stringify(value));
                });
            }
        }

        // Refresh booksmarks for user 
        ebBookmarksCheckForBookmarks();

        // Set session variable to indicate that we've already fetched bookmarks from wordpress
        sessionStorage.setItem("ebt-bookmarks-synced", true);
    }

    // Overload the storage setItem and removeItem functions
    ebBookmarkOverloadStorageFunctions(worker);

}

function ebBookmarkFetchFromWorker(worker) {
    worker.postMessage(null);
}

function ebBookmarkPostToWorker(worker) {
    // Get all bookmark items in local storage
    let bookmarks = ebBookmarkFetchFromLocalStorage();

    if (bookmarks) {
        worker.postMessage(bookmarks);
    }
}

function ebBookmarkFetchFromLocalStorage() {
    var bookmarks = {};

    Object.keys(localStorage)
        .filter(function (key) {
            return key.startsWith("bookmark");
        })
        .map(function (key) {
            bookmarks[key] = JSON.parse(localStorage.getItem(key));
        });

    return bookmarks;
}

function ebBookmarkOverloadStorageFunctions(worker) {
    // Store the function we are overloading so that we can still call it.
    const _setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
        // Call the original function.
        _setItem.apply(this, arguments);

        if (
            this === window.localStorage && 
            key.startsWith("bookmark") &&
            sessionStorage.getItem("ebt-bookmarks-synced")
        ) {
            console.debug("Sending to worker");
            // If we are setting a bookmark value on localstorage we ask 
            // the web worker to push all bookmarks to wordpress for storage.
            ebBookmarkPostToWorker(worker);
        }
    };

    // The same process as above, for removing items from storage.
    const _removeItem = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (key, value) {
        _removeItem.apply(this, arguments);

        if (
            this === window.localStorage && 
            key.startsWith("bookmark") &&
            sessionStorage.getItem("ebt-bookmarks-synced")
        ) {
            ebBookmarkPostToWorker(worker);
        }
    };
}

if (settings.web.bookmarks.enabled && settings.web.bookmarks.synchronise) {
    window.onload = ebBookmarkSyncInit();
}
