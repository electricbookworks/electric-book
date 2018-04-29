{% comment %} Generates a store that we can point an elasticlunr
0-based index reference at for search results. {% endcomment %}

{% comment %} Get page metadata, mainly to detect
whether output-docs == true. {% endcomment %}
{% include metadata %}

{% comment %} Get the array-of-files to include in the index {% endcomment %}
{% include files-listed.html %}

{% comment %} Add data to a store, which we need as search results,
because since elasticlunr only returns (0-based indexed) `ref`.
Only show excerpts if they do not include Liquid tags.
Also, Jekyll sets page.url for index.html pages as the path
to the folder, not the file. So we check for that. {% endcomment %}
var store = [
    {% for url-from-array in array-of-files %}
        {% for page in site.pages %}
            {% if page.url == url-from-array %}
                {
                    'title': {% if page.title and page.title != "" %}{{ page.title | jsonify }}{% else %}{{ page.url | replace: "/"," " | jsonify }}{% endif %},
                    'excerpt': {% capture excerpt %}{{ page.content | markdownify | split: "<p>" | shift | first | truncatewords: 20, "&hellip;" | strip_html | jsonify | replace: "\n", "" }}{% endcapture %}{% if excerpt contains "{%" or excerpt contains "{{" %}""{% else %}{{ excerpt }}{% endif %},
                    'url': {{ page.url | replace_first: "/", "" | jsonify }}
                }{% unless forloop.last %},{% endunless %}
            {% elsif url-from-array contains '/text/index.html' %}
                {% capture page-url-as-index %}{{ page.url }}index.html{% endcapture %}
                    {% if page-url-as-index == url-from-array %}
                {
                    'title': {% if page.title and page.title != "" %}{{ page.title | jsonify }}{% else %}{{ page.url | replace: "/"," " | jsonify }}{% endif %},
                    'excerpt': {% capture excerpt %}{{ page.content | markdownify | split: "<p>" | shift | first | truncatewords: 20, "&hellip;" | strip_html | jsonify | replace: "\n", "" }}{% endcapture %}{% if excerpt contains "{%" or excerpt contains "{{" %}""{% else %}{{ excerpt }}{% endif %},
                    'url': {{ url-from-array | replace_first: "/", "" | jsonify }}
                }{% unless forloop.last %},{% endunless %}
                    {% endif %}
            {% endif %}
        {% endfor %}
    {% endfor %}

        {% if output-docs == true %}
            {% for page in site.docs %}
                {
                    'title': {% if page.title and page.title != "" %}{{ page.title | jsonify }}{% else %}{{ page.url | replace: "/"," " | jsonify }}{% endif %},
                    'excerpt': {% capture excerpt %}{{ page.content | markdownify | split: "<p>" | shift | first | truncatewords: 20, "&hellip;" | strip_html | jsonify }}{% endcapture %}{% if excerpt contains "{%" or excerpt contains "{{" %}""{% else %}{{ excerpt }}{% endif %},
                    'url': {{ page.url | replace_first: "/", "" | jsonify }}
                },
            {% endfor %}
        {% endif %}

];

