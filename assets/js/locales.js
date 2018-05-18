// Load locales.yml into a locales array.

// Convert locales.yml into a JSON string.
// Note that some keys use hyphens, which are invalid JS. So to use them
// as variables, use square brackets and quotes, e.g. search['search-placeholder'].
var locales = {{ site.data.locales | jsonify }};

// Or get the language from a URL parameter
// https://stackoverflow.com/a/901144/1781075
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Get the page language
if (getParameterByName('lang')) {
	var pageLanguage = getParameterByName('lang');
} else {
	var pageLanguage = document.documentElement.lang;
};


// Localise Javascript-driven text
{% if site.output == "web" or site.output == "app" %}

    // Localise Google CSE search snippets
    function localiseSearchBox() {
        document.querySelector('.search input.search-box').placeholder = locales[pageLanguage].search.placeholder;
    };
    localiseSearchBox();

{% endif %}
