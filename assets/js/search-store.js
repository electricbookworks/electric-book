{% comment %} Generates a store that we can point an elasticlunr
0-based index reference at for search results. {% endcomment %}

{% comment %} Get page metadata, mainly to detect
whether output-docs == true. {% endcomment %}
{% include metadata %}

{% comment %} Get the array-of-files to include in the index {% endcomment %}
{% include files-listed.html %}

{% comment %} Get site.pages as site-pages-for-search and sort it.
Otherwise, different Ruby infrastructure will sort
this differently, causing different search results. {% endcomment %}
{% assign site-pages-for-search = site.pages %}
{% assign site-pages-for-search = site-pages-for-search | sort: "url" %}

{% comment %} Create an index number. This helps us check that
the files in this store match those in the index. {% endcomment %}
{% assign search-store-loop-index = -1 %}

{% comment %} Add data to a store, which we need as search results,
because since elasticlunr only returns (0-based indexed) `ref`.
Only show excerpts if they do not include Liquid tags.
Also, Jekyll sets page.url for index.html pages as the path
to the folder, not the file. So we check for that. {% endcomment %}
var store = [
    {% for url-from-array in array-of-files %}
        {% for page in site-pages-for-search %}
            {% if page.url == url-from-array %}
                {
                    'title': {% if page.title and page.title != "" %}{{ page.title | jsonify }}{% else %}{{ page.url | replace: "/"," " | jsonify }}{% endif %},
                    'excerpt': {% capture excerpt %}{% if page.description and page.description != "" %}{{ page.description | markdownify | split: "<p>" | shift | first | strip_html | truncatewords: 20, "&hellip;" | jsonify | replace: "\n", "" }}{% else %}{{ page.content | markdownify | split: "<p>" | shift | first | strip_html | truncatewords: 20, "&hellip;" | jsonify | replace: "\n", "" }}{% endif %}{% endcapture %}{% if excerpt contains "{%" or excerpt contains "{{" %}""{% else %}{{ excerpt }}{% endif %},
                    'url': {{ page.url | replace_first: "/", "" | jsonify }},
                    'id': {% assign search-store-loop-index = search-store-loop-index | plus: 1 %}{{ search-store-loop-index }}
                }{% unless forloop.last %},{% endunless %}
            {% elsif url-from-array contains '/index.html' %}
                {% capture page-url-as-index %}{{ page.url }}index.html{% endcapture %}
                    {% if page-url-as-index == url-from-array %}
                {
                    'title': {% if page.title and page.title != "" %}{{ page.title | jsonify }}{% else %}{{ page.url | replace: "/"," " | jsonify }}{% endif %},
                    'excerpt': {% capture excerpt %}{% if page.description and page.description != "" %}{{ page.description | markdownify | split: "<p>" | shift | first | strip_html | truncatewords: 20, "&hellip;" | jsonify | replace: "\n", "" }}{% else %}{{ page.content | markdownify | split: "<p>" | shift | first | strip_html | truncatewords: 20, "&hellip;" | jsonify | replace: "\n", "" }}{% endif %}{% endcapture %}{% if excerpt contains "{%" or excerpt contains "{{" %}""{% else %}{{ excerpt }}{% endif %},
                    'url': {{ url-from-array | replace_first: "/", "" | jsonify }},
                    'id': {% assign search-store-loop-index = search-store-loop-index | plus: 1 %}{{ search-store-loop-index }}
                }{% unless forloop.last %},{% endunless %}
                    {% endif %}
            {% endif %}
        {% endfor %}
    {% endfor %}

        {% if output-docs == true %}
            {% for page in site.docs %}
                {
                    'title': {% if page.title and page.title != "" %}{{ page.title | jsonify }}{% else %}{{ page.url | replace: "/"," " | jsonify }}{% endif %},
                    'excerpt': {% capture excerpt %}{{ page.content | markdownify | split: "<p>" | shift | first | strip_html | truncatewords: 20, "&hellip;" | jsonify }}{% endcapture %}{% if excerpt contains "{%" or excerpt contains "{{" %}""{% else %}{{ excerpt }}{% endif %},
                    'url': {{ page.url | replace_first: "/", "" | jsonify }},
                    'id': {% assign search-store-loop-index = search-store-loop-index | plus: 1 %}{{ search-store-loop-index }}
                },
            {% endfor %}
        {% endif %}

];

// Let us use the store when rendering the index.
// This must only run in Node, hence the check.
if (typeof window === 'undefined') {
    module.exports = {
        store: store,
        output: '{{ site.output }}'
    }
}
