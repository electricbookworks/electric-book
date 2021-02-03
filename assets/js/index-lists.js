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

    var currentTitle = document.body.getAttribute('data-title');
    var currentTranslation = document.body.getAttribute('data-translation');
    var listItemText = listItem.innerHTML;

    // Look through the index of targets
    ebIndexTargets.forEach(function (pageEntries) {

        // Check if the entries for this page
        // are for files in the same book.
        // We just check against the first entry for the page.
        var titleMatches = false;
        var languageMatches = false;
        if (currentTitle === pageEntries[0].bookTitle) {
            titleMatches = true;
        }
        // Note, both of these could be null,
        // if this is not a translation.
        if (currentTranslation === pageEntries[0].translationLanguage) {
            languageMatches = true;
        }

        if (titleMatches && languageMatches) {

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
