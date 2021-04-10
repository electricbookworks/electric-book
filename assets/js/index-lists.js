/* jslint browser */
/*globals window, ebSlugify, ebIndexTargets */

// Check the page for reference indexes.
// If we find any, look up each list item
// in the book-index-*.js, and add a link.

// Add a link to an entry
function ebIndexAddLink(listItem, filename, id, range, pageReferenceSequenceNumber) {
    'use strict';

    var link = document.createElement('a');
    link.href = filename + '#' + id;
    link.innerHTML = pageReferenceSequenceNumber;
    listItem.appendChild(link);

    // If this link starts a range
    if (range === 'from' || 'to') {
        link.classList.add('index-range-' + range);
    } else {
        link.classList.add('index-range-none');
    }

    // TO DO: if the from and to links are separated
    // by another entry, we should omit the separating entry.
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
            var pageReferenceSequenceNumber = 1;
            var rangeOpen = false;
            pageEntries.forEach(function (entry) {

                if (entry.entrySlug === ebSlugify(listItemText)) {

                    // If a 'from' link has started a reference range,
                    // skip links till the next 'to' link that closes the range.
                    if (entry.range === 'from') {
                        rangeOpen = true;
                        ebIndexAddLink(listItem, entry.filename,
                                entry.id, entry.range, pageReferenceSequenceNumber);
                        pageReferenceSequenceNumber += 1;
                    }
                    if (rangeOpen) {
                        if (entry.range === 'to') {
                            ebIndexAddLink(listItem, entry.filename,
                                    entry.id, entry.range, pageReferenceSequenceNumber);
                            pageReferenceSequenceNumber += 1;
                            rangeOpen = false;
                        }
                    } else {
                        ebIndexAddLink(listItem, entry.filename, entry.id,
                                entry.range, pageReferenceSequenceNumber);
                        pageReferenceSequenceNumber += 1;
                    }
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
