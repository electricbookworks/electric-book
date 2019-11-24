/*jslint browser */
/*globals locales, pageLanguage, index, searchTerm, store, fillSearchBox */

// Display the search results
function displaySearchResults(results, store) {
    'use strict';

    var localisedSearchResults = locales[pageLanguage].search['search-results'];
    var appendString = '';

    var localisedSearchResultsNumberSuffix;
    if (results.length) {

        appendString += '<div class="search-results" id="search-results">';

        appendString += '<h2>' + localisedSearchResults + '</h2>';

        if (results.length === 1) {
            localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-singular'];
        } else {
            localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-plural'];
        }

        appendString += '<p>' + results.length + ' ' + localisedSearchResultsNumberSuffix;
        appendString += ' "<mark>' + searchTerm + '</mark>".</p>';
        appendString += '<ul>';

        var i, item;
        for (i = 0; i < results.length; i += 1) {
            item = store[results[i].ref];
            appendString += '<li>';
            appendString += '<h3><a href="' + item.url + '?query=' + searchTerm + '">' + item.title + ' </a></h3>';
            appendString += '<p>' + item.excerpt + '</p>';
            appendString += '</li>';
        }

        appendString += '</ul>';
        appendString += '</div>';
    } else {
        localisedSearchResultsNumberSuffix = locales[pageLanguage].search['results-for-none'];
        appendString += '<p>' + localisedSearchResultsNumberSuffix + ' "' + searchTerm + '".</p>';
    }

    var searchForm = document.querySelector('#content .search');
    searchForm.parentNode.innerHTML += appendString;

    // Hide the search-progress placeholder
    var searchProgressPlaceholder = document.querySelector('.search-progress-placeholder');
    if (searchProgressPlaceholder) {
        searchProgressPlaceholder.classList.add('visuallyhidden');
    }
}

function checkForSearchTerm() {
    'use strict';
    if (searchTerm) {

        // display a 'Searching' progress placeholder
        var searchProgress = document.createElement('div');
        searchProgress.classList.add('search-progress-placeholder');
        if (searchProgress) {
            var searchBox = document.querySelector('#content #search-box');
            if (searchBox) {
                searchProgress.innerHTML = '<p>' + locales[pageLanguage].search['placeholder-searching'] + '</p>';
                searchBox.insertAdjacentElement('afterEnd', searchProgress);
            }
        }

        // perform the search
        var results = index.search(searchTerm, {
            bool: "AND"
        });

        // display the results
        displaySearchResults(results, store);

    }
}

checkForSearchTerm();
fillSearchBox();
