---
title: Tables
categories: editing
order: 3
---

# Tables
{:.no_toc}

* Page contents
{:toc}

Kramdown (and most markdown variants) can only handle very simple tables. For these you can create the Markdown layout manually. See [the chapter on markdown](markdown.html#simple-tables) for guidance on formatting simple tables.

You can also use online tools to convert tables into a markdown format.

* [Senseful](https://senseful.github.io/text-table/). For instance, working from InDesign:
    - Click and drag over some cells in the InDesign table (not the header row). Then Ctrl+A to select the whole table.
    - Ctrl+C to copy, then paste into a blank spreadsheet.
    - Select all the relevant cells in your spreadsheet, and copy. The table text is now on your clipboard, with the cells separated by tabs.
    - Paste into the online Format Text as Table Input field.
    - Click 'Create Table'. (The default settings are usually fine. Play with them only if you need to.)
    - Copy the Output and paste it into your markdown file.
* [Ascii Table](https://ozh.github.io/ascii-tables/):
    - Paste tab-delimited table text
    - Select 'GitHub Markdown' for the output style
    - Copy the resulting plain-text table into your markdown.

Table formatting in markdown can differ between flavours of markdown. You may need to tweak it. For instance, Senseful starts some table borders with + where kramdown needs a \|. In that case, manually change the starting + in any row with a \|.

## Complex tables with HTML

For complex tables – anything with merged cells, for instance – you must create an HTML table and paste that HTML (from `<table>` to `</table>`) into your markdown files. It's easiest to use a [WYSIWYG HTML editor](https://en.wikipedia.org/wiki/List_of_HTML_editors#WYSIWYG_editors). For instance, Dreamweaver lets us paste a table from a formatted source like Word or LibreOffice, and then clean up the HTML easily before pasting the whole `<table>` element into our markdown document.

## Table captions

In markdown, add `{:.table-caption}` in the line immediately after a table caption paragraph. This applies the class `table-caption` to the paragraph, which the theme can style. For instance, the template's default styles avoid a page break after the caption, before the table. (According to publishing best-practice, table captions must always appear above tables, not after them.)
