---
title: Series home
style: home
---

{% include metadata %}

# {{ series-name }}

{{ series-description }}

{% for book in site.data.meta.works %}
*[{{ book.title }}]({{ book.directory }}/text/{{ book.products.web.start-page }}.html)*
{% endfor %}
