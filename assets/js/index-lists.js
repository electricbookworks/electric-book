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
}

// Add a link for a specific entry
function ebIndexFindLinks(listItem) {
    'use strict';

    var currentTitle = document.body.getAttribute('data-title');
    var currentTranslation = document.body.getAttribute('data-translation');
    var listItemText = listItem.innerHTML;
    var targetsProcessed = 0;

    // Look through the index of targets
    ebIndexTargets.forEach(function (pageEntries) {

        // Flag when we're done
        targetsProcessed += 1;
        if (targetsProcessed === ebIndexTargets.length) {
            document.body.setAttribute('data-index-list', 'loaded');
        }

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

    // Don't do this if the list is already loaded
    // This prevents us doing this work if it's been pre-processed
    // e.g. by gulp during PDF or epub output.
    if (document.body.getAttribute('data-index-list') === 'loaded') {
        return;
    }

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
