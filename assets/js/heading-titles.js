// Give all headings title attributes (unless they already have one)
function heading_titles() {
    var x = document.querySelectorAll('h1,h2,h3,h4,h5,h6')
    var i;
    for (i = 0; i < x.length; i++) {
      if (x[i].hasAttribute("title")) {;
      } else {
        x[i].setAttribute("title", x[i].textContent);
      }
    }
}
// Run this on window.onload for Prince
// see http://www.princexml.com/doc/javascript/
window.onload = function() {
    heading_titles();
}
