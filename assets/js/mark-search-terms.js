// set up for mark.js to do its thing
var markInstance = new Mark(document.querySelector("#wrapper"));
if (searchTerm) {
  markInstance.unmark().mark(searchTerm);
}
