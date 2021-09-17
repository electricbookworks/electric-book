---
layout: trim
---

{% comment %} This page bundles the components that
allow elasticlunr to search the index.
Only search-store is also used for PDF and epub. {% endcomment %}

{% if site.output == "web" or site.output == "app" %}

    {% comment %} The third-party script that does the searching {% endcomment %}
    {% include_relative vendor/elasticlunr.min.js %}

    {% comment %} Our setup or initialisation of elasticlunr {% endcomment %}
    {% include_relative elasticlunr-setup.js %}

{% endif %}

{% comment %} The store of search results that we will return after
elasticlunr has searched the index and returned a page id {% endcomment %}
{% include_relative search-store.js %}
