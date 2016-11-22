// set up elasticlunr
var index = elasticlunr(function () {
    this.addField('title');
    this.addField('content');
});

// add the data to the index
{% assign count = 0 %}
{% for page in site.pages %}
  {% unless
  page.url contains ".css" or
  page.url contains ".js" or
  page.url contains "file-list" or
  page.url contains "search.html"
  %}
  index.addDoc({
    id: {{count}},
    title: {{page.title | jsonify}},
    content: {{page.content | strip_html | jsonify}},
  });
  {% assign count = count | plus: 1 %}
  {% endunless %}
{% endfor %}

// add data to a store, since elasticlunr only returns (0-based indexed) `ref`
var store = [
  {% for page in site.pages %}
    {% unless
    page.url contains ".css" or
    page.url contains ".js" or
    page.url contains "file-list" or
    page.url contains "search.html"
    %}{
    'title': {{page.title | jsonify}},
    'content': {{page.content | strip_html | jsonify}},
    'url': {{ page.url | jsonify}}
   }{% unless forloop.last %},{% endunless %}
   {% endunless %}
 {% endfor %}
];
