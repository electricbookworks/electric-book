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

## Add a new book from a Word file

When you're adding new text from a Word file, the commands and options you need to know about are these:

- The `new` command creates a new book.
- The `text` command processes a source file or existing book text.
- The `--source` option says which file to use, and it might be a .docx or a .md file.
- The `--split` option says whether to split the source file into smaller markdown files, and what character or characters in the source file to split at.

Here is a step-by-step guide with examples.

1. Put your Word doc in the `_source` folder.
2. The `--source` option specifies your Word doc. So to import it:
   - If you're creating a new book, run `npm run eb -- new --source myworddoc.docx`.
   - If you're adding to an existing book, run `npm run eb -- text --book existingbookname --source myworddoc.docx`

   In those examples, replace `myworddoc` with your .docx file's name, and `existingbookname` with the name of your existing book folder.
3. If you want to split a markdown file into separate files, run `npm run eb -- text --book existingbookname --source markdownfile.md --split`.

   Alternatively, you can add the `--split` argument to the `npm run eb -- new --source myworddoc.docx` command to split when importing it.

### The split marker

By default, the file will be split at each first-level heading marked with `#` in the document. You can specify a different string to split on, like `##`, by specifying it in quotes after `--split`, e.g. `--split '##'`.

The splitting process will add top-of-page YAML to each file it creates. If you've used `#`s as your marker, it will also add the `title:` to the top-of-page-YAML, using that heading's text.

You can use a different split marker. The marker can be any character or string of characters, as long as it is the first thing on its line. E.g. `--split '--split--'`. The remaining characters on the line will be used for the filename.

## Edit and design the book

2. Open `_data/works/[book]/default.yml` (where `[book]` is the name of your new book folder) and replace the sample information there with your project and book information.
3. In the book's folder, edit and add markdown files.
4. To change the design, edit the `.scss` files for each output format: set project-wide styles in `_sass`, and book-specific styles in `book/styles`. We suggest making all modifications in `_sass/custom`.

There is much more detail in [the docs](../).
