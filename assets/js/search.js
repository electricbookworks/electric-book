function displaySearchResults(results, store) {

  var appendString = '';

  if (results.length) {

    appendString += '<div class="search-results" id="search-results">'

    appendString += '<h2>Search results</h2>';

    appendString += '<p>' + results.length + ' result';
    if (results.length > 1) {
      appendString += 's';
    }
    appendString +=  ' found for "<mark>' + searchTerm + '</mark>".</p>';

    appendString += '<ul>';

    for (var i = 0; i < results.length; i++) {
      var item = store[results[i].ref];
      appendString += '<li>';
      appendString += '<h3><a href="{{ site.baseurl }}' + item.url + '?query=' + searchTerm + '">' + item.title + ' </a></h3>';
      appendString += '<p>' + item.excerpt + '</p>';
      appendString += '</li>';
    }

    appendString += '</ul>';

    appendString += '</div>';

  } else {
    appendString += '<p>No results found for "' + searchTerm + '".</p>';
  }

  searchForm.parentNode.innerHTML += appendString;
}

if (searchTerm) {

  // perform the search
  var results = index.search(searchTerm, {
    bool: "AND"
  });

  // display the results
  displaySearchResults(results, store);
}
