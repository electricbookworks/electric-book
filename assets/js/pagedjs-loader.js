/*global window, MathJax*/

// Check for MathJax on page
function ebPagedJSMathjax() {
    'use strict';
    var mathjax = document.querySelectorAll('script[type*="math/tex"], #MathJaxConfig');
    if (mathjax.length > 0) {
        console.log('MathJax detected on page.');
        return true;
    } else {
        console.log('No MathJax detected on page.');
        return false;
    }
}

// Remove errant, empty MathJax divs that can break PagedJS layout
function ebPagedJSCleanMathJax() {
    'use strict';

    // Remove empty MathJax divs we can target directly
    var emptyMathjaxDivs = document.querySelectorAll('#MathJax_Message');
    var i;
    for (i = 0; i < emptyMathjaxDivs.length; i += 1) {
        emptyMathjaxDivs[i].remove();
    }

    // Remove empty MathJax divs whose children we can target directly
    var emptyMathjaxDivsWithEmptyParents = document.querySelectorAll('#MathJax_Hidden:only-child, #MathJax_Font_Test:only-child');
    var j;
    for (j = 0; j < emptyMathjaxDivsWithEmptyParents.length; j += 1) {
        emptyMathjaxDivsWithEmptyParents[j].parentNode.remove();
    }
}

// Load paged.js
function ebLoadPagedJS() {
    'use strict';

    console.log('Loading PagedJS...');

    var pagedJSConfig = document.createElement('script');
    pagedJSConfig.innerHTML = 'window.PagedConfig = {auto: false};';

    var pagedjs = document.createElement('script');
    pagedjs.src = 'http://127.0.0.1:4000/assets/js/pagedjs/paged.polyfill.js';
    pagedjs.async = false;

    document.head.insertAdjacentElement('beforeend', pagedJSConfig);
    document.head.insertAdjacentElement('beforeend', pagedjs);

    // Run paged.js (wait for MathJax, if any)
    if (ebPagedJSMathjax() === true) {
        MathJax.Hub.Queue(function () {
            console.log('MathJax done.');

            // Clean up MathJax
            console.log('Removing empty MathJax divs...');
            ebPagedJSCleanMathJax();

            // Load PagedJS
            console.log('Paginating with PagedJS...');
            window.PagedPolyfill.preview();
        });
    } else {
        var check;
        check = setInterval(function () {
            console.log('Waiting for paged.js to load ...');
            if (window.PagedPolyfill.preview()) {
                console.log('PagedJS loaded. Paginating...');
                clearInterval(check);
            }
        }, 1000);
    }
}

ebLoadPagedJS();
