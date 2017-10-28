---
title: Using Javascript
categories: technical
---

# Using Javascript

Unless there's a good reason to put them elsewhere, scripts should live in `assets/js`.

To add them to your `<head>` elements, add `<script>` tags to `_includes/head-elements`. 

To add them just before the `</body>` tag, add `<script>` tags to `_includes/end-elements`. 

You can also link to remote scripts here, without the need to place the actual scripts in the `js` folder.

Keep in mind that anything you add to `head-elements` will be added to all books in the series folder, and to all their formats.

## Limiting scripts by book or format

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

## Adding scripts to epubs

Scripts in epub are special. While web and PDF scripts should be in `/assets/js`, all scripts to be used in your epub should be in `_epub/js`. This is because you must not have any scripts in your epub that you aren't using, or it won't validate. By keeping epub scripts separate, this is easier to manage.

Also, epub scripts must have a YAML frontmatter block, even if it's empty:

```
---
---
```

This block tells Jekyll to process the script, which means it knows about it, which our eupb package needs to be able to include in the manifest.

Finally, if you're adding scripts to your pages, set `epub-scripts: true` in `_data/settings.yml`. This flags your pages as `scripted` in the epub manifest, which is required for validation.

### Linking to scripts for epub

In the finished epub, these scripts will end up in a `js` folder alongside `text`, `styles`, `images` and `fonts`. So all links to scripts that you want to include in epub output should be in `site.output == "epub"` tags and relative to `text`:

{% raw %}
```
{% if site.output == "epub" %}
<script src="../js/foo.js"></script>
{% endif %}
```
{% endraw %}
