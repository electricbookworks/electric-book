// get electric-book metadata
{% include metadata %}

// set up elasticlunr
var index = elasticlunr(function () {
    this.addField('title');
    this.addField('content');
});

{% assign count = 0 %}

// add the docs to the index, if there are docs
{% if output-docs == "true" %}
  {% for page in site.docs %}
    index.addDoc({
      id: {{count}},
      title: {% if page.title and page.title != "" %}{{ page.title | jsonify}}{% else %}{{ page.url | replace: "/"," " | jsonify}}{% endif %},
      content: {{page.content | strip_html | jsonify}},
    });
    {% assign count = count | plus: 1 %}
  {% endfor %}
{% endif %}

// add the pages to the index
{% for page in site.pages %}
  {% unless
  page.url contains ".css" or
  page.url contains ".js" or
  page.url contains "file-list" or
  page.url contains "search.html" or
  page.url contains "cover.html" or
  page.url contains "titlepage.html" or
  page.url contains "copyright.html" or
  page.url contains "contents.html" or
  page.url contains "preface.html"
  %}
  index.addDoc({
    id: {{count}},
    title: {% if page.title and page.title != "" %}{{ page.title | jsonify}}{% else %}{{ page.url | replace: "/"," " | jsonify}}{% endif %},
    content: {{page.content | strip_html | jsonify}},
  });
  {% assign count = count | plus: 1 %}
  {% endunless %}
{% endfor %}

// add data to a store, since elasticlunr only returns (0-based indexed) `ref`
var store = [
  {% for page in site.docs %}
    {
      'title': {% if page.title and page.title != "" %}{{ page.title | jsonify}}{% else %}{{ page.url | replace: "/"," " | jsonify}}{% endif %},
      'excerpt': {{ page.content | split: "<p>" | shift | first | truncatewords: 20, "&hellip;" | strip_html | jsonify}},
      'url': {{ page.url | jsonify}}
    },
  {% endfor %}
  {% for page in site.pages %}
    {% unless
    page.url contains ".css" or
    page.url contains ".js" or
    page.url contains "file-list" or
    page.url contains "search.html" or
    page.url contains "cover.html" or
    page.url contains "titlepage.html" or
    page.url contains "copyright.html" or
    page.url contains "contents.html" or
    page.url contains "preface.html"
    %}{
      'title': {% if page.title and page.title != "" %}{{ page.title | jsonify}}{% else %}{{ page.url | replace: "/"," " | jsonify}}{% endif %},
      'excerpt': {{ page.content | split: "<p>" | shift | first | truncatewords: 20, "&hellip;" | strip_html | jsonify}},
      'url': {{ page.url | jsonify}}
    }{% unless forloop.last %},{% endunless %}
    {% endunless %}
  {% endfor %}
];
