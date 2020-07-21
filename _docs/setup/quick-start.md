---
title: Quick start
categories: setup
order: 0
---

# Quick start

This quick setup assumes you already have [Jekyll](http://jekyllrb.com/), [Node](https://nodejs.org/) and [Prince](http://www.princexml.com/) (for PDF output) installed. If not, see [setup guidance here](setting-up-your-computer).

## Create a new project

1. Download `electric-book.zip` from the [latest release](https://github.com/electricbookworks/electric-book/releases/latest) and extract it.
2. In the extracted `electric-book` folder, run the `run-` script for your operating system.

   (On OSX and Linux, you need to [give it permission first](http://stackoverflow.com/a/5126052/1781075).)

3. Choose the 'Install or update dependencies' option first. You should only need to do this once.
4. Run the `run-` script to generate a book.

   The template includes two books:
   - `book`: a bare-bones book to start working in; and
   - `samples`: a long book containing loads of examples.

## Edit your first book

2. Open `_data/meta.yml` and replace the sample book information there with your project and book information.
3. In `book/text`, overwrite the template's markdown files with your own.
4. To change the design, edit the `.scss` files for each output format: set project-wide styles in `_sass`, and book-specific styles in `book/styles`.

There is much more detail in [the docs](../).
