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

// Create and emit an event
function ebEmitEvent(name, element) {
    'use strict';

    // Create the event
    var event = document.createEvent('Event');

    // Define the event name
    event.initEvent(name, true, true);

    // Emit the event
    element.dispatchEvent(event);

    // Log for debugging
    // console.log('Event dispatched: ' + event.type + ' on ' + element.tagName + '.');

    // Listen for the event with:
    // element.addEventListener(name, function (event) {
    // // event.target matches element
    // }, false);
}
