// Get some elements
var searchTerm = getQueryVariable('query'),
    searchBox = document.querySelectorAll('.search-box');

// Ask mark.js to mark all the search terms
var markInstance = new Mark(document.querySelector("#wrapper"));
if (searchTerm) {
  markInstance.unmark().mark(searchTerm);
}

// Fill the search boxes with the current search term
function fillSearchBox() {
  if (searchTerm && searchBox) {
    // show the just-searched-term
    for (var j = 0; j < searchBox.length; ++j) {
      searchBox[j].setAttribute("value", searchTerm);
    }
  }
}

// Check whether this is a search-page
function isSearchPage() {
  var isSearchPage = document.body.classList.contains('search-page');
  if (isSearchPage) {
    return true;
  } else {
    return false;
  }
};

// get query search term from GET query string
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');

    if (pair[0] === variable) {
      return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
    }
  }
}

// Show a summary of search terms and jump-to-first link on destination page
function jumpToSearchResult() {

  // add a summary before the first section
  var searchTerms = document.querySelectorAll('[data-markjs]');
  var numberOfSearchTerms = searchTerms.length;
  if(!!numberOfSearchTerms) {

    console.log('Page contains searched terms');

    // make the summary paragraph
    var searchResultsSummary = document.createElement('div');
    searchResultsSummary.classList.add('search-results-summary')
    if (numberOfSearchTerms == 1) {
      searchResultsSummary.innerHTML = numberOfSearchTerms + ' ' + locales[pageLanguage].search['results-for-singular'] + ' ' + '"<mark>' + searchTerm + '</mark>".';
    } else {
      searchResultsSummary.innerHTML = numberOfSearchTerms + ' ' + locales[pageLanguage].search['results-for-plural'] + ' ' + '"<mark>' + searchTerm + '</mark>".';
    }

    // add it after the first heading
    var mainHeading = document.querySelector('#content h1, #content h2, #content h3, #content h4, #content h5, #content h6');
    var contentDiv =  document.querySelector('#content');

    if (mainHeading) {
      contentDiv.insertBefore(searchResultsSummary, mainHeading.nextSibling);
    } else {
      contentDiv.insertBefore(searchResultsSummary, contentDiv.firstChild);
    }

    // add a link to the first result
    searchTerms[0].id = 'first-search-result';
    searchResultsSummary.innerHTML += ' <a href="#first-search-result"> ' + locales[pageLanguage].search['jump-to-first'] + '</a>.'

    return;
  }
}

if (isSearchPage() == false) {
  jumpToSearchResult();
} else {
  fillSearchBox();
};
