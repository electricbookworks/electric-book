---
title: Markdown
---

# Markdown
{:.no_toc title="Markdown"}

* toc
{:toc}

This guide explains how to edit text for the workflow. On its own, it's also a handy guide to markdown in general.

If you get your markdown right, the workflow can zap out an almost-print-ready PDF, website or ebook from your files in a matter of minutes. That is, we go straight from edited manuscript to page proofs – no typesetting! 

To edit for the workflow, you need to have a rough idea how HTML works, and you need to learn markdown. If you're new to HTML and markdown, don't worry: it's much easier than you think.

## How HTML works

HTML is a computer language. It's a way for us to mark up or tag text, so that a computer knows how to display it beautifully to humans. That is, software (most commonly a web browser) reads the HTML code and *renders* it as nice-looking, readable text and images.

In HTML, each piece of content (e.g. a paragraph) starts and ends with a tag that a computer can recognise. Tags are always in elbow brackets, like this paragraph tag: `<p>`. 

~~~
<p>
This text is tagged in HTML as a paragraph.
</p>
~~~

The slash 'closes' the tag.

The `<p>` tag is one of about a hundred possible tags, maybe ten of which you'll see in a book, such as tags for headings (e.g. `<h1>`, `<h2>`), bold and italic, lists, images, tables, and blockquotes.

But not all paragraphs are the same: there are opening paragraphs, pull-quote paragraphs, blurb paragraphs and more. If I want to tell the computer what *kind* of paragraph it is, I can put it in a special class. Say, the 'blurb' class of paragraph. To write this in HTML, I would make the tag `<p class="blurb">`. Unlike its limited set of specific tags, HTML classes are infinite, because we can make up class names as we need them.

