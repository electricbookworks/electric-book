---
title: HTML transformations
categories: advanced
---

## HTML transformations

You may want to make universal changes to the HTML of your books just before they are output. These are called transformations.

The template already includes some transformations:

- For accessibility purposes, the `epubAriaSidenotes` transformation gives all elements with the class `sidenote` the ARIA attribute `role="note"`.
- We use transformations in PDF to generate QR codes from `include qr-code` tags.

Transformations are currently supported for epub and PDF outputs only.

To add a transformation for epub output, add a file containing a single function file to `_tools/gulp/transformations/epub`. You would do the same for PDF by adding a function file to `_tools/gulp/transformations/pdf`.

For guidance on the structure of the function, follow the existing files. For syntax, these functions use [Cheerio](https://cheerio.js.org/docs/api/classes/Cheerio#manipulation-methods).
