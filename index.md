---
title: Series home
style: home
---

# {{ site.data.meta.series.name }}

{{ site.data.meta.series.description }}

{% for book in site.data.meta.titles %}
*[{{ book[1].title }}]({{ book[0] }}/{{site.start-page}}.html)*
{% endfor %}
