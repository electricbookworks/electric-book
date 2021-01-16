/*jslint */
/*globals elasticlunr*/

// Set up elasticlunr.
// We check for window because we don't want this
// to run in Node when rendering the search index.
if (typeof window !== 'undefined') {
    var index = elasticlunr(function () {
        this.addField('title');
        this.addField('content');
    });
}
