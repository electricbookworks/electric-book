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

var searchTerm = getQueryVariable('query'),
    searchBox = document.querySelectorAll('.search-box'),
    searchForm = document.querySelector('#content .search');

if (searchTerm && searchBox) {
  // show the just-searched-term
  for (var j = 0; j < searchBox.length; ++j) {
    searchBox[j].setAttribute("value", searchTerm);
  }
}
