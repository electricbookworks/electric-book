---
layout: null
---

{% include_relative polyfills.js %}
{% include_relative nav.js %}
{% include_relative get-query-variable.js %}
{% include_relative mark.min.js %}
{% include_relative mark-search-terms.js %}
{% include_relative videos.js %}
{% include_relative mcqs.js %}

{% comment %} Enable the content accordion in _data settings.yml,
and define its options in assets/accordion.js {% endcomment %}
{% if site.output == "web" and site.data.settings.web.accordion == true %}
	{% include_relative accordion.js %}
{% elsif site.output == "app" and site.data.settings.app.accordion == true %}
	{% include_relative accordion.js %}
{% endif %}
