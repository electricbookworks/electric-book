/*jslint browser */
/*globals */

// Utility functions

// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
function ebSlugify(string) {
    'use strict';

    var a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    var b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    var p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
}

// Or get the language from a URL parameter
// https://stackoverflow.com/a/901144/1781075
function ebGetParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Check if a page exists
// (Thanks https://stackoverflow.com/a/22097991/1781075)
function ebCheckForPage(url) {
    'use strict';
    var request;
    var pageStatus = false;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    }
    request.open('GET', url, false);
    request.send(); // this will pause the page while we check for the response
    if (request.status === 404) {
        pageStatus = false;
    } else {
        pageStatus = true;
    }
    return pageStatus;
}

// Check if an element has a particular computed style
function ebHasComputedStyle(element, property, value) {
    'use strict';
    var style = getComputedStyle(element);

    // The the element has the property, and no value is specified,
    // return true. If a value is specified, and it matches, return true.
    if (style[property]) {
        if (!value) {
            return true;
        } else {
            if (style[property] === value) {
                return true;
            }
        }
    }
}

// Check if an element or its ancestors are position: relative.
// Useful when positioning an element absolutely.
// Returns the first relatively positioned parent.
// Effectively equivalent to HTMLElement.offsetParent,
// but returns false, not BODY, if no relative parent.
function ebIsPositionRelative(element) {
    if (ebHasComputedStyle(element, 'position', 'relative')) {
        return element;
    } else {
        if (element.tagName !== 'BODY') {
            return ebIsPositionRelative(element.parentElement);
        } else {
            return false;
        }
    }
}

// Get the nearest preceding sibling or cousin element
function ebNearestPrecedingSibling(element, tagName, iterationTrue) {
    'use strict';

    if (element) {
        // If this is our second pass, and the element matches, return it.
        if (iterationTrue && element.tagName === tagName) {
            return element;
        }

        // Otherwise, if the element's previous sibling matches, return it
        else if (element.previousElementSibling
                    && element.previousElementSibling.tagName === tagName) {
            return element.previousElementSibling;
        }

        // Otherwise, check the previous element and then its parents' siblings' children
        else {
            if (element.previousElementSibling) {
                return ebNearestPrecedingSibling(element.previousElementSibling, tagName, true);
            } else {
                if (element.parentNode && element.parentNode.previousElementSibling) {
                    return ebNearestPrecedingSibling(element.parentNode.previousElementSibling.lastElementChild, tagName, true);
                } else {
                    return false;
                }
            }
        }
    } else {
        return false;
    }

}

// Extend the String prototype to allow a regex lastIndexOf
// https://stackoverflow.com/a/21420210/1781075
String.prototype.lastIndexOfRegex = function (regex, fromIndex) {
    var str = fromIndex ? this.substring(0, fromIndex) : this;
    var match = str.match(regex);
    return match ? str.lastIndexOf(match[match.length-1]) : -1;
}
