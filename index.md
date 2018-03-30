---
title: Home
style: home
---

# The Electric Book workflow

The Electric Book workflow is a set of processes and tools for making high-quality PDF, epub, website and app versions of books from a single content source. It's designed for professional book production, and lets team members collaborate on projects remotely.

At its heart is the [Electric Book Jekyll template](https://github.com/electricbookworks/electric-book), which you're looking at now. This template includes an [almost blank book](book) to work into, a book of [sample features and typography](samples), and [documentation](docs).

{% include metadata %}
{% if output-docs == true %}
[Read the docs]({{ site.baseurl }}/docs)
{:.button}
{% endif %}

The Electric Book workflow is maintained at [Fire and Lion](http://fireandlion.com), who also provide paid book-hosting and support plans for publishers.
{:#support}

<!-- Remove these comment tags to activate a project home page for your book project

{% include metadata %}

# {{ project-name }}

{{ project-description }}

{% for book in site.data.meta.works %}
*[{{ book.title }}]({{ book.directory }}/text/{{ book.products.web.start-page }}.html)*
{% endfor %}

-->
