---
title: Project metadata
categories:
  - setup
order: 20
---

# Project metadata

Lots of crucial information (i.e. metadata) about your project is in `_data/works`.

Before you can output your books you must make sure the files in `_data/works` contain the necessary information about them. For instance, you can't output a PDF unless you've defined which text files should be included in that PDF.

The Electric Book template uses the data in `_data/works` to populate and build navigation, tables of content, the parts of each book, translations, ISBNs and more.

**Tip**: You can see the `metadata` generated for any given page by using the `page-info` include in its markdown. Simply add this tag to any page to generate a summary of its metadata: {% raw %}`{% include page-info %}`{% endraw %}.
{:.box}

## YAML syntax

The files in `_data/works` are written in a syntax called YAML, and have `.yml` file extensions. At its simplest, YAML is just a list of values like this:

``` yaml
title: "Great Expectations"
creator: "Charles Dickens"
```

Importantly, you can nest information in YAML, so that information can be grouped. For example:

``` yaml
products:
  print-pdf:
    format: "Print"
  epub:
    format: "Digital download"
```

In YAML, indentation *must* be accurate and *must* be created with exactly two spaces, not tabs. If a YAML file contains errors in indentation (or other syntax), your project will not output anything at all.

There are many subtle rules for structuring YAML, but if you just follow the existing structure in `_data/works` carefully, you'll be fine. [Here is a good tutorial](https://learn.getgrav.org/advanced/yaml) on YAML, if you want to know more.

There is more detail on editing the YAML files in `_data/works` in [Navigation and TOCs](tocs.html).
