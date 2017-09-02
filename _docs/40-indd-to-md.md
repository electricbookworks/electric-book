---
title: Converting from InDesign
---

# Converting from InDesign
{:.no_toc}

* toc
{:toc}

## Suggested steps

This is what we do when we convert one of our textbooks from a traditional InDesign workflow to markdown for this workflow. You'll probably develop your own process for turning existing books into markdown. Maybe this will help.

1. Open the InDesign file and copy all the text.
1. Paste the text with formatting into your text editor.
1. Search and replace (S&R) all line breaks with double line breaks:
	* Tick 'Regular expression' (because you're using the regex `\n` to mean 'line break', not actually searching for the characters 'slash' and 'lowercase en').
	* Find `\n`
	* Replace with `\n\n`
1. Comparing to a laid-out, up-to-date version of the book, mark all headings with markdown's heading hashes (#) according to their heading level. E.g.:
	* `h1` = `#`
	* `h2` = `##`
	* `h3` = `###`, and so on.
1. At the same time, you may want to manually create Markdown lists using `*` for bullets and `1.` , `2.` , `3.` etc. for numbered lists. Note that list indents can get complicated, so check previous chapters and test your markdown-to-HTML conversion when you hit a tricky one (e.g. a note inside a bullet list nested inside a numbered list).
1. Add Markdown image references. See the images section below for detail on how best to do this.
1. Search for every instance of italic, bold and bold-italic, and manually mark these in markdown with asterisks: in markdown, `*one asterisk*` is *italic*, `**two**` is **bold**, and `***three***` is ***bold-italic***. Remember that in some fonts, italic and bold may have different names in InDesign, like 'oblique' and 'black'.
1. Look out for special characters, especially degree symbols (°), superscripts and subscripts. It's best to search the InDesign document (search by style and basic character formats, e.g. 'Position' for superscript and subscript) for these instances so you don't miss any. Most superscripts and subscripts in InDesign and similar are created by formatting normal text. In text-only, there is no formatting, so you should use the [unicode character for each superscript or subscript character](http://en.wikipedia.org/wiki/Unicode_subscripts_and_superscripts). E.g. when typing the symbol for oxygen, O₂, the subscript 2 is ₂, unicode character U+2082. To type these characters, you may need special software (e.g. for Windows, Google unicodeinput.exe), or copy-paste from [an online reference](http://scriptsource.org/cms/scripts/page.php?item_id=character_list&key=2070). In Windows, you can also find symbols in Character Map, e.g. search in Character Map for 'Subscript Two'.

## Search-and-replace in InDesign

InDesign is great for prepping text you've received in InDesign or Word, because it has very powerful search-and-replace. In particular, it's worth getting to know GREP search-and-replace. The learning curve is steep, but your conversions will be much faster once you've mastered GREP. [Here are some GREP learning resources](http://indesignsecrets.com/resources/grep).

For instance, if you want to convert all italics to markdown:

1. In the Find dialog, choose GREP.
2. Click in the Format box and set the font style to Italic.
3. In the Find box, search for `(.+)`.
4. In the Replace box, replace with `*$1*`.

Remember that search-and-replace is rarely flawless, so proceed with caution. For instance, regarding italics: in markdown, it's very important that the starting `*` and ending `*` that mark the italics are right up against the words they wrap. I.e.:

* Correct: `I want to *emphasise* this.`
* Incorrect: `I want to *emphasise *this.`

However, many (human) editors often mark the spaces on either side of a word as italic, probably because clicking and dragging with a mouse can be inaccurate, and because double-clicking a word often highlights the word as well as the space after it. This means that when we automate 'search for italics and wrap with `*`', we end up wrapping the space into the markdown as well. Also, sometimes spaces in the manuscript are italic, even though the words on either side of the space are not (this is probably caused by editing or pasting phrases that were once italic). In Word and InDesign, you'd never spot those italic spaces by eye. But in the markdown, you end up with this:

`I went to* *the shops.`

Markdown reads that is meaning that there is an actual asterisk after 'to', and italics start from 'the' and continue (at least) to the end of the paragraph:

I went to* *the shops.*

These problems have to be fixed with a combo of clever searches and manual spotting.

The same thing happens with bold, but luckily bold is usually used more sparingly than italic, and is therefore easier to fix manually.
