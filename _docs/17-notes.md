---
title: Footnotes, endnotes and sidenotes
---

# Footnotes, endnotes and sidenotes

Our default theme provides three options for notes.

**Footnotes** appear at the end of a document (web page or book chapter). In book parlance, they are therefore actually endnotes, but we call them footnotes because that's what kramdown calls them. To create them in markdown, follow the [kramdown syntax for footnotes](http://kramdown.gettalong.org/syntax.html#footnotes):

*	put a `[^1]` where the footnote reference should appear (the `1` there can be any numbers or letters, and should be different for each footnote in a document);
*	anywhere in the document (we recommend after the paragraph containing the footnote reference), put `[^1]: Your footnote text here.`.

**Sidenotes** appear in a box to the right of the text. On wide screens, they float far right of the text. On narrower screens, the text wraps around them. In print, the text wraps around them, too. To create a sidenote, put a `*` at the start of the sidenote text and `*{:.sidenote}` at the end (with no spaces). (Technically, you're creating an `<em>` span with a kramdown IAL.)

In print, you can put **sidenotes at the bottom of the page**. By adding `.bottom` to the `{:.sidenote}` tag, your sidenote sits at the bottom of the page rather than on the right with text wrap, replicating a traditional footnote. So the markdown looks like this: `*This is a sidenote at the bottom of the page in print.*{:.sidenote .bottom}`. On screen, these are just regular sidenotes.

To create footnote-like sidenotes, you can tag a reference and footnote-like text to create the bottom-of-page-footnote effect:

~~~
This is body text with a footnote at the end.[1](#fn-1){:.fnref #fnref-1}

[1](#fnref-1){:#fn-1}. This is the footnote text
{:.sidenote .bottom}
~~~

This markdown makes `1` a link in the body text, which points to the footnote text (ID `fn-1`). The number `1` at the footnote text is a link to the reference (ID `fnref-1`).

Unlike proper kramdown footnotes, these do not autonumber. You must manage the numbering manually. This means this is only suitable for books that have a few footnotes. The kramdown contributors are [looking into alternative syntax](https://github.com/gettalong/kramdown/issues/208) that will let you place a kramdown footnote anywhere in the text.
