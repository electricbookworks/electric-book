---
title: Electric Book documentation
style: contents-page
---

# Electric Book documentation

These docs explain how to set up the Electric Book template, how to edit book files, and how to output books. The template includes the docs, so that any Electric Book includes the docs for its own version (this is version {{ site.version }}).

These docs are a work in progress, and not everything is documented yet. You can [contribute on GitHub](https://github.com/electricbookworks/electric-book), or let us know about problems by [logging issues](https://github.com/electricbookworks/electric-book/issues).

<ul>
{% for page in site.docs %}
{% assign docs-filename = page.url | remove: ".html" | split: "/" | last %}
{% unless docs-filename == "index" %}
	<li><a href="{{ site.baseurl }}{{ page.url }}">{{ page.title }}</a></li>
{% endunless %}
{% endfor %}
</ul>
