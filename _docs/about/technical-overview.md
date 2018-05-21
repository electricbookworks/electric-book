---
title: Technical overview
categories: about
order: 2
---

# Technical overview
{:.no_toc}

* toc
{:toc}

To set up the workflow, you still have to have some technical expertise. Once it's set up, non-technical editorial team members with a couple of hours training (taught or self-taught) can add and edit books in it.

The technical team members who run the workflow need to be familiar with:

*	**HTML and CSS**: the fundamental building blocks of almost all digital content.
*	**Markdown**: a simple, plain-text shortcut for creating HTML. (The original [Markdown syntax reference](http://daringfireball.net/projects/markdown/syntax) is the easiest intro to basic markdown. We use a markdown variant called [kramdown](http://kramdown.gettalong.org). It lets us use attributes like classes, has a stricter syntax, and allows adding of IDs to elements.
*   **Sass**: a way to create complex CSS from simple rules.
*	**Git**: software for tracking a team's changes and syncing them with a remote server. We like to use [GitHub](http://github.com).

## Dependencies

To use the workflow on your own machine, you must have the following software installed:

* **Ruby**: the software that reads and runs Ruby code. (We highly recommend installing Ruby with a Ruby version manager like Chocolatey in Windows or Homebrew on Mac.)
* **Bundler**: software that manages which version of Jekyll (and other Ruby gems) to apply to a project.
* **Jekyll**: software that turns markdown and Sass into HTML and CSS. (To learn about Jekyll, [start here](http://jekyllrb.com/). If you're installing it on Windows, [you'll also need this guide](http://jekyll-windows.juthilo.com/).) From version 0.4.0, our template requires at least Jekyll 3.2.
* **Node.js**, which we use for doing things like converting images and optimising Javascript.
* **Gulp**: a Node.js package we use for bulk-processing images and Javascript.
* **PhantomJS**: a headless browser that we use for rendering MathJax in PDF and for generating search indexes.
* **PrinceXML**: software for creating PDFs from HTML and CSS (Prince is the only proprietary tool you'll need).
* **GraphicsMagick**: the software we use for optimising images via Gulp.
* **Git**: the software we use for version control.

You can see guidelines for [installing Jekyll on Windows here](https://gist.github.com/arthurattwell/281a5e1888ffd89b08b4861a2e3c1b35), and a guide to [setting up on Mac here](https://gist.github.com/arthurattwell/88be57cc2f660e35ebade4d098d67e4b).

## Key structural concepts

Here are some of the main technical features of the template and how they work.

### Folder (repo) structure

A workflow folder (often tracked in Git as a repo) usually contains a set of related books. Its folders and files follow the [standard Jekyll structure](http://jekyllrb.com/docs/structure/). We then put each book's content in its own folder. In the template, the first book folder is simply called `book`.

### Using the template

The Electric Book repo (folder) is ready to use for a set of one or more books. In short, to get up and running, see the [Quick Start guide](setup/quick-start.html).

Now, let's get into some more detail about how it all works. There are several folders and files in the Electric Book template's root directory.

Folders:

*   `_app`: template files for app output. You shouldn't ever have to change these.
*   `_configs`: a folder of configuration settings for different outputs. You'll rarely have to change these, though you might occasionally need to customise outputs here.
*   `_data`: a folder of data to use in your books (including project metadata).
*   `_docs`: this documentation on how to use the template.
*   `_epub`: template files for epub output. You shouldn't ever have to change these.
*   `_includes`: HTML templates that Jekyll uses to build your books. You will rarely change anything here. You may need to add new templates here for custom book features.
*	`_layouts`: templates that Jekyll uses to structure pages. You shouldn't ever have to change these.
*   `_output`: the folder where our output scripts will save your PDFs and epubs.
*   `_sass`: a folder that stores the default styles for your books. You shouldn't ever have to change these unless you're heavily modifying designs for a series.
*   `_site`: where Jekyll and our output scritps will generate the web and app versions of your books.
*   `_tools`: utilities required for output. You shouldn't have to change these.
*   `assets`: a folder of Javascript, font files and images that your whole project might use.
*   `book`: a folder for a book's content, stored in markdown files. You might add more similarly strcutured folders for further books in your project.
*	`samples`: a sample book for demo and testing purposes. You can safely delete it (if you do, you should also remove its metadata in `_data/meta.yml`).

Files:

*   `_config.yml`: a file for setting configuration options for Jekyll, which will compile your book for output. There are several other smaller config files you can ignore. They are for changing specific config settings on output.
*   `_prose.yml`: configuration settings for using [prose.io](http://prose.io) for online book editing (generally, you won't have to edit this file) and for excluding files from view in the [Electric Book Manager](https://electricbookworks.github.io/electric-book-gui/).
*   `index.md`: the home page of your project when served as a website.
*   `.bat`, `.command` and `.sh` scripts for quickly generating books in different formats on various operating systems.

There are other files in the root directory that are important to the template. Leave them as is, unless you really know what they are and what you're doing.

### Creating a new book

The process of setting up a new book is covered briefly in our [quick-start section](0-9-quick-start.html#quick-new-book-setup). Here is more detail.

To create a new book in a new project:

1. The repo (or project folder) can hold one book or many, like a series of books that share similar metadata or features (e.g. they're all by the same author). Make a copy of the folder and, if you like, rename it for your project. E.g. `my-sci-fi`.
1. Inside `my-sci-fi`, open and edit these three files:
    *   `_config.yml`: Edit the values there for your Jekyll setup. The comments will guide you.
    *   `index.md`: Replace our template text with your own. Usually, a link to each book is useful, e.g. `[Space Potatoes](space-potatoes)`.
    *   `README.md`: Replace our template text with any notes your collaborators might need to know about your project. (The README file is usually only read in the context of editing the files in your folder/repo.)
1.  Optionally, rename the `book` folder with a one-word, lowercase version of your book's title (e.g. `space-potatoes`). Use only lowercase letters and no spaces. If you're creating more than one book, make a folder for each book.
1.	In `_data`, edit the `meta.yml` file, filling in your project info and info about at least your first book.
1.  Inside a book's `text` folder, add a markdown file for each piece of your book, e.g. one file per chapter. Our template contains files we consider minimum requirements for most books: a cover, a title page, a copyright page, a contents page, and a chapter.
1.  Inside each book's folder, store images in the `images` folder. Add a `cover.jpg` image of your book's front cover there, too.
1. In each book's `styles` folder, edit the values in `print-pdf.scss`, `screen-pdf.scss`, `web.scss` and `epub.scss`.

### Creating book content

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

#### Set 'page number one'

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

#### File naming

Name each book's markdown files in perfectly alphabetical order. We recommend using a numbering system, where prelims (frontmatter) files start with a 0, e.g. `0-1-titlepage.md`, `0-2-copyright.md`, and chapter files are numbered for their chapter number, e.g. `01.md`, `02.md`, and so on. The alphabetical order makes it easy to see the documents in the right order at all times, and it makes ordering outputted HTML files easy when dropping them into Prince for PDF output.

> Note: We recommend using leading zeros in file-name numbers – that is, `02.md` rather than `2.md` – because that sorts correctly in most file browsers. Otherwise, some file browsers will sort `10.md` before `2.md`. In the rare event that you have over 99 chapters, use two leading zeros: `001.md`.
{:.box}

### The `images` folder

Alongside the content files in a book's folder is an `images` folder, for images that belong to that book only.

A book's folder should only ever need to contain markdown files and images. If you're embedding other kinds of media you could add folders for that alongside `images`. We don't recommend sharing images or media between books, in case you want to move a book from one project to another later. (So, for example, copy the publisher logo into each book's `images` folder separately.)

If your project home page requires images, keep those in `/assets/images`, so that you can link to them from any page.
