---
title: Footnotes, endnotes and sidenotes
categories: editing
order: 6
---

# Footnotes, endnotes and sidenotes
{:.no_toc}

* Page contents
{:toc}

There are various options for notes.

## Endnotes

Endnotes appear at the end of a document (a web page or book chapter). In markdown these are usually called footnotes (because on the web they appear at the bottom of the web page). To create them in markdown, follow the [kramdown syntax for footnotes](https://kramdown.gettalong.org/syntax.html#footnotes):

*	put a `[^1]` where the footnote reference should appear (the `1` there can be any numbers or letters, and should be different for each footnote in a document);
*	anywhere in the document (we recommend after the paragraph containing the footnote reference), put `[^1]: Your footnote text here.`.

Endnotes – notes gathered at the end of each web page or book chapter – are the default.

## Footnotes

To create true bottom-of-page footnotes, as opposed to endnotes, use the same syntax as for endnotes above, but then add one of the following options to convert the endnotes to bottom-of-page footnotes.

- To convert all endnotes to footnotes for an **entire project** (a repo, series or collection), specify this in `_data/settings.yml`. E.g. for `print-pdf`:

  ```yaml
  print-pdf:
    notes: footnotes
  ```

- To convert all endnotes to footnotes in a **single markdown document** (e.g. a particular chapter), specify this in the document's YAML page frontmatter. E.g.:

   ``` md
   ---
   title: "Chapter One"
   notes: footnotes
   ---
   ```

- To convert a **a specific endnote** to a bottom-of-page footnote, add a `move-to-footnote` class to any part of it. For example, you can apply the class to the first paragraph in a note like this:

  ``` md
  [^20]: The text of the note.
         {:.move-to-footnote}
  ```

Note that converting endnotes to footnotes only affects PDF output. Web, epub and app outputs will still use endnotes.

> Technically, `footnotes.js` and `_pdf-notes.scss` convert endnotes completely from kramdown footnotes to [PrinceXML footnotes](https://www.princexml.com/doc-prince/#footnotes). They may look similar by default, but they are different elements and can be styled separately.
{:.box}

## Sidenotes

**Sidenotes** appear in a box to the side of the text. On wide screens, they float far right of the text. On narrower screens, the text wraps around them. In print, the text wraps around them, too. To create a sidenote, put a `*` at the start of the sidenote text and `*{:.sidenote}` at the end (with no spaces). (Technically, you're creating an `<em>` span with a kramdown IAL.)

In print, you can put **sidenotes at the bottom of the page**. By adding `.bottom` to the `{:.sidenote}` tag, your sidenote sits at the bottom of the page rather than on the right with text wrap, replicating a traditional footnote. So the markdown looks like this: `*This is a sidenote at the bottom of the page in print.*{:.sidenote .bottom}`. On screen, these are just regular sidenotes.

## Manual footnotes

To create footnote-like sidenotes manually, you can tag a reference and footnote-like text to create the bottom-of-page-footnote effect:

~~~
This is body text with a footnote at the end.[1](#fn-1){:.fnref #fnref-1}

[1](#fnref-1){:#fn-1}. This is the footnote text
{:.sidenote .bottom}
~~~

This markdown makes `1` a link in the body text, which points to the footnote text (ID `fn-1`). The number `1` at the footnote text is a link to the reference (ID `fnref-1`).

Unlike proper kramdown footnotes, these do not autonumber. You must manage the numbering or otherwise marking them manually. This means this is only suitable for books that have a few footnotes. The kramdown contributors are [looking into alternative syntax](https://github.com/gettalong/kramdown/issues/208) that will let you place a kramdown footnote anywhere in the text.
