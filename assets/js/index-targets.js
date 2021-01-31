/*jslint browser */
/*globals Prince, ebSlugify, NodeFilter, Node */

// This script helps create dynamic book indexes.
// It finds all HTML comments that start with
// <!-- index or <!--index and parses each line,
// assuming each line represents an entry in the index.
// It then adds <a> targets to the start of the element
// that precedes the comment, as slugs of the line.
// Comment lines that start or end with a hyphen
// start or end ranges of content that contain the
// ongoing presence of a given term. Those targets
// take 'to' or 'from' classes, which are important
// for the separate process that generates hyperlinks
// in the final book index.

// Notes on development:
// To find comment nodes, ideally we use TreeWalker.
// If the browser doesn't support TreeWalker, we iterate
// over the entire DOM ourselves, which is very slow.
// PrinceXML does not 'see' HTML comments at all.
// So for PrinceXML output, we must prerender the HTML
// to turn all comment nodes into something Prince can see.

// Options
// -------
// Block-level elements are those tags that will be
// index targets for any index comment that appears
// immediately before them in the DOM. Any other elements
// not included in this list will not be targets.
// Rather, index targets will be inserted inside them
// where the index comment appears in the DOM.
var ebIndexOptions = {
    blockLevelElements: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6',
            'P', 'BLOCKQUOTE', 'OL', 'UL', 'TABLE', 'DL']
};

// Process the comments
function ebIndexProcessComments(comments) {
    'use strict';

    // Create an array to store IDs for uniqueness
    var entries = [];

    comments.forEach(function (comment) {

        // Parse each line: slugify and add to an array
        var commentLines = comment.commentText.split('\n');

        commentLines.forEach(function (line) {

            // Remove the opening 'index:'
            var indexKeywordRegex = /^\s*index:/;
            if (indexKeywordRegex.test(line)) {
                line = line.replace(indexKeywordRegex, '');
            }

            // Strip white space at start and end of line
            line.trim();

            // Exit if the line is now empty
            if (line === '') {
                return;
            }

            // Check for starting or ending hyphens.
            // If one exists, flag it as from or to.
            // Then strip the hyphen.
            // TO DO: actually use this. Note, startsWith
            // and endsWith don't seem to be supported in PrinceXML.
            // var from = false;
            // var to = false;
            // if (line.startsWith('-')) {
            //     to = true;
            // }
            // if (line.endsWith('-')) {
            //     from = true;
            // }

            // Slugify
            var entrySlug = ebSlugify(line);

            // Add the slug to the array of entries,
            // where will we count occurrences of this entry.
            entries.push(entrySlug);

            // Create an object that counts occurrences
            // of this entry on the page so far.
            var entryOccurrences = entries.reduce(function (allEntries, entry) {
                if (entry in allEntries) {
                    allEntries[entry] += 1;
                } else {
                    allEntries[entry] = 1;
                }
                return allEntries;
            }, {});

            // Get the number of occurrences of this entry so far
            var occurrencesSoFar = entryOccurrences[entrySlug];

            // Use that to add a unique index-ID suffix to the entry slug
            var id = entrySlug + '--iid-' + occurrencesSoFar;

            // Create a target for each line
            // Note, we can't use one target, because one
            // target can't have multiple IDs. And we don't try to map
            // entries in the index to IDs of existing elements
            // because those elements' IDs could change, and sometimes
            // we want our target at a specific point in a textnode.

            var target = document.createElement('a');
            target.id = id;
            target.classList.add('index-target');

            // Set a string we'll use for the target below.
            var targetElementString = target.outerHTML;

            // But Prince doesn't support outerHTML, so we have to use
            // innerHTML by putting the target in a temporary container.
            if (typeof Prince === 'object') {

                // Prince requires that the element contain a string
                // in order for the target to be present at all.
                // So we give it a zero-width space and keep it
                // out of the flow with position: absolute.
                target.innerHTML = '​'; // a zero-width space
                target.style.position = 'absolute';

                var temporaryContainer = document.createElement('div');
                temporaryContainer.appendChild(target);
                targetElementString = temporaryContainer.innerHTML;
            }

            // If the comment is between elements (e.g. between two paras)
            // then we insert the target as the first child of the next element,
            // to reduce causing problems for CSS sibling selectors.
            // (Look out for CSS issues anyway, they may require CSS tweaks.)
            // Otherwise, if it's *inline* between two text nodes, we insert
            // the target exactly where it appears between those text nodes.
            // This way, a target can appear at any exact point in the text.

            if (comment.targetType === 'inline') { // nodeType 3 is a text node

                var positionOfTarget = comment.element.innerHTML.indexOf(comment.targetText);
                var newInnerHTML = comment.element.innerHTML.slice(0, positionOfTarget)
                        + targetElementString
                        + comment.element.innerHTML.slice(positionOfTarget);
                comment.element.innerHTML = newInnerHTML;
            } else {
                comment.element.insertBefore(target, comment.element.firstChild);
            }
        });
    });
}

