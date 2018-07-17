---
title: Project metadata
categories:
  - setup
order: 20
---

# Project metadata

The most important file in your project is `meta.yml`, which is in the `_data` folder. The `meta.yml` file contains all kinds of information about your project and the books in it – that is, project metadata.

Before you can output your books you must make sure the `meta.yml` file contains the necessary information about them. For instance, you can't output a PDF unless you've defined which files should be included in the PDF.

The Electric Book template uses the data in `meta.yml` to populate and build navigation, tables of content, the parts of each book, translations, ISBNs and more.

**Tip**: You can see the `metadata` generated for any given page by using the `page-info` include on it. Simply add this tag to any page to include an output a summary of its metadata: {% raw %}`{% include page-info %}`{% endraw %}.
{:.box}

## YAML syntax

The `meta.yml` file is written in a syntax called YAML. At its simplest, YAML is just a list of values like this:

``` yaml
title: "Great Expectations"
creator: "Charles Dickens"
```

Importantly, you can nest information in YAML, so that information can be grouped. For example:

``` yaml
title: "Great Expectations"
products:
  print-pdf
  epub
```

In YAML, indentation *must* be accurate and *must* be created with spaces, not tabs. If a YAML file contains errors in indentation (or other syntax), your project will not output anything at all.

There are many subtle rules for structuring YAML, but if you just follow the existing structure in `meta.yml` carefully, you'll be fine. [Here is a good tutorial](https://learn.getgrav.org/advanced/yaml) on YAML, if you want to know more.

There is more detail on editing `meta.yml` in [Navigation and TOCs](tocs.html).
