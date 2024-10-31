---
layout: trim
---

{% comment %} This page bundles the components that
allow elasticlunr to search the index. {% endcomment %}

{% if site.output == "web" or site.output == "app" %}

    {% comment %} The third-party script that does the searching {% endcomment %}
    {% include_relative vendor/elasticlunr.min.js %}

    {% comment %} Our setup or initialisation of elasticlunr {% endcomment %}
    {% include_relative elasticlunr-setup.js %}

{% endif %}
