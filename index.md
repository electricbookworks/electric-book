---
title: Home
style: home
---

# The Electric Book workflow

The Electric Book workflow is a set of processes and tools for making high-quality print PDF, screen PDF, epub, website and app versions of books from a single content source. It's designed for professional book production, and lets team members collaborate on projects remotely.

At its heart is the [Electric Book Jekyll template](https://github.com/electricbookworks/electric-book), which you're looking at now. This template includes:

- an [almost blank book](book/text/0-3-contents.html) to work into,
- a book of [sample features and typography](samples/text/00-05-contents-page.html),
- a [sample translation](samples/fr/text/00-05-contents-page.html), and
- {% if site.output == "web" %}[documentation](docs/index.html){% else %}[online documentation](http://electricbook.works/docs/index.html){% endif %}.

{% include metadata %}
{% if output-docs == true %}
[Read the docs]({{ site.baseurl }}/docs)
{:.button}
{% endif %}

## Key features

- Output print PDF, screen PDF, epub, website and app versions of books from the same content source.
- Create a series or collection of book in one website or app. They can share common features, [metadata]({{ site.baseurl }}/docs/setup/metadata.html), and [common content snippets]({{ site.baseurl }}/docs/setup/repeatable-items.html).
- Learn [how to edit in markdown]({{ site.baseurl }}/docs/editing/markdown.html) in the docs.
- Use [predefined tags]({{ site.baseurl }}/docs/editing/classes.html) for common book features.
- Quickly change many design features with [simple design configurations]({{ site.baseurl }}/docs/layout/design.html).
- [Manage translations]({{ site.baseurl }}/docs/setup/translations.html) in the same project.
- Easily [localise]({{ site.baseurl }}/docs/setup/translations.html) website editions.
- Create [variant editions]({{ site.baseurl }}/docs/setup/variants.html) with different content or designs.
- [Enable open annotation]({{ site.baseurl }}/docs/setup/settings.html#annotation) on website editions with [Hypothesis](https://hypothes.is).
- Include interactive [multiple-choice questions]({{ site.baseurl }}/docs/editing/multiple-choice-questions.html).
- [Control letter-spacing]({{ site.baseurl }}/docs/editing/classes.html#formatting) in individual paragraphs for page refinement.
- [Include complex maths]({{ site.baseurl }}/docs/editing/maths.html) using LaTex notation.
- Easily [embed streaming video]({{ site.baseurl }}/docs/editing/video.html) from YouTube or Vimeo.
- Make long pages/chapters [collapse on major headings]({{ site.baseurl }}/docs/layout/content-accordion.html) for easier reading.
- Support for [remote media]({{ site.baseurl }}/docs/images/external-media.html) and [expansion files]({{ site.baseurl }}/docs/output/app-output.html#android) for projects with many images.
- [Automatically convert master images]({{ site.baseurl }}/docs/images/image-conversions.html) to output-optimised sizes and color profiles.
- Easily [control colour and PDF profiles]({{ site.baseurl }}/docs/layout/colour-profiles.html) for high-quality printing.
- Easily [build and refresh search indexes]({{ site.baseurl }}/docs/setup/search-indexes.html) for searching websites and apps.
- [Export to MS Word]({{ site.baseurl }}/docs/output/word-output.html).

The Electric Book workflow is maintained at [Electric Book Works](http://electricbookworks.com), who also provide paid book-hosting and support plans for publishers.
{:#support}

<!-- Remove these comment tags to activate a project home page for your book project

{% include metadata %}

# {{ project-name }}

{{ project-description }}

{% for book in site.data.meta.works %}
*[{{ book.title }}]({{ book.directory }}/text/{{ book.products.web.start-page }}.html)*
{% endfor %}

-->
