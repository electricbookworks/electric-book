var searchBox = document.querySelectorAll('.search-box'),
    searchForm = document.querySelector('#content .search');

function displaySearchResults(results, store) {

  var appendString = '';

  if (results.length) {

    appendString += '<div class="search-results" id="search-results">'

    appendString += '<p>' + results.length + ' result';
    if (results.length > 1) {
      appendString += 's';
    }
    appendString +=  ' found for "<mark>' + searchTerm + '</mark>".</p>';

    appendString += '<ul>';

    for (var i = 0; i < results.length; i++) {
      var item = store[results[i].ref];
      appendString += '<li><a href="{{ site.baseurl }}' + item.url + '?query=' + searchTerm + '">' + item.title + ' </a></li>';
    }

    appendString += '</ul>';

    appendString += '</div>';

  } else {
    appendString += '<p>No results found for "' + searchTerm + '".</p>';
  }
  
  searchForm.parentNode.innerHTML += appendString;
}

if (searchTerm) {

  // show the just-searched-term
  for (i = 0; i < searchBox.length; ++i) {
    searchBox[i].setAttribute("value", searchTerm);
  }

  // perform the search
  var results = index.search(searchTerm);

  // display the results
  displaySearchResults(results, store);
}
