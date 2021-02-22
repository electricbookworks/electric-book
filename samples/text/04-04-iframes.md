---
title: "iFrames"
---

## iFrames

You can embed an iFrame in a book, for instance an embeddable quiz like [Betterquiz](https://github.com/electricbookworks/betterquiz).

At this stage, it's best to use Liquid control flow tags to show text-only alternatives in PDF and epub, and embedded iFrames only in web output.

{% if site.output == "web" %}

Here's an iFrame showing the modern book production process.

<iframe src="https://electricbookworks.github.io/modern-book-production/index.html" class="modern-book-production" title="Modern Book Production" width="100%" height="500px"></iframe>

{% endif %}
