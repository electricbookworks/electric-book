/* jslint browser */
/*globals window */

function ebFootnotePopups() {
    'use strict';

    // List the features we use
    var featuresSupported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== "undefined" &&
            window.addEventListener !== "undefined" &&
            !!Array.prototype.forEach;

    // Get all the .footnote s
    var footnoteLinks = document.querySelectorAll('.footnote');

    // Early exit for unsupported or if there are no footnotes
    if (!featuresSupported || footnoteLinks.length === 0) {
        return;
    }

    // Loop through footnotes
    footnoteLinks.forEach(function (current) {

        // Get the target ID
        var targetHash = current.hash;
        var targetID = current.hash.replace('#', '');

        // Escape it with double backslashes, for querySelector
        var sanitisedTargetHash = targetHash.replace(':', '\\:');

        // Find the li with the ID from the .footnote's href
        var targetReference = document.querySelector(sanitisedTargetHash);

        // Make a div.reference
        var footnoteContainer = document.createElement('div');
        footnoteContainer.classList.add('footnote-detail');
        footnoteContainer.classList.add('visuallyhidden');
        footnoteContainer.id = 'inline-' + targetID;

        // The a, up to the sup
        var theSup = current.parentNode;
        var theContainingElement = current.parentNode.parentNode;

        // Add the reference div to the sup
        // (Technically, this creates invalid HTML because a sup
        // should not contain a div. But this is necessary to
        // position the popup under the sup, and no worse than
        // making the popup a span that contains a p.)
        theSup.appendChild(footnoteContainer);

        // Move the li contents inside the div.reference
        footnoteContainer.innerHTML = targetReference.innerHTML;

        // Show on hover
        theSup.addEventListener('mouseover', function (ev) {
            if (ev.target.classList.contains('footnote')) {
                footnoteContainer.classList.remove('visuallyhidden');
            }
        });

        // Add a class to the parent
        theContainingElement.parentNode.classList.add('contains-footnote');

        // If we mouseleave footnoteContainer, hide it
        // (mouseout also fires on mouseout of children, so we use mouseleave)
        footnoteContainer.addEventListener('mouseleave', function (ev) {
            if (ev.target === this) {
                setTimeout(function () {
                    footnoteContainer.classList.add('visuallyhidden');
                }, 1000);
            }
        });

        // Clicking on the reverseFootnote link closes the footnote
        var reverseFootnote = footnoteContainer.querySelector('.reversefootnote');

        // Remove the contents since we're using
        // CSS and :before to show a close button marker
        reverseFootnote.innerText = '';

        reverseFootnote.addEventListener('click', function (ev) {
            ev.preventDefault();
            footnoteContainer.classList.add('visuallyhidden');
        });

        // Remove the href to avoiding jumping down the page
        current.removeAttribute('href');

    });
}

ebFootnotePopups();
