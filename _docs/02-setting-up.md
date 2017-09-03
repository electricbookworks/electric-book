---
title: Setting up
---

# Setting up
{:.no_toc}

* toc
{:toc}

## Technical overview

To set up the workflow, you still have to have some technical expertise. Once it's set up, non-technical editorial team members with a couple of hours training (taught or self-taught) can add and edit books in it.

The technical team members who run the workflow need to be familiar with a few concepts and tools:

*	**HTML and CSS**: the fundamental building blocks of almost all digital content.
*	**Markdown**: a simple, plain-text shortcut for creating HTML. (The original [Markdown syntax reference](http://daringfireball.net/projects/markdown/syntax) is the easiest intro to basic markdown. We use a markdown variant called [kramdown](http://kramdown.gettalong.org). It lets us use attributes like classes, has a stricter syntax, and allows adding of IDs to elements.
*   **Sass**: a way to create complex CSS from simple rules.
*	**Jekyll**: software that turns markdown and Sass into HTML and CSS. (To learn about Jekyll, [start here](http://jekyllrb.com/). If you're installing it on Windows, [you'll also need this guide](http://jekyll-windows.juthilo.com/).) From version 0.4.0, our template requires at least Jekyll 3.2.
*	**Bundler**: software that manages which version of Jekyll (and other Ruby gems) to apply to a project.
*	**Git**: software for tracking a team's changes and syncing them with a remote server. We like to use [GitHub](http://github.com) and [Bitbucket](http://bitbucket.org) as our remotes.
*	**Sigil**: an open-source epub editor, where we quickly assemble ebooks.
*   **PrinceXML**: an app for creating PDFs from HTML and CSS (Prince is the only proprietary part of this stack).

To use the workflow on your own machine, you must have the following software installed:

* Ruby (ideally, via a Ruby version manager like RVM or Homebrew)
* Bundler (manages your Ruby gem versions)
* Jekyll (generates your source HTML)
* PrinceXML (for generating PDFs from source HTML)
* Sigil (for finishing epubs)
* Git (or similar, if you want good version control).

## Folder (repo) structure

A workflow folder (often tracked in Git as a repo) usually contains a series of related books. Its folders and files follow the [standard Jekyll structure](http://jekyllrb.com/docs/structure/). We then put each book's content in its own folder. In the template, the first book folder is simply called `book`.

> Pro tip: You could also store several series in one repo, each series with its own set of Jekyll files, and a single `_prose.yml` configuration in the root folder for all series subfolders. This is only useful if you don't need a live staging site or previews with GitHub Pages, since each Jekyll setup must be in its own repo for GitHub Pages to work out of the box.
{:.box}

## Using the template

The Electric Book repo (folder) is ready to use for a series of one or more books. In short, to get up and running, see the [Quick Start guide](0-9-quick-start.html).

Now, let's get into some more detail about how it all works. There are several folders and files in the series template repo:

*   `_config.yml`: a file for setting configuration options for Jekyll, which will compile your book for output. There are several other smaller config files you can ignore. They are for changing specific config settings on output.
*   `_prose.yml`: configuration settings for using [prose.io](http://prose.io) for online book editing (generally, you won't have to edit this file).
*   `book`: a folder for a book's content, stored here in a series of markdown files
*   `_data`: a folder for information about your books (aka metadata).
*   `_includes`: snippets of HTML for Jekyll (you won't have to open this folder).
*   `_site`: where Jekyll will generate the HTML versions of your books.
*   `_output`: the folder where our output scripts will save your PDFs.
*   `index.md`: the home page of your series when served as a website.
*   various `.bat`, `.command` and `.sh` scripts for quickly generating books in different formats on various operating systems.

Let's explain some of these in more detail.

The default design, the Electric Book Classic theme gem, is imported automatically when you run `bundle install`.

That gem provides the basic design of your books. A theme is a collection of files (Sass, CSS, fonts, Javascript and hyphenation dictionaries) that define a book's design. We hope that in future we and others might design other themes. Classic is extremely versatile and powerful already. For most book design, you'll only have to edit the variables in each book's `print-pdf.scss`, `screen-pdf.scss`, `web.scss` and `epub.scss`, and add your own custom CSS as needed.

> If you're familiar with Sass, you'll know that Jekyll will convert these `.scss` files into finished `.css` files. Sass, saved in `.scss` files, is to CSS what markdown is to HTML: an efficient way to write that lets software do the hard work of creating finished code.
{:.box}

## Creating a new book

The process of setting up a new book is covered briefly in our [quick-start section](0-9-quick-start.html#quick-new-book-setup). Here is more detail.

To create a new book in a new series:

1. The repo (or series folder) can hold one book or many, like a series of books that share similar metadata or features (e.g. they're all by the same author). Make a copy of the folder and, if you like, rename it for your series. E.g. `my-sci-fi`.
1. Inside `my-sci-fi`, open and edit these three files:
    *   `_config.yml`: Edit the values there for your Jekyll setup. The comments will guide you.
    *   `index.md`: Replace our template text with your own. Usually, a link to each book is useful, e.g. `[Space Potatoes](space-potatoes)`.
    *   `README.md`: Replace our template text with any notes your collaborators might need to know about your series. (The README file is usually only read in the context of editing the files in your folder/repo.)
1.  Optionally, rename the `book` folder with a one-word, lowercase version of your book's title (e.g. `space-potatoes`). Use only lowercase letters and no spaces. If you're creating more than one book, make a folder for each book.
1.	In `_data`, edit the `meta.yml` file, filling in your series info and info about at least your first book.
1.  Inside a book's `text` folder, add a markdown file for each piece of your book, e.g. one file per chapter. Our template contains files we consider minimum requirements for most books: a cover, a title page, a copyright page, a contents page, and a chapter.
1.  Inside each book's folder, store images in the `images` folder. Add a `cover.jpg` image of your book's front cover there, too.
1. In each book's `styles` folder, edit the values in `print-pdf.scss`, `screen-pdf.scss`, `web.scss` and `epub.scss`.

## Creating book content

Each markdown file in `space-potatoes` is a part of a book, such as a table of contents or a chapter. Each file must start with:

~~~
---
---
~~~

And between those `---`s, we can and should specify some information about that part. This information is called YAML frontmatter.

In each file's YAML frontmatter (the info between `---`s at the top) we specify the book-part's `title` and (sometimes) the book-part's `style` to use for that part. The `style` specifies what kind of book-part it is, such as a `title-page` or `chapter`.

> Technical note: the `style` YAML sets the class attribute of the output HTML's `<body>` element. Themes use that class to control CSS and page structure.
{:.box}

When you create your book, we recommend following these conventions for file naming and YAML frontmatter `style` settings:

| Book section                | Sample file               | Style in YAML    |
|-----------------------------|---------------------------|------------------|
| Front cover (for the ebook) | `0-0-cover.md`            | `cover`          |
| Title page                  | `0-1-titlepage.md`        | `title-page`     |
| Copyright page              | `0-2-copyright.md`        | `copyright-page` |
| Table of contents           | `0-3-contents.md`         | `contents-page`  |
| Acknowledgements            | `0-4-acknowledgements.md` | `frontmatter`    |
| A first chapter             | `1.md`                    | `chapter`        |
| A second chapter            | `2.md`                    | `chapter`        |

If you don't set the `style`, the page will default to `style: chapter`. So you actually don't need to ever set `style: chapter` in a YAML header. For most chapters in a book, then, your YAML frontmatter will simply include a chapter title:

~~~
---
title: "Chapter One: What are Space Potatoes?"
---
~~~

Page styles we've designed for in the Classic theme include:

*	`index` for the home page of a collection
*	`cover` for a front cover, which will appear in ebook editions
*	`halftitle-page` for a book's halftitle page
*	`previous-publications-page` for a book's list of the author's previous publications
*	`title-page` for a book's title page
*	`copyright-page` for the copyright or imprint page
*	`contents-page` for the book's table of contents
*	`dedication-page` for a dedication page
*	`epigraph-page` for an epigraph page
*	`frontispiece-page` for a frontispiece page
*	`frontmatter` for other prelim pages not accounted for otherwise
*	`chapter` for a book's default chapter page (and the global default)

You can also invent your own page styles, and use them in your custom CSS instead of these, though you may get unexpected results if you've been relying on a theme for existing styles like `chapter`.

### Set 'page number one'

Many books have two 'page ones': 

1.	the half-title or title page and, 
2.	if the prelims have roman-numeral page numbers, the first chapter.

You should specify those pages so that Prince knows where to start numbering when creating PDFs.

Why? Well, for example, in print output if you use `frontmatter` on a book-part, by default it will have roman-numeral page numbers. When the first `chapter` starts, it will have decimal page numbers. However, the page numbering will be consecutive from roman through decimal. That is, it will run 'ix, x, 11, 12'. You reset the numbering to 1 at the start of the first `chapter` to avoid this.

You reset page numbering by adding the class `page-1` to the first block-level element on the relevant page.

You can do this in two ways:

1.	If a markdown document starts at 'page one', add the class to the `style` YAML header. E.g.

	~~~
	---
	title: Half-title page
	style: halftitle-page page-1
	---
	~~~

	And at the first chapter:

	~~~
	---
	title: Chapter One
	style: chapter page-1
	---
	~~~

	Remember that `chapter` is the default, so you normally don't have to specify it. *But* if you want to *add* a class in addition to `chapter`, you must specify both classes. This is because, if you were to use `style: page-1` in a YAML header, the class `page-1` would override the default `style: chapter`, not add to it.

2.	Alternatively, add the `page-1` class to the first block-level element in the chapter by adding the tag `{:.page-1}` in the line immediately after it. But for this to work, the element must *not* have a CSS float applied to it. So often this doesn't work as well as specifying `page-1` in YAML frontmatter.

### File naming

Name each book's markdown files in perfectly alphabetical order. We recommend using a numbering system, where prelims (frontmatter) files start with a 0, e.g. `0-1-titlepage.md`, `0-2-copyright.md`, and chapter files are numbered for their chapter number, e.g. `01.md`, `02.md`, and so on. The alphabetical order makes it easy to see the documents in the right order at all times, and it makes ordering outputted HTML files easy when dropping them into Prince for PDF output.

> Note: We recommend using leading zeros in file-name numbers – that is, `02.md` rather than `2.md` – because that sorts correctly in most file browsers. Otherwise, some file browsers will sort `10.md` before `2.md`. In the rare event that you have over 99 chapters, use two leading zeros: `001.md`.
{:.box}

## The `images` folder

Alongside the content files in a book's folder is an `images` folder, for images that belong to that book only.

A book's folder should only ever need to contain markdown files and images. If you're embedding other kinds of media you could add folders for that alongside `images`. We don't recommend sharing images or media between books, in case you want to move a book from one series to another later. (So, for example, copy the publisher logo into each book's `images` folder separately.)

If your series home page requires images, you will need to create an `images` folder for that in the main series folder.
