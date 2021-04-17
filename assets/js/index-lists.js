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

    // If the listItem has child lists, insert the link
    // before the first one. Otherwise, append the link.
    if (listItem.querySelector('ul')) {
        listItem.insertBefore(link, listItem.querySelector('ul'));
    } else {
        listItem.appendChild(link);
    }

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

    // We're already looping through all list items, even children.
    // For each one, contruct its tree from its parent nodes.
    // When we look up this entry in the db, we'll compare
    // the constructed tree with the real one in the database/index.
    var listItemTree = [];

    // If a list item has a parent list item, and its
    // text value to the beginning of the tree array.
    // Iterate up the tree to each possible parent.
    listItemTree.push(listItem.firstChild.nodeValue.trim());
    function buildTree(listItem) {
        if (listItem.parentElement
                && listItem.parentElement.closest('li')) {
            listItemTree.unshift(listItem.parentElement.closest('li')
                .firstChild.nodeValue.trim());
            buildTree(listItem.parentElement.closest('li'));
        }
    }
    buildTree(listItem);

    // Reconstruct the reference's slug from the tree
    var listItemSlug = ebSlugify(listItemTree.join(' \\ '));

    var currentBookTitle = document.body.getAttribute('data-title');
    var currentTranslation = document.body.getAttribute('data-translation');

    // Look through the index of targets
    ebIndexTargets.forEach(function (pageEntries) {

        // Each item in the ebIndexTargets array represents
        // the index references on one HTML page.
        // Check if the entries for this page
        // are for files in the same book.
        // We just check against the first entry for the page.
        var titleMatches = false;
        var languageMatches = false;
        if (currentBookTitle === pageEntries[0].bookTitle) {
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

                if (entry.entrySlug === listItemSlug) {

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
    var indexListsProcessed = 0;

    indexLists.forEach(function (indexList) {

        var listItems = indexList.querySelectorAll('li');

        listItems.forEach(function (listItem) {
            ebIndexFindLinks(listItem);
        });

        // Flag when we're done
        if (indexListsProcessed === indexLists.length
                    || indexLists.length === 1) {
            document.body.setAttribute('data-index-list', 'loaded');
        }
        indexListsProcessed += 1;
    });
}

// Go
ebIndexPopulate();
