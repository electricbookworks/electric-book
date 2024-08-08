---
title: Page numbers
categories: layout
order: 4
---

# Page numbers
{:.no_toc}

* Page contents
{:toc}

In print output, the YAML header's `style` setting affects how the pages are numbered:

* all book parts set to `style: frontmatter-page` have roman-numeral page numbers by default (this can be changed in a custom design's CSS variables);
* all book parts set to `style: default-page` (or, since that's the default fallback, all those without a `style` setting) have decimal page numbers;
* all book parts set to `style: endmatter-page` (or, since that's the default fallback, all those without a `style` setting) have decimal page numbers;
* other book parts (e.g. `style: copyright-page`) have no page numbers (nor any other headers and footers).

So if you use `frontmatter-page` on a book-part (e.g. for a preface, foreword or acknowledgements section), by default it will have roman-numeral page numbers. And when the first `default-page` chapter starts, that chapter will have decimal page numbers.

However, the page numbering will increment consecutively from roman to decimal, unless you tell PrinceXML to start from 1 at the first chapter. That is, 'ix, x, 11, 12'. To reset the numbering to 1 at the start of the relevant chapter, you have two options:

1. Add the page class `.page-1` to the first element (e.g. the first heading) of the first chapter. In markdown, you do that with the tag `{:.page-1}` in the line immediately after the heading. This only works if that element is not set to `float` in the CSS. (That is, the element must appear in the normal flow of text.)
2. Add `page-1` to the `style` YAML setting. If there is no other `style` set there, you must also specify `default-page`. That is, the first chapter in your book should have the YAML style set as: `style: default-page page-1`.
