---
title: Electric Book documentation
style: contents-page
---

# Electric Book documentation

<ul>
{% for page in site.docs %}
{% assign docs-filename = page.url | remove: ".html" | split: "/" | last %}
{% unless docs-filename == "index" %}
	<li><a href="{{ page.url }}">{{ page.title }}</a></li>
{% endunless %}
{% endfor %}
</ul>
