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

Note that an active variant applies to your *entire project*, not to a specific book. Then each book can have its own metadata, content and styles for a given project-wide variant.

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

You can list as many variants as you like in this way. The one that applies is the one set as the `active-variant` (see above). If no `active-variant` is set, then none of the variant stylesheets will apply on output.

## Variant metadata

Sometimes a variant has different metadata to its parent (such as a different subtitle or author), or contains different files.

You can define variant-specific metadata in a book's `_data` folder.

1. Create a new YAML file alongside the book's `default.yml` file. Name that new file after the variant, with a `.yml` extension. E.g. `myvariant.yml`.
2. In that new YAML file, define the variant's metadata as you would in default.yml. You only need to add fields for things that are different from `default.yml`. For example, if the only thing that changes is the subtitle, your variant YAML file will only contain one line, e.g. `subtitle: "The Jabberwocky Returns"`.

### Variant metadata fallbacks

If you are rendering a variant with translations, and you do not set a value in the translation variant YAML file, it will fall back to that language's `default.yml`. It will not fall back to the parent language's variant YAML.

For example:

- Parent-language default `subtitle`: `Potatoes`
- Parent-language variant `subtitle`: `Tomatoes`
- Translation default `subtitle`: `Pommes de terre`
- Translation variant `subtitle`: not set

When rendered, the translation variant `subtitle` will be `Pommes de terre`, and not `Tomatoes`.

## Variant tables of contents

Since tables of contents defined in YAML can be long and complex, it can be a hassle to redefine an entire TOC in a variant's YAML file just for one or two differences.

So, for TOCs, you can also change the TOC output for a variant by adding the names of the variants in which a TOC item should appear to the main book's TOC items nodes as `variants`. That node in the TOC will only appear when you output one of the listed variants. For example, this node will only appear in variants named `school` and `varsity`:

``` yaml
toc:
  ...
  label: "Study tips"
  file: "05-study-tips"
  variants: school, varsity
```

'Study tips' will not appear in default output.

If you want a TOC item to appear in both default outputs *and* specific variants, add `default` to the `variants` list here. E.g.

``` yaml
toc:
  ...
  label: "Study tips"
  file: "05-study-tips"
  variants: default, school, varsity
```

Now, in this example, 'Study tips' will appear in default outputs and the 'school' and 'varsity' variants, but not, say, the 'professional' variant (if you had such a variant in your project).
