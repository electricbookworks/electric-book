// https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/location
const baseUrl = self.location.origin;

self.importScripts("vendor/lodash.core.min.js");

var currentBookmarks = {};

onmessage = function (e) {
    console.debug('Bookmark worker: Message received from main script');

    const restApiBookmarksUrl = baseUrl + '/wp-json/ebt-bookmarks/v1/bookmarks'
    var newBookmarks = e.data;

    // no data passed to worker means we should fetch bookmarks from Wordpress
    if (!newBookmarks) {
        fetch(restApiBookmarksUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                currentBookmarks = data;

                // send message back to main thread i.e. bookmark-sync.js
                postMessage(currentBookmarks);
            })
            .catch((error) => {
                console.error('Bookmark worker: Get Error -', error);
            });
        
        return true;
    }

    if (!_.isEqual(currentBookmarks, newBookmarks)) {
        console.debug("Bookmark worker: Bookmarks changed, trying to sync")

        fetch(restApiBookmarksUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBookmarks),
        })
            .then(response => response.json())
            .then(data => {
                currentBookmarks = newBookmarks;
            })
            .catch((error) => {
                console.error('Bookmark worker: Update Error -', error);
            });
    }
}