// Get all the comments
function ebIndexGetComments() {
    'use strict';

    var comments = [];

    // Ad each comment node to the comments array
    var indexedElement, commentValue, previousElementSibling,
            nextElementSibling, nextSibling, targetType, targetText;

    var debugging = true;
    // Check for TreeWalker support.
    if (document.createTreeWalker && !debugging) {

        // https://www.bennadel.com/blog/2607-finding-html-comment-nodes-in-the-dom-using-treewalker.htm
        // By default, the TreeWalker will show all of the matching DOM nodes that it
        // finds. However, we can use an optional 'filter' method that will inform the
        // DOM traversal.
        function filter(node) {
            if (node.nodeValue === ' Load scripts. ') {
                return (NodeFilter.FILTER_SKIP);
            }
            return (NodeFilter.FILTER_ACCEPT);
        }

        // IE and other browsers differ in how the filter method is passed into the
        // TreeWalker. Mozilla takes an object with an "acceptNode" key. IE takes the
        // filter method directly. To work around this difference, we will define the
        // acceptNode function a property of itself.
        filter.acceptNode = filter;

        // NOTE: The last argument [] is a deprecated, optional parameter. However, in
        // IE, the argument is not optional and therefore must be included.
        var treeWalker = document.createTreeWalker(
            document.getElementById('content'),
            NodeFilter.SHOW_COMMENT,
            filter,
            false
        );

        while (treeWalker.nextNode()) {

            nextSibling = treeWalker.currentNode.nextSibling;
            previousElementSibling = treeWalker.currentNode.previousElementSibling;
            nextElementSibling = treeWalker.currentNode.nextElementSibling;

            // The the previous or next sibling elements of the comment
            // are elements, then this comment contains index entries
            // that should point to the start of the next element.

            // If the next sibling node is a text node, and
            // it actually contains text (isn't just space),
            // then we know that the index target must be inline, i.e.
            // inside a text element like a paragraph.

            if (ebIndexOptions.blockLevelElements.includes(previousElementSibling.tagName)
                    && ebIndexOptions.blockLevelElements.includes(nextElementSibling.tagName)) {
                indexedElement = treeWalker.currentNode.nextElementSibling;
                targetType = 'element';
                targetText = '';
            } else {
                indexedElement = treeWalker.currentNode.parentElement;
                targetType = 'inline';
                targetText = nextSibling.nodeValue;
            }

            commentValue = treeWalker.currentNode.nodeValue;

            comments.push({
                commentText: commentValue,
                element: indexedElement,
                targetText: targetText,
                targetType: targetType
            });
        }
    } else {

        function lookForComments(thisNode) {

            // Polyfill for IE < 9
            if (!Node) {
                var Node = {};
            }
            if (!Node.COMMENT_NODE) {
                Node.COMMENT_NODE = 8;
            }

            var isAnIndexComment = /^\s*index:/;

            for (thisNode = thisNode.firstChild; thisNode; thisNode = thisNode.nextSibling) {

                // If it's a comment thisNode and it is not just whitespace
                if (thisNode.nodeType === Node.COMMENT_NODE
                        && isAnIndexComment.test(thisNode.nodeValue)) {

                    nextSibling = thisNode.nextSibling;
                    previousElementSibling = thisNode.previousElementSibling;
                    nextElementSibling = thisNode.nextElementSibling;

                    if (ebIndexOptions.blockLevelElements.includes(previousElementSibling.tagName)
                            && ebIndexOptions.blockLevelElements.includes(nextElementSibling.tagName)) {
                        indexedElement = thisNode.nextElementSibling;
                        targetType = 'element';
                        targetText = '';
                    } else {
                        indexedElement = thisNode.parentElement;
                        targetType = 'inline';
                        targetText = nextSibling.nodeValue;
                    }

                    commentValue = thisNode.nodeValue;

                    comments.push({
                        commentText: commentValue,
                        element: indexedElement,
                        targetText: targetText,
                        targetType: targetType
                    });
                } else {
                    lookForComments(thisNode);
                }
            }
        }
        lookForComments(document.body);
    }

    ebIndexProcessComments(comments);
}

function ebIndexGetCommentsFromTitles() {
    'use strict';

    var comments = [];

    var indexCommentElements = document.querySelectorAll('.index-comment');

    indexCommentElements.forEach(function (element) {

        var indexedElement, commentValue, previousElementSibling,
                nextElementSibling, nextSibling, targetType, targetText;

        previousElementSibling = element.previousElementSibling;
        nextElementSibling = element.nextElementSibling;
        nextSibling = element.nextSibling;

        if (ebIndexOptions.blockLevelElements.includes(previousElementSibling.tagName)
                && ebIndexOptions.blockLevelElements.includes(nextElementSibling.tagName)) {
            indexedElement = element.nextElementSibling;
            targetType = 'element';
            targetText = '';
        } else {

            // parentNode, because PrinceXML doesn't support parentElement
            indexedElement = element.parentNode;
            targetType = 'inline';
            targetText = nextSibling.nodeValue;
        }

        commentValue = element.title;

        comments.push({
            commentText: commentValue,
            element: indexedElement,
            targetText: targetText,
            targetType: targetType
        });
    });
    ebIndexProcessComments(comments);
}

// Triage PrinceXML or otherwise
function ebIndexInit() {
    'use strict';

    if (typeof Prince === 'object') {
        ebIndexGetCommentsFromTitles();
    } else {
        ebIndexGetComments();
    }
}

// Go
ebIndexInit();
