---
title: Variants
categories: setup
order: 50
---

# Variants
{:.no_toc}

* Page contents
{:toc}

For most books, the default outputs (`print-pdf`, `screen-pdf`, `web`, `epub`, `app`) are sufficient. You only need one version of each of those. But sometimes you need a variation on one or more of these. For instance, you might be producing two versions of a printed book with different designs (e.g. for schools and for trade) with different selections of chapters. Or you may be white-labelling a website, and need to output various versions with different colours or logos. Variants make that possible.

## Activating a variant

To activate a variant, put its name as the `active-variant` in `settings.yml`. Make sure you deactivate it, for instance by commenting it out, to get your default output back.

## Variants in markdown

If you only want certain content to display in a specific variant, wrap that content in a `if variant` tag. For example:

{% raw %}
```md
{% if variant == "myvariant" %}
This content will only output when the active-variant is `myvariant`.
{% endif %}
```
{% endraw %}

For the `variant` tag to work, you must include the page's metadata at the start of the markdown document. After the YAML frontmatter (the `---`s), add:

{% raw %}
```md
{% include metadata %}
```
{% endraw %}

## Variant stylesheets

You can create new stylesheets in addition to our standard ones, and specify these in `_data/settings.yml` file, like this:

``` yaml
variants:
  - variant: myvariant
    print-pdf-stylesheet: "print-pdf-myvariant.css"
    web-stylesheet: "web-myvariant.css"
  - variant: anothervariant
    app-variant-stylesheet: "app-anothervariant.css"
```

## Variant metadata

You can define variant-specific metadata in `_data/meta.yml` in the same way you'd create metadata for a [translation](translations.html), by creating a `variants` node in a `work` containing all the same metadata you would for the `work`. Except instead of setting a `directory`, you set a `variant`, which matches the name of the variant you created in `settings.yml`. This can include things like `identifier`s, `files` lists, and `toc` and `nav` nodes. For example:

``` yaml
    variants:
      - variant: myvariant
        identifier: "9781234567890"
        products:
          epub:
            identifier: "9780987654321"
```

## Variant tables of contents

For TOCs, you can also change the TOC output for a variant by adding the names of the variants in which a TOC item should appear to the main book's TOC `item` node as `variants`. This makes sure that that node in the TOC only outputs when outputting one of the listed variants. For example:

``` yaml
toc:
  label: "Study tips"
  file: "05-study-tips"
  variants: school, varsity
```

When an `active-variant` is defined in `_data/settings`, and the default `toc` or `nav` are output, any items that do *not* include the `active-variant`'s name in its `variants` list will *not* be output.

This can be much easier to maintain than creating a whole new `toc` node to the variant's metadata, which would mostly be a straight duplication of the default output.
