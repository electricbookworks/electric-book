---
title: Using Javascript
categories: advanced
---

# Using Javascript
{:.no_toc}

* Page contents
{:toc}

Unless there's a good reason to put them elsewhere, scripts should live in `assets/js`, and be included in `bundle.js`, and not added separately. This is especially important in epubs. (More on [scripts in epubs below](#adding-scripts-to-epubs).

If you must add scripts that are not included in bundle.js, add them to your `<head>` elements by adding `<script>` tags to `_includes/head-elements.html`. And to add them just before the `</body>` tag, add `<script>` tags to `_includes/end-elements.html`.

For web outputs, you can also link to remote scripts this way, without the need to save the actual scripts in the `js` folder.

Keep in mind that anything you add to `head-elements.html` will be added to all books in the project folder, and to all their formats.

## Limiting scripts by book or format

To limit a script to a given book or format, wrap the script tag in [Liquid control flow tags](https://help.shopify.com/themes/liquid/tags/control-flow-tags). For instance:

{% raw %}
``` html
{% include metadata %}
{% if book-directory == "grapes-of-wrath" %}
<script src="{{ site.baseurl }}/assets/js/grapes-of-wrath.js"></script>
{% endif %}
```
{% endraw %}

(The `include metadata` tag fetches all kinds of information about the page, including which `book-directory` it's in.)

To limit a script to a given output format, use `site.output`, e.g.:

{% raw %}
``` html
{% if site.output == "print-pdf" or site.output == "screen-pdf" %}
<script src="{{ site.baseurl }}/assets/js/my-pdf-headers.js"></script>
{% endif %}
```
{% endraw %}

## Scripts in epub

All scripts to be used in your epub should be included in `assets/js/bundle.js`, and not added to pages as separate files. This is because you must not have any scripts in your epub that you aren't using, or it won't validate; and we only support including `bundle.js` in epub output.

If you don't want any Javsacript at all in your epub, you can disable it in `_data/settings.yml` by setting `epub` > `javascript` > `enabled` to `false`.You should then also exclude `assets/js/bundle.js` in the exclude list in `_configs/_config.epub.yml`, so that it doesn't build at all.

## Manipulating SVGs

To script SVG manipulation during `gulp` preprocessing, see ['SVG processing'](../images/svg-processing.html) in the Images section.
