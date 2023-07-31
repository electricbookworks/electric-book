/* global elasticlunr */

// Set up elasticlunr.
// We check for window because we don't want this
// to run in Node when rendering the search index.
// We initialise `index` here, and then add docs
// to elasticlunr's index elsewhere with index.addDoc().
let index
if (typeof window !== 'undefined') {
  index = elasticlunr(function () { // eslint-disable-line
    this.addField('title')
    this.addField('content')
  })
}
