---
title: Tables of contents
---

# Tables of contents
{:.no_toc}

A table of contents should be its own markdown file containing a list of the book's parts. Each list item should be a link to a location in the book – ideally a fragment identifier to ensure that print page references are always accurate. Here is a simple example:

~~~
---
title: Contents
style: contents-page
---

# Contents

1. [Chapter 1](1.html#chapter-1)
1. [Chapter 2](2.html#chapter-2)
~~~

For more advanced markup and styling, you may need to do more. In this example, each element is tagged.

~~~
---
title: Contents
style: contents-page
---

# Contents

1. [*Acknowledgements*{:.toc-chapter-title}](0-5-acknowledgements.html#acknowledgements){:.frontmatter-reference}
1. [*Preface*{:.toc-chapter-title}](text.html#preface){:.frontmatter-reference}
1. [*1*{:.toc-chapter-number} *Early Days in Mavambe*{:.toc-chapter-title}](text.html#early-days-in-mavambe)
1. [*2*{:.toc-chapter-number} *Baragwanath Hospital and Beyond*{:.toc-chapter-title}](text.html#baragwanath-hospital-and-beyond)
~~~

Note the `.frontmatter-reference` in particular: our default styles format that page number according to the style you set for the `$frontmatter-reference-style` variable in your print stylesheet. The other classes in this example are for custom formatting.

> Tip: We recommend using a numbered list, even though out default styles hide the numbers. This is to make it easier to convert your TOC to EPUB3, which requires that the `nav` element on your contents page contains only an ordered list.
{:.box}
