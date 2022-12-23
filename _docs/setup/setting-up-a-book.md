---
title: "Setting up a book"
categories: setup
order: 7
---

# Setting up a new book
{:.no_toc}

The process of setting up a new book is covered very briefly in our [quick-start section](quick-start.html#quick-new-book-setup). This is a slightly longer explanation. For much more detail, read the various sections [listed on the docs starting page](../).

* TOC
{:toc}

## Creating a new book

To create a new book in a new project:

1. Download `electric-book.zip` from the [latest release](https://github.com/electricbookworks/electric-book/releases/latest) and extract it. This is now your project folder. You can rename it for your project. (We recommend avoiding spaces in the folder name.) Let's call our example project `my-sci-fi`.

   > Technical note: the latest release may not contain the most recent changes to the template. If you want those, make a copy of the [template repo's master branch](https://github.com/electricbookworks/electric-book), and discard its Git history (i.e. delete the `.git` folder in your copy).

1. An Electric Book repo, or project folder, can hold one book or many, like a series of books that share similar metadata or features (e.g. they're all by the same author).
1. Inside `my-sci-fi`, open and edit these three files:
    *   `_config.yml`: Edit the values there for your Jekyll setup. The comments will guide you.
    *   `index.md`: Replace our template text with your own. Usually, a link to each book is useful, e.g. `[Space Potatoes](space-potatoes)`.
    *   `README.md`: Replace our template text with any notes your collaborators might need to know about your project. (The README file is usually only read in the context of editing the files in your folder/repo.)
1.  Optionally, rename the `book` folder with a one-word, lowercase version of your book's title (e.g. `space-potatoes`). Use only lowercase letters and no spaces. If you're creating more than one book, make a folder for each book. (In one-book projects, we usually just leave it called `book`.)
1. Open `_data/project.yml` and replace the template values with your project's information.
1.	In `_data/works`, edit the book's `default.yml` file, filling in your project info and info about at least your first book. If your book is called 'my-sci-fi', you'll need to copy and edit `_data/works/book/default.yml` as `_data/works/my-sci-fi/default.yml`.
1.  Inside a book's folder, add a markdown file for each piece of your book, e.g. one file per chapter. Our template contains files we consider minimum requirements for most books: a cover, a title page, a copyright page, a contents page, and a chapter.
1.  Inside each book's folder, store images in the `images/_source` folder. Add a `cover.jpg` image of your book's front cover there, too.
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

| Book section                | Example filename          | Style in YAML                |
| --------------------------- | ------------------------- | ---------------------------- |
| Front cover (for the ebook) | `0-0-cover.md`            | `cover`                      |
| Previous publications page  | `0-1-previous.md`         | `previous-publications-page` |
| Half-title page             | `0-2-halftitle-page.md`   | `halftitle-page`             |
| Title page                  | `0-3-title-page.md`       | `title-page`                 |
| Copyright page              | `0-4-copyright.md`        | `copyright-page`             |
| Table of contents           | `0-5-contents.md`         | `contents-page`              |
| Epigraph page               | `0-6-epigraph.md`         | `epigraph-page`              |
| Acknowledgements            | `0-7-acknowledgements.md` | `frontmatter`                |
| Dedication page             | `0-8-dedication.md`       | `dedication-page`            |
| Part page                   | `01-part-page.md`         | `part-page`                  |
| A first chapter             | `01-01.md`                | `chapter`                    |
| A second chapter            | `01-02.md`                | `chapter`                    |

If you don't set the `style`, the page will default to `style: chapter`. So you actually don't need to ever set `style: chapter` in a YAML header. For most chapters in a book, then, your YAML frontmatter will simply include a chapter title:

~~~
---
title: "Chapter One: What are Space Potatoes?"
---
~~~

Page styles we've built into the template include:

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

### Breaking chapters into smaller web pages

By default, when you generate a PDF, each markdown file – when rendered as part of a book – will start with a page break. This makes sense when each markdown file is a chapter of a book. You want page breaks between chapters.

However, on the web and in apps, each markdown file is a (web) page. There, an entire chapter as one scrolling page can be very long. This is not great for readability. (It also isn't great for SEO or for finding search results.)

So, you can create separate markdown files for each section of your book, no matter how small. Then on the web and in an app, each scrolling page will only be that long.

But now your PDF is full of page breaks! This creates big lumps of white space between sections and bloats your book's page extent.

So, to avoid a page break *in PDF output* before a markdown file, you must add the `continued` tag to its YAML frontmatter, like this:

```
---
title: Your Chapter's Subsection Title
style: chapter continued
---
```

Remember that `chapter` is the default page style, so you normally don't have to specify it. But here you are *adding* a style in addition to `chapter` (or `frontmatter` or any other built-in page style listed above), so you must specify both `chapter` and `continued`.

### File naming

We recommend naming each book's markdown files in alphabetical order. This is easiest using a numbering system, where prelims (frontmatter) files start with `0` or `00`, e.g. `0-1-titlepage.md`, `0-2-copyright.md`, and chapter files are numbered for their chapter number, e.g. `01.md`, `02.md`, and so on. The alphabetical order makes it easy to see the documents in the right order at all times.

We recommend adding a few descriptive words to your filenames after the numbers (or other alphabetising prefix). E.g. `02-growing-potatoes-on-saturn.md`. There are two reasons for this:

- While editing, you'll find it easier to move between chapters with a human-readable phrase in the filename.
- The filename will be part of the file's URL as a web page, and it's good for SEO and for end users if the URL contains some relevant key words.

> Note: We recommend using leading zeros in file-name numbers – that is, `02.md` rather than `2.md` – because that sorts correctly in most file browsers. Otherwise, some file browsers will sort `10.md` before `2.md`. In the rare event that you have over 99 chapters, use two leading zeros: `001.md`.
{:.box}

## The `images` folder

Alongside the content files in a book's folder is an `images` folder, for images that belong to that book only.

See ['Adding image files'](../images/adding-image-files.html) for more detail.