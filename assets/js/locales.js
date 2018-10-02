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
    var pageLanguageByURLParameter = true;
    localiseText();
} else {
    var pageLanguage = document.documentElement.lang;
    // If epub, this is xml:lang
    if (!pageLanguage) {
        var pageLanguage = document.documentElement.getAttribute('xml:lang');
    }
    localiseText();
};

// Various content localisations

function localiseText() {

    // Localise masthead
    var mastheadProjectName = document.querySelector('.masthead .masthead-series-name a');
    if (mastheadProjectName && 
        locales[pageLanguage].project.name && 
        locales[pageLanguage].project.name !== '') {
        mastheadProjectName.innerHTML = locales[pageLanguage].project.name;
    }

    // Localise search
    var searchPageHeading = document.querySelector('.search-page #content h1:first-of-type');
    if (searchPageHeading) {
        searchPageHeading.innerHTML = locales[pageLanguage].search['search-title'];
    }

    // Localise search form
    var searchLanguageToLocalise = document.querySelector('#search-language');
    if (searchLanguageToLocalise) {
        searchLanguageToLocalise.setAttribute('value', pageLanguage);
    };

    // Localise search-box placeholder
    var searchInputBox = document.querySelector('.search input.search-box');
    if (searchInputBox) {
        var searchInputBoxPlaceholder = document.querySelector('.search input.search-box').placeholder;
        if (searchInputBoxPlaceholder) {
            searchInputBoxPlaceholder = locales[pageLanguage].search['search-placeholder'];
        }
    }

    // Localise searching... notice
    var searchProgressPlaceholder = document.querySelector('.search-progress');
    if (searchProgressPlaceholder) {
        searchProgressPlaceholder.innerHTML = locales[pageLanguage].search['placeholder-searching'];
    };

    // Localise Google CSE search snippets
    var googleCSESearchBox = document.querySelector('.search input.search-box');
    if (googleCSESearchBox) {
        googleCSESearchBox.placeholder = locales[pageLanguage].search.placeholder;
    };

    // Add any notices set in locales as search.notice
    if (searchPageHeading &&
        locales[pageLanguage].search.notice &&
        locales[pageLanguage].search.notice !== '') {
        var searchNotice = document.createElement('div');
        searchNotice.classList.add('search-page-notice');
        searchNotice.innerHTML = '<p>' + locales[pageLanguage].search.notice + '</p>';
        searchPageHeading.insertAdjacentElement('afterend', searchNotice);
    };

    // We cannot localise the nav/TOC, since the root search page
    // always uses the parent-language. So we replace the nav
    // on the search page with a back button instead.
    // In case we have a back button (`$nav-bar-back-button-hide; true` in scss)
    // hide that one.
    var searchNavButtonToReplace = document.querySelector('.search-page [href="#nav"]');
    var searchNavDivToReplace = document.querySelector('.search-page #nav');
    var navBackButton = document.querySelector('.nav-back-button');
    if (searchNavButtonToReplace && navBackButton) {
        if (document.referrer != "" || window.history.length > 0) {
            navBackButton.remove();
            searchNavButtonToReplace.innerHTML = locales[pageLanguage].nav.back;
            searchNavButtonToReplace.addEventListener('click', function(ev) {
                ev.preventDefault();
                console.log('Going back...');
                window.history.back();
            });
        };
    };
    if (searchNavDivToReplace) {
        searchNavDivToReplace.innerHTML = '';
    }

    // If no results with GSE, translate 'No results' phrase
    window.addEventListener("load", function (event) {
        var noResultsGSE = document.querySelector('.gs-no-results-result .gs-snippet');
        if (noResultsGSE) {
            noResultsGSE.innerHTML = locales[pageLanguage].search['results-for-none'] + ' ‘' + searchTerm + '’';
        }
    });

    // localise questions
    var questionButtons = document.querySelectorAll('.question .check-answer-button');
    function replaceText(button) {
        button.innerHTML= locales[pageLanguage].questions['check-answers-button'];
    }
    if (questionButtons) {
        questionButtons.forEach(replaceText);
    }
}
