---
layout: null
---

var searchResults = document.getElementById('search-results'),
    searchBox = document.getElementById('search-box');

function displaySearchResults(results, store) {

  if (results.length) {
    var appendString = '';

    for (var i = 0; i < results.length; i++) {
      var item = store[results[i].ref];
      appendString += '<li><a href="{{ site.baseurl }}' + item.url + '?query=' + searchTerm + '">' + item.title + ' </a></li>';
    }

    searchResults.innerHTML = appendString;
  } else {
    searchResults.innerHTML = '<li>No results found for "' + searchTerm + '".</li>';
  }
}

if (searchTerm) {

  // show the just-searched-term
  searchBox.setAttribute("value", searchTerm);

  // perform the search
  var results = index.search(searchTerm);

  // display the results
  displaySearchResults(results, store);
}
