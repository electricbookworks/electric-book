---
title: Bibliographies
categories: editing
order: 9
---

# Bibliographies
{:.no_toc}

* Page contents
{:toc}

## Introduction

A bibliography is the list of sources a book draws on. In this template, you keep your references in a `bibliography.yml` file and pull them into a page with a single include. The template sorts them alphabetically for you, and the same list works in every format.

Because the references are stored as data, you can tag each one with the sections it belongs to. That lets you show a short reference list at the end of each chapter, a complete bibliography at the back of the book, or both, all from the same source.

## Creating the bibliography

Your bibliography lives in `_data/works/[book]/bibliography.yml`, where `[book]` is your book's directory. It's a YAML list, with one entry per source:

```yaml
- reference: "Coyle, Diane. 2014. *GDP: A Brief but Affectionate History*. Princeton, NJ: Princeton University Press."
  chapters:
    - "3"
- reference: "Kaas, J. 2000. 'Why is brain size so important'. *Brain and Mind* 1: 7–23."
  chapters:
    - "3"
    - "7"
```

Each entry has:

- `reference`: the formatted citation. Write it in whatever citation style your book uses. It's markdown, so you can italicise titles and add links. For a link whose full URL should print (useful in PDF), add the `{:.show-url}` class: `[title](https://example.com){:.show-url}`.
- `chapters`: a list of the sections this source is cited in. Use whatever labels suit your book – chapter numbers work well. Include an entry only in the sections where it's cited; the full bibliography page (see below) picks up every source regardless.

You don't need to worry about the order of entries in the file. The include sorts them alphabetically by reference, ignoring case and treating accented letters as their plain equivalents (so 'Öztürk' sorts under 'O', not after 'Z').

## Including a bibliography in the text

To list every source, add the include with no options:

```md
{% include bibliography %}
```

To list only the sources tagged with a particular section, pass its label as `chapter`:

```md
{% include bibliography chapter="7" %}
```

This shows only entries whose `chapters` list contains `7`. A common pattern is to call `{% include bibliography chapter="..." %}` at the end of each chapter, and a plain `{% include bibliography %}` on a full bibliography page.

You can also add `class="..."` to put a class on the list, for custom styling.

> Note: the include relies on the `ascii-version` include to sort references with accented characters correctly. If you see references with diacritics sorting to the end of the list, check that `_includes/ascii-version` is present.
{:.box}

## Translations

For a translated book, keep a `bibliography.yml` for each language at `_data/works/[book]/[language]/bibliography.yml`. The include uses the matching file automatically when you build a translation.
