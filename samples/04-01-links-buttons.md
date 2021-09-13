---
title: "Links and buttons"
---

## Links and buttons

Links are pretty straightforward. For instance, you might link to [the Electric Book template](https://ebw.co/template){:.show-url}.

{% unless site.output == "print-pdf" or site.output == "screen-pdf" %}
In print, that link shows in brackets after the linked text.
{% endunless %}

Buttons should be defined by adding a `.button` class to any element, such as a link. The template allows for [inline buttons](https://example.com){:.button} and block-level buttons:

[Example](https://example.com)
{:.button}

{% raw %}
Again, the print version should have a way to deal with these. Alternatively, the book author can hide buttons in the print version. For instance, themes may support adding a `.non-printing` class to the element. Or the author can use Liquid control-flow tags, like `{% if site.output == "print-pdf" %}`, to control whether and how buttons appear in print.
{% endraw %}
