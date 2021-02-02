/* jslint browser */
/*globals window, ebSlugify, ebIndexTargets */

// Check the page for reference indexes.
// If we find any, look up each list item
// in the book-index-*.js, and add a link.

// Add a link to an entry
function ebIndexAddLink(listItem, filename, id, index) {
    'use strict';

    var link = document.createElement('a');
    link.href = filename + '#' + id;
    link.innerHTML = index;
    listItem.appendChild(link);
}

// Add a link for a specific entry
function ebIndexFindLinks(listItem) {
    'use strict';

    var currentTextFolder = window.location.href.replace(/text\/.+\.html/, 'text');
    var listItemText = listItem.innerHTML;

    // Look through the index of targets
    ebIndexTargets.forEach(function (pageEntries) {

        // Check if the entries for this page
        // are for files in the same text folder
        // as the book index we're populating with links.
        var pagePathTextFolder = pageEntries[0].path.replace(/text\/.+\.html/, 'text');

        if (currentTextFolder.includes(pagePathTextFolder)) {

            // Find this entry's page numbers
            var index = 1;
            pageEntries.forEach(function (entry) {

                if (entry.entrySlug === ebSlugify(listItemText)) {
                    ebIndexAddLink(listItem, entry.filename, entry.id, index);
                    index += 1;
                }
            });
        }
    });
}

// Get all the indexes and start processing them
function ebIndexPopulate() {
    'use strict';

    var indexLists = document.querySelectorAll('ul.reference-index');

    indexLists.forEach(function (indexList) {

        var listItems = indexList.querySelectorAll('li');

        listItems.forEach(function (listItem) {
            ebIndexFindLinks(listItem);
        });
    });
}

// Go
ebIndexPopulate();
