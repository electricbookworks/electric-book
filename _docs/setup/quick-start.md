---
title: Quick start
categories: setup
order: 0
---

# Quick start

This quick setup assumes you already have [Jekyll](https://jekyllrb.com/), [Node](https://nodejs.org/) and [Prince](https://www.princexml.com/) (for PDF output) installed. If not, see [setup guidance here](setting-up-your-computer).

## Create a new project

1. Download `electric-book.zip` from the [latest release](https://github.com/electricbookworks/electric-book/releases/latest) and extract it.
2. In the extracted `electric-book` folder, run `npm run electric-book` to see available commands and options.
3. Run `npm run electric-book -- install` first. You should only need to do this once.
4. Run `npm run electric-book -- output` script to serve a website of your project.

   The template includes two books:
   - `book`: a bare-bones book to start working in; and
   - `samples`: a long book containing loads of examples.

## Edit your first book

2. Open `_data/works/book/default.yml` and replace the sample book information there with your project and book information.
3. In the `book` folder, overwrite the template's markdown files with your own.
4. To change the design, edit the `.scss` files for each output format: set project-wide styles in `_sass`, and book-specific styles in `book/styles`. We suggest making all modifications in `_sass/theme`.

There is much more detail in [the docs](../).
