---
# A bundle of scripts.
# Jekyll will assemble and populate these.
layout: null
---

{% include_relative polyfills.js %}
{% include_relative utilities.js %}
{% include_relative settings.js %}
{% include_relative locales.js %}
{% include_relative mark-parents.js %}

{% if site.data.settings.redact == true %}
    {% include_relative redact.js %}
{% endif %}

{% if site.output == "web" or site.output == "app" %}

    {% comment %} This order is important. {% endcomment %}
    {% include_relative setup.js %}
    {% include_relative vendor/mark.min.js %}
    {% include_relative search-terms.js %}
    {% include_relative nav.js %}
    {% include_relative videos.js %}
    {% include_relative mcqs.js %}
    {% include_relative select-list.js %}
    {% include_relative tables.js %}
    {% include_relative footnote-popups.js %}
    {% include_relative slides.js %}
    {% include_relative show-hide.js %}
    {% include_relative copy-to-clipboard.js %}
    {% include_relative share.js %}

    {% if site.data.settings.web.svg.inject == true %}
        {% include_relative vendor/svg-inject.min.js %}
        {% include_relative svg-management.js %}
    {% endif %}

    {% comment %} Load after SVG management {% endcomment %}
    {% include_relative lazyload.js %}

{% endif %}

{% if site.output == "web" and site.build != "live" and site.data.settings.web.annotator.development == true %}
    {% include_relative annotation.js %}
{% elsif site.output == "web" and site.build == "live" and site.data.settings.web.annotator.live == true %}
    {% include_relative annotation.js %}
{% endif %}

{% comment %} Enable the content accordion in _data settings.yml,
and define its options in assets/accordion.js. This lets us
have different behaviour for web or app. {% endcomment %}
{% if site.output == "web" and site.data.settings.web.accordion == true %}
    {% include_relative accordion.js %}
{% elsif site.output == "app" and site.data.settings.app.accordion == true %}
    {% include_relative accordion.js %}
{% endif %}

{% comment %} Enable bookmarks in _data settings.yml,
and define options in assets/bookmarks.js. This lets us
have different behaviour for web or app. {% endcomment %}
{% if site.output == "web" and site.data.settings.web.bookmarks == true %}
    {% include_relative bookmarks.js %}
{% elsif site.output == "app" and site.data.settings.app.bookmarks == true %}
    {% include_relative bookmarks.js %}
{% endif %}

{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

    {% comment %} Load Prince-specific utilities. {% endcomment %}
    {% include_relative vendor/prince-box-info.js %}

    {% comment %}This script gives every heading a title attribute.
    This is useful to Prince, which can use title attributes for running heads.
    By default, we only load it for PDF outputs.{% endcomment %}
    {% include_relative heading-titles.js %}

    {% comment %}This script helps rotate large figures on the page.{% endcomment %}
    {% include_relative rotate.js %}

    {% comment %}This script moves endnotes to the bottoms of pages.{% endcomment %}
    {% include_relative footnotes.js %}

    {% comment %}This script shifts elements in the DOM.{% endcomment %}
    {% include_relative shift-elements.js %}

    {% comment %}This script detects the page number we are on and provides
    the relevant page cross-reference text as generated content.{% endcomment %}
    {% include_relative page-reference.js %}

    {% comment %} This aligns elements to a baseline grid. {% endcomment %}
    {% include_relative baseline-grid.js %}

{% endif %}

{% comment %} Tools for generating and displaying book indexes {% endcomment %}

    {% unless site.data.settings.dynamic-indexing == false %}

        {% comment %} Load the ebIndexTargets 'database'. {% endcomment %}
        {% include_relative index-loader.js %}

        {% comment %} Script to turn HTML comments into anchor targets.
        Also handled by gulp in PDF, epub; but included
        in all outputs so that Puppeteer can index. {% endcomment %}
        {% include_relative index-targets.js %}

        {% comment %} Script that adds index-reference links.
        This is done client-side in web and app, and pre-processed by gulp
        in PDF and epub outputs. {% endcomment %}
        {% if site.output == "web" or site.output == "app" %}
            {% include_relative index-lists.js %}
        {% endif %}

    {% endunless %}

{% comment %} Scripts for epub output. {% endcomment %}
{% if site.output == "epub" %}
    {% include_relative show-hide.js %}
{% endif %}
