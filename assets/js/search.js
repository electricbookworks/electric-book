---
layout: null
---

// set up elasticlunr
var index = elasticlunr(function () {
    this.addField('title');
    this.addField('content');
});

// add the data to the index
{% assign count = 0 %}
{% for page in site.pages %}
index.addDoc({
  id: {{count}},
  title: {{page.title | jsonify}},
  content: {{page.content | strip_html | jsonify}},
});
{% assign count = count | plus: 1 %}
{% endfor %}

// add data to a store, since elasticlunr only returns (0-based indexed) `ref`
var store = [{% for page in site.pages %}{
  'title': {{page.title | jsonify}},
  'content': {{page.content | strip_html | jsonify}},
  'url': {{ page.url | jsonify}}
 }{% unless forloop.last %},{% endunless %}{% endfor %}
];

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

var searchTerm = getQueryVariable('query');


function displaySearchResults(results, store) {
  var searchResults = document.getElementById('search-results');

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

var searchBox = document.getElementById('search-box');

if (searchTerm) {

  // show the just-searched-term
  searchBox.setAttribute("value", searchTerm);

  // perform the search
  var results = index.search(searchTerm);

  // display the results
  displaySearchResults(results, store);
}
