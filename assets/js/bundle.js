---
# A bundle of scripts.
# Jekyll will assemble and populate these.
layout: null
---

{% include_relative polyfills.js %}
{% include_relative locales.js %}

{% if site.output == "web" or site.output == "app" %}

    {% comment %} This order is important. {% endcomment %}
    {% include_relative mark.min.js %}
    {% include_relative search-terms.js %}
    {% include_relative nav.js %}
    {% include_relative videos.js %}
    {% include_relative mcqs.js %}

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


{% if site.output == "print-pdf" or site.output == "screen-pdf" %}

    {% comment %}This script gives every heading a title attribute.
    This is useful to Prince, which can use title attributes for running heads.
    By default, we only load it for PDF outputs.{% endcomment %}
    {% include_relative heading-titles.js %}

    {% comment %}This script helps rotate large figures on the page.{% endcomment %}
    {% include_relative rotate.js %}

    {% comment %}This script detects the page number we are on and provides
    the relevant page cross-reference text as generated content.{% endcomment %}
    {% include_relative page-reference.js %}

{% endif %}
