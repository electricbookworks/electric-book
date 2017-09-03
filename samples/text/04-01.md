---
title: "Links and buttons"
---

## Links and buttons

Links are pretty straightforward. How does [this link](http://electricbook.works) to the Electric Book website look? That link probably shouldn't show in the PDF version for print, or it should show in a useful way (like including the link in plain text).

Buttons are trickier. Basically, buttons should be defined by adding a `.button` class to any element. Ideally the theme allows for [inline buttons](http://example.com){:.button} and block-level buttons:

[Example](http://example.com)
{:.button}

{% raw %}
Again, the print version should have a way to deal with these. Alternatively, the book author can hide buttons in the print version. For instance, themes may support adding a `.non-printing` class to the element. Or the author can use Liquid control-flow tags, like `{% if site.output == "print" %}`, to control whether and how buttons appear in print.
{% endraw %}
