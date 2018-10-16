---
title: "iFrames"
---

## iFrames

You can embed an iFrame in a book, for instance an embeddable quiz like [Betterquiz](https://github.com/electricbookworks/betterquiz).

At this stage, it's best to use Liquid control flow tags to show text-only alternatives in PDF and epub, and embedded iFrames only in web output.

{% if site.output == "web" %}

Here's an iFrame showing a quiz from a nursing textbook. How well do you know your Ebola prevention?

<iframe width="100%" height="400px" src="https://quiz.bettercare.co.za/?qz=63&amp;r=https://quiz.bettercare.co.za/login_form.php?qz=63"></iframe>

{% endif %}
