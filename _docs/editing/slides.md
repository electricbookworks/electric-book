---
title: "Slides"
categories: editing
order: 5
---

# Slides
{:.no_toc}

* toc
{:toc}

Figures in slide sets use the same syntax as regular [figures]({{ site.baseurl }}/docs/editing/figures.html), except:

* each slide also has a title `title=""`
* each slide has a `slide-caption` instead of a regular figure `caption`
* you need an extra figure with `class="summary"` added. This can be the first figure in a slideline. This is the figure that is included in the print edition in full, and does not appear on the web. In print, the other slides appear as the text of their `title` and `slide-caption`.

In markdown, we create a slideline by grouping a sequence of figures in a div. Before the first figure add

`<div class="slides">`

and after the last figure add

`</div>`

The template's interactive slides were developed in partnership between [The CORE Project](https://www.core-econ.org) and [Electric Book Works](https://electricbookworks).
