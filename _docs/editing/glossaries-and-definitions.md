---
title: Glossaries and definitions
categories: editing
order: 7
---

# Glossaries and definitions
{:.no_toc}

* Page contents
{:toc}

## Introduction

A glossary is a list of terms and their definitions. In this template, you keep all of a book's definitions in one place – a `glossary.yml` file – and pull them into your text wherever you need them. You can show a single definition beside the paragraph that discusses it, or list the whole glossary on its own page.

The definitions adapt to the format. On the web, a defined term becomes a link that opens its definition in a popup. In print and epub, the definition sits in a box beside the paragraph, like a sidenote. Because the text and the definitions live in separate files, you write each definition only once, and you can translate them along with the rest of the book.

## Creating the glossary

Your glossary lives in `_data/works/[book]/glossary.yml`, where `[book]` is your book's directory (for example, `_data/works/samples/glossary.yml`). It's a YAML list, with one entry per term:

```yaml
- term: "market"
  definition: "A market lets people exchange goods and services for mutual benefit."
  cross-reference: ""
- term: "firm"
  definition: "An organization that hires labour to produce goods and services for sale."
  cross-reference: ""
```

Each entry has:

- `term`: the word or phrase being defined. This must match the tag you use in the text exactly (see below).
- `definition`: the definition itself. You can use markdown here.
- `cross-reference`: optional. Text here appears in italics after the definition, which is handy for a 'See also…' pointer.

You can also add an optional `example` field, which appears after the definition on its own line.

If a term has more than one common form – a singular and a plural, say, or an abbreviation – list the forms together in the `term`, separated by commas: `term: "trade union, labour union"`. Whatever you write here is what you'll use as the tag in the text.

## Defining a term in the text

Adding a definition to your content takes two steps: mark the term where it appears, and tell the template to fetch its definition.

First, mark the term inline using a kramdown IAL with a `data-term` attribute:

```md
The economy's **supply side**{:data-term="supply side"} is concerned with production.
```

The value of `data-term` must match the `term` in your glossary exactly, including any comma-separated variants.

Second, add a `definition` include just before the paragraph that contains the term:

```md
{% include definition term="supply side" %}

The economy's **supply side**{:data-term="supply side"} is concerned with production.
```

The include goes before the paragraph because, in print and epub, the definition box floats beside the text that follows it.

To define several terms that appear in the same paragraph, separate them with `|`:

```md
{% include definition term="market | firm" %}
```

The include takes two optional extras:

- `class="..."` adds a class to the definition box, for custom styling.
- `glossary=site.data.works.myotherbook.glossary` (note: no quotes) pulls definitions from a different glossary file.

## Listing the whole glossary

To print the entire glossary – for a glossary page at the back of the book, for instance – use the `glossary` include on its own:

```md
{% include glossary %}
```

This outputs every term and definition, sorted alphabetically. As with the `definition` include, you can point it at another file with `glossary=site.data.works.myotherbook.glossary`.

## Translations

If your book is translated, keep a glossary for each language at `_data/works/[book]/[language]/glossary.yml`. When you build a translation, both includes use the matching glossary automatically, so your defined terms and glossary page appear in the reader's language.