HTML is very simple and very powerful (which is why it's the language behind almost every web page). We can mark up everything in a book using HTML tags and classes. In our workflow, we store books in HTML, with each book part (title page, contents page, chapter, etc.) in its own HTML file.

Then, to create print-ready PDFs, websites and ebooks from that HTML, we combine the files with CSS stylesheets. CSS is another computer language that defines design: font sizes, indentation, colour, etc. A CSS file will say 'make all headings bold', for instance, or 'indent blockquotes by 1em'.

If we combine a book's HTML with a stylesheet designed for print, we can get a print-ready PDF. If we combine the same HTML with a stylesheet for the web, we get the book as a website. This way, we only ever store the book's content once, and use different stylesheets to generate alternative editions from that single source.

Unfortunately HTML tags are very, very time consuming to type by hand. But we have a shortcut! It's called markdown, and it's amazing.

## How markdown works

[Markdown](https://en.wikipedia.org/wiki/Markdown) is just plain text, neatly structured. Plain text as in `.txt` files. It's so neatly structured that software can work out, just from the structure of your text, what HTML you intended, and convert it instantly to finished HTML, tags and all. No way! Yes way.

Markdown was invented by two very smart people in 2004: [John Gruber](http://daringfireball.net/projects/markdown/) and Aaron Swartz. Since their work, others have added new features to markdown. So today there are many variations of markdown. We use a variation called kramdown.

As you work with markdown, you'll get to know it really well. That can take as little as a few hours. And hopefully you'll come to love it as much as we do. To do that, you'll need to keep the [kramdown syntax reference](http://kramdown.gettalong.org/syntax.html) handy. For now, though, we'll explain the most common, important things you'll need to edit simple books.

To quickly test any basic markdown yourself, go to [http://kramdown.herokuapp.com](http://kramdown.herokuapp.com/). Type markdown in the left, and see the rendered HTML on the right.

### Paragraphs

This is easy: a paragraph is a line of text separated from any other text by empty lines.

You can even have line breaks in a paragraph, and markdown will just ignore them (or, rather, replace them with spaces). That is, markdown is looking for an empty line before it ends a paragraph.

~~~
This is a paragraph.

This is another
paragraph.
~~~

Result:

This is a paragraph.

This is another
paragraph.

### Headings

You can use up to six levels of heading, from level one to level six. To make a heading, just put one or more hash signs, `#`, and a space, before the heading. For a first-level heading, use one hash sign; for a second-level heading, use two; and so on. Like with paragraphs, separate the heading from everything else with an empty line space.

~~~
## This is a second-level heading

This is a paragraph.
~~~

### Italics

Just put `*` before and after the italicised words: `is it really *this* easy?`. It's really *this* easy.

### Bold

Just put two `*`s before and after the bold text: `good for **shouting**`. **Shouting.**

Tip: If you use bold in a first-level heading (e.g. `# **Chapter 1** Lost at Sea`), our Classic theme's typography will put that bold text onto its own line, set off from the heading. This is useful for chapter numbers that should look separate from the chapter title, but in the underlying HTML need to be part of the heading, for instance when software generates tables of contents.
{:.sidenote}

### Lists

There are two kinds of lists: bulleted and numbered. For a bulleted list, start each line with a `*` and a tab. For a numbered list, start each line with a number, a full stop and a tab (you can use any number, because the software will always create an HTML list that starts with 1; but it's best to use 1 or the actual numbers you intend, just to make things neat). Markdown:

~~~
1.	Apples
2.	Oranges
3.	Pears

*	Apples
*	Oranges
*	Pears
~~~

Result:

1.	Apples
2.	Oranges
3.	Pears
 
*	Apples
*	Oranges
*	Pears

### Simple tables

You can create simple tables in markdown. You can make them really neat, or you can make them really efficient. Markdown:

~~~
| Fruit   | Quantity |
|---------|----------|
| Apples  | 2        |
| Oranges | 5        |
| Pears   | 0        |

| Fruit | Quantity
|---|---
| Apples | 2
| Oranges | 5
| Pears | 0
~~~

Result:

| Fruit   | Quantity |
|---------|----------|
| Apples  | 2        |
| Oranges | 5        |
| Pears   | 0        |

| Fruit | Quantity
|---|---
| Apples | 2
| Oranges | 5
| Pears | 0

Note the minimum three hyphens in the lines that creates the border between the table head and table body. (Kramdown doesn't require three, but GitHub previews do, so it's best practice.)
{:.sidenote}

To make more complex tables with merged or individually styled cells, you have to use actual HTML table markup. See the [Tables](18-tables.html#tables) chapter for more detail.

### Blockquotes

Remember how old email programs put a `>` at the start of each line when you hit 'Reply'? Ah, `>` means blockquote. Start each line with `>` and a space to make text a blockquote. Markdown:

~~~
> This is text in a blockquote.
~~~

Result:

> This is text in a blockquote.

In our workflow we use blockquote HTML for more than just quotations, though. We also use it for figures and poetry. We'll come back to this later.

### Hyperlinks

If you want your final HTML to include a clickable link:

*	surround the text you want clickable with `[` and `]`
*	put the URL it should point to between `(` and `)` immediately afterwards.

Markdown:

~~~
To learn more, [click here](http://google.com).
~~~

Result:

To learn more, [click here](http://google.com).

### Images

To place an image, you include a line telling the computer where to find the image file. This looks like a hyperlink, but with a `!` at the start of the line. Inside the square brackets, you include a brief description of the image (this is useful to screen readers for the visually impaired).

~~~
![A dog chasing a bus.](images/dogbus.jpg)
~~~

In the parentheses above, the `images/` part says that the `dogbus.jpg` image is in the `images` folder, which is alongside the markdown file. In our workflow, we always put images in the `images` folder like this.

See the [Images](15-images.html#images) chapter for more detail.

### Endnotes

Endnotes in our workflow appear at the end of a document (that is, a web page or a book chapter).[^1]

*	put a `[^1]` where the footnote reference should appear (the `1` there can be any numbers or letters, and should be different for each footnote in a document);
*	anywhere in the document (we recommend after the paragraph containing the footnote reference), put `[^1]: Your footnote text here.`.

We'll explain how to create notes on the side or bottom of a page (footnotes) later when we talk about classes.

(By the way, endnote references are `<sup>` in kramdown's HTML, not unicode numbers like ². The Classic theme includes styling for these and for `<sub>`, as in H<sub>2</sub>O.)

[^1]: In kramdown syntax, unfortunately, endnotes are called footnotes; so it's easy to confuse them. In book parlance, there is a big difference between footnotes and endnotes.

See the [Notes](17-notes.html#footnotes-endnotes-and-sidenotes) chapter for more detail.

### Definition lists

A definition list is a list of definitions, not surprisingly. Think of a dictionary. A definition list comprises one or more entries, and each entry has a headword and a definition. Even if you're not editing a dictionary, you might need to create a short glossary or define a word or two at some point. To create a definition entry in markdown, put the headword on its own line, and the definition on the next, after a colon and a tab. Markdown:

~~~
Editor
:	Someone who spends more time learning new tricks than making money.
~~~

Result:

Editor
:	Someone who spends more time learning new tricks than making money.

To create a whole list of definition entries, just put one of these after the other, with a line space between them.

## Using class tags

We're going to get a bit more advanced now. Get some tea.

As we mentioned earlier, sometimes we have to tell our software what *kind* of paragraph or list or blockquote we want. These *kinds* of text are called *classes*. To give something a class, we add a kramdown tag in curly braces, with a colon, and a dot before the class name. Markdown:

~~~
This paragraph should be in a box.
{:.box}
~~~

Result:

This paragraph should be in a box.
{:.box}

For the resulting HTML to actually appear in a box, when we turn your markdown into a finished book, we'll have to combine it with a CSS stylesheet that includes formatting instructions for the `box` class. If you're just editing in markdown, you don't have to think about the stylesheets. Our default stylesheets include designs for `box` as well as several other classes. (Which we'll list in a moment.)

But if your book needs classes that aren't already supported in the Classic theme, you'll need to ask a CSS-savvy designer to write you some CSS rules for your new class, to add to the bottom of your theme's master `.scss` files as custom CSS.

> ### Inventing classes
>
> If you invent new classes, make sure you name them for their semantic *purpose*, not their appearance. For instance, `important-tip` is a better class name than `shaded-bold`. Also, class names should always be lowercase and have no spaces.
{:.box}

In addition to boxes, our default stylesheets include lots of other classes for common book features.

> ### Block and inline elements
> 
> Attribute tags like classes can be applied to two kinds of element: *block* elements and *inline* elements.
> 
> A block element is anything that should (in print or on screen) start and end with a line break, like a paragraph or a list. An inline element is anything that appears inside a line of running text, like bold and italic.
> 
> Most of the Classic theme's pre-designed classes are for either block or inline elements, and sometimes both.
>
> When you apply an attribute tag to a block-level element in kramdown, you put the tag on the line immediately following the element.
>
> When you apply an attribute tag to an inline element, it appears immediately at the end of a span (a span is any contiguous series of inline characters inside a block element). Spans in kramdown can be marked off with asterisks as if they are italics: mark off the text you're tagging with asterisks (`*`), as you would italics, and put your tag immediately after the closing `*`, on the same line. E.g. `*Make this small-caps.*{:.smallcaps}`. The Classic theme will then apply the correct styling to the span, instead of the default italic. 
{:.box}

To see all the classes that our Classic theme supports, see the [Supported classes](05-classes.html#supported-classes) section.

## Editing reflowable text

When you're working in markdown, you're creating text that might reflow in an infinite number of ways on screens and onto page layouts. This changes the way you edit, because nothing is static.

For instance, you can use special HTML codes to insert non-breaking spaces, discretionary ('soft') hyphens and non-breaking hyphens.

| I need to                                   | Use this | 
|---
| Prevent ellipses falling after a line break | Add a non-breaking space (`&nbsp;`) before ellipses.
| Prevent dashes falling after a line break   | Add a non-breaking space (`&nbsp;`) before the dash: `the en-dash&nbsp;– as I've explained&nbsp;– is tricky.`
| Prevent line breaks between numbers and units | Use a non-breaking space: e.g. for '3&nbsp;pm, 24&nbsp;May' type `3&nbsp;pm, 24&nbsp;May`
| Prevent line breaks between adjectives and their units | Use a non-breaking space: e.g. for 'Grade&nbsp;2' type `Grade&nbsp;2`
| Prevent line breaks inside big numbers| Use a non-breaking space: e.g. for '40&nbsp;000' type `40&nbsp;000`
| Prevent a line break at a hyphen | Use `&#x2011;` for a non-breaking hyphen, e.g. `D&#x2011;Space` for 'D&#x2011;Space'
| Allow a word to hyphenate at the end of a line | Insert a discretionary ('soft') hyphen code: `&shy;`. E.g. `mark&shy;down`
