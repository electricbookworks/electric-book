---
layout: null
---

{% include metadata %}

var urls = [];

{% for file in site.html_pages %}
{% if file.url contains ".html" %}
urls.push('{{ file.url }}');
{% endif %}
{% endfor %}

var page = require('webpage').create();
var loadInProgress = false;
var pageIndex = 0;
var viewportIndex = 0;
var fs = require('fs');

page.onLoadStarted = function() {
  loadInProgress = true;
  console.log(urls[pageIndex] + ' load started.');
};

page.onCallback = function(data) {
      loadInProgress = false;
      if (data.mathJaxDone === true) {
          console.log('Running removeMathJaxScripts.');
          page.evaluate(removeMathJaxScripts);
          fs.write('../../phantom' + urls[pageIndex], page.content, 'w');
          console.log('Wrote /phantom' + urls[pageIndex]);
          fs.remove('../..' + urls[pageIndex]);
          console.log('Deleted _site' + urls[pageIndex]);
          fs.move('../../phantom' + urls[pageIndex], '../..' + urls[pageIndex]);
          console.log('Moved /phantom' + urls[pageIndex] + ' to _site' + urls[pageIndex]);
          console.log('----------------------------------------');
      }
      pageIndex++;
};

setInterval(function() {
  if (pageIndex < urls.length) {
    if (!loadInProgress) {
      page.open('../..' + urls[pageIndex]);
    }
  } else {
    fs.removeTree('../../phantom');
    console.log('Removed temporary phantom directory inside _site/.');
    console.log('Done.');
    console.log('----------------------------------------');
    phantom.exit();
  }
}, 250);

// http://www.princexml.com/forum/topic/2971/using-mathjax-with-princexml
// Removes all MathJax <script> elements from the DOM.
// This avoids a second processing in PrinceXML, which
//  a) had nothing left to do (MathJax already).
//  b) probably would fail, since PrinceXML at the moment still lacks MathJax support
var removeMathJaxScripts = function() {
    // Does 'str' end with 'suffix'?
    var strEndsWith = function(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    // Get and remove all MathJax related script elements
    var MathJaxScriptFound = true;
    var scripts = document.getElementsByTagName("script");
    // Repeating this loop until no more matching scripts are found seems
    // to be necessary because removing children from the DOM did not always
    // happen immediately, some of them were still written to the output when
    // dumping 'page.content'.
    while (MathJaxScriptFound) {
        MathJaxScriptFound = false;
        for (var i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].hasAttribute("id")) {
                var id = scripts[i].getAttribute("id");
                // Remove script if 'id' starts with 'MathJax'
                if (id.indexOf("MathJax") === 0) {
                    MathJaxScriptFound = true;
                    scripts[i].parentNode.removeChild(scripts[i]);
                };
            } else if (scripts[i].hasAttribute("src")) {
                var src = scripts[i].getAttribute("src");
                // Remove script if 'src' ends with 'jax.js'
                if (strEndsWith(src, "Jax.js")
                    || strEndsWith(src, "jax.js")) {
                    MathJaxScriptFound = true;
                    scripts[i].parentNode.removeChild(scripts[i]);
                };
            };
        };
        scripts = document.getElementsByTagName("script");
    };

    // Remove div with ID 'MathJax_Font_Test'
    var fontTest = document.getElementById("MathJax_Font_Test");
    if (fontTest) {
        fontTest.parentNode.removeChild(fontTest);
    };

};
console.log('----------------------------------------');
console.log('Starting phantomjs to grab rendered MathJax.');
if(fs.makeDirectory('../../phantom/'))
    console.log('Made temporary phantom directory inside _site.');
else
    console.log('Could not create temporary phantom directory.');
console.log('----------------------------------------');
