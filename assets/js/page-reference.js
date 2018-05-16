// Page cross-reference in print
// Use with css:
// content: prince-script(pagereference);

// From here, we use a function to generate content, either
// content: " (page " target-counter(attr(href), page) ")";
// or, if we're on the page we're targeting
// content: normal;

// Get the locale word for page for this HTML document's language
// pageLanguage is provided by locales.js
var pageWord = locales[pageLanguage]['cross-references'].page;

function addPageReferenceFunc() {

    // exit if we're in phantom; we only want Prince to do this
    if (typeof window.callPhantom === 'function') return;

    Prince.addScriptFunc("pagereference", function(currentPage, targetPage) {

        // if the target is on this page, return blank
        if (currentPage === targetPage) return '';

        // otherwise show a space and the page number in parentheses
        return '\u00A0' + '(' + pageWord + ' ' + targetPage +')';
    });
}

addPageReferenceFunc();
