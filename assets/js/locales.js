// Loads locales.yml into a locales array
// for use in scripts.

// Convert locales.yml into a JSON string.
// Note that hyphens in keys are converted to underscores.
var locales = {{ site.data.locales | jsonify | replace: "-", "_" }};

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
