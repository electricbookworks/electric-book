// Move footnotes to bottoms of pages

console.log('Checking for footnotes to move to endnotes...');

function ebFootnotesToMove() {
    'use strict';
    // If there are any footnotes...
    if (document.querySelector('.footnotes')) {
        // And if the page-footnotes setting is on,
        // or at least on for one of the footnotes
        if (document.body.hasAttribute('data-page-footnotes') ||
                document.querySelector('.footnotes .page-footnote')) {
            return true;
        }
    }
}

function ebMoveEndnoteToFootnote(noteReference) {
    'use strict';

    var footnoteReferenceID, endnote, pageFootnote,
            containingElement, footnoteReferenceContainer;

    // get the footnote ID
    footnoteReferenceID = noteReference.hash;

    // NOTE: Prince's .hash behaviour is unusual: it strips the # out
    // So, let's use getElementById instead of querySelector.
    // If it starts with a hash, chop it out.
    if (footnoteReferenceID.indexOf('#') === 0) {
        footnoteReferenceID = footnoteReferenceID.replace('#', '');
    }

    // Find the li with the ID from the .footnote's href
    endnote = document.getElementById(footnoteReferenceID);

    // Check that we should actually process this footnote.
    // If the data-page-footnotes setting isn't applied to this doc...
    if (!document.body.hasAttribute('data-page-footnotes')) {
        // ...check whether this particular footnote should be moved.
        if (!endnote.querySelector('.move-to-footnote')) {
            return;
        }
    }

    // Make a div.page-footnote
    pageFootnote = document.createElement('div');
    pageFootnote.className += ' page-footnote';
    pageFootnote.id = footnoteReferenceID;

    // Get the sup that contains the footnoteReference a.footnote
    footnoteReferenceContainer = noteReference.parentNode;

    // Get the element that contains the footnote reference
    containingElement = noteReference.parentNode.parentNode;

    // and add a class to it.
    containingElement.parentNode.className += ' contains-footnote';

    // Move the endnote contents inside the div.page-footnote
    pageFootnote.innerHTML = endnote.innerHTML;

    // Insert the new .page-footnote at the reference.
    // Technically, before the <sup> that contains the reference <a>.
    // We have to use insertBefore because Prince borks at insertAdjacentElement.
    containingElement.insertBefore(pageFootnote, footnoteReferenceContainer);

    // Remove the old endnote, and the old reference to it
    // (Prince creates new references to page-footnotes)
    endnote.parentNode.removeChild(endnote);
    footnoteReferenceContainer.parentNode.removeChild(footnoteReferenceContainer);

}

function ebEndnotesToFootnotes() {
    'use strict';

    // get all the a.footnote links
    var footnoteReferences = document.querySelectorAll('.footnote');

    // Process all the footnotes
    var i;
    for (i = 0; i < footnoteReferences.length; i += 1) {
        ebMoveEndnoteToFootnote(footnoteReferences[i]);

        // // If page-footnotes are on for the document,
        // // move all the endnotes to page footnotes
        // if (document.body.getAttribute('data-page-footnotes')) {
        //     ebMoveEndnoteToFootnote(footnoteReferences[i]);
        // } else {
        //     // If a given endnote contains .move-to-footnote,
        //     // move that one endnote.
        //     console.log('footnoteReferences[i].innerHTML: ' + footnoteReferences[i].innerHTML);
        //     if (footnoteReferences[i].querySelector('.move-to-footnote')) {
        //         ebMoveEndnoteToFootnote(footnoteReferences[i]);
        //     }
        // }
    }
}

/// If there are footnotes to move, move them.
if (ebFootnotesToMove()) {
    console.log('Yes, we have footnotes to move...');
    ebEndnotesToFootnotes();
}
