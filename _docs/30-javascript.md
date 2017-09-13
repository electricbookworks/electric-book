---
title: Using Javascript
---

# Using Javascript

Unless there's a good reason to put them elsewhere, scripts should live in `assets/js`.

To add them to your `<head>` elements, add `<script>` tags to `_includes/head-elements`. 

To add them just before the `</body>` tag, add `<script>` tags to `_includes/end-elements`. 

You can also link to remote scripts here, without the need to place the actual scripts in the `js` folder.

Keep in mind that anything you add to `head-elements` will be added to all books in the series folder, and to all their formats.

To limit a script to a given book or format, wrap the script tag in [Liquid control flow tags](https://help.shopify.com/themes/liquid/tags/control-flow-tags). For instance:

{% raw %}
```
{% include metadata %}
{% if book-directory == "grapes-of-wrath" %}
<script src="{{ site.baseurl }}/assets/js/grapes-of-wrath.js"></script>
{% endif %}
```
{% endraw %}

(The `include metadata` tag fetches all kinds of information about the page, including which `book-directory` it's in.)

To limit a script to a given output format, use `site.output`:

{% raw %}
```
{% if site.output == "print-pdf" %}
<script src="{{ site.baseurl }}/assets/js/print-headers.js"></script>
{% endif %}
```
{% endraw %}
