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

### Marking a book as 'unpublished'

Sometimes you are working on a book but you do not yet want it to be included in places like navigation lists and the content API. To mark it as unpublished, add `published: false` to its `default.yml` file.

Its HTML files will still be generated (unless you exclude them in a `_config` file), but it will not be listed in places that draw book data from `_data/works`.

## Copying an existing book

When you're creating a new book based on an existing one in the same project, the template can create the new folder and files for you. This saves you copy-pasting files and potentially missing something important.

It will make a copy of the book folder, rename the folder, and do the same for its `_data/works/...` files.

The syntax for the command is included in the guidance you get if you just enter `npm run electric-book` at the command line.

For example, if you're making a copy of `a-new-hope` to create `the-empire-strikes-back`, you'd enter:

```sh
npm run eb -- new --book a-new-hope --name the-empire-strikes-back
```

## Importing a text file

You can import a .docx file as you create a new book, or to add content to an existing book.

When you're adding new text from a Word file, the commands and options you need to know about are these:

- The `new` command creates a new book.
- The `text` command processes text, either importing a source `.docx` file or transforming existing markdown in a book directory.
- The `--source` option says which file to use. That might be a `.docx` or a `.md` file.

Here is a step-by-step guide.

1. Put your `.docx` file (that is, a Word doc) in the `_source` folder. (The one in the root of the project. Don't confuse this with the `_source` folders in `images` folders.)
2. The command you run to import the file depends whether you are creating a new book or adding to an existing one.
   - If you're creating a **new book**, run

     ```
	 npm run eb -- new --source myworddoc.docx
	 ```

	 That will create a new book folder, a new folder in `_data/works`, and convert your `.docx` file to a markdown file in the new book folder.

   - If you're adding to an **existing book**, run

   ```
   npm run eb -- text --book existingbookname --source myworddoc.docx
   ```

   In those examples, replace `myworddoc` with your .docx file's name, and `existingbookname` with the name of your existing book folder.

You now have a single markdown file. You may want to split that file into separate markdown files, each of which would become a separate web page in the web book output.

## Splitting a file

If you want to split your file at the same time that you import it (as described above), you add `--split` to the command. For example, adding to the example above, this command will create a new book, convert your `.docx` file to markdown, *and also* split it into separate files:

```
npm run eb -- new --source myworddoc.docx --split
```

Optionally, you can specify, in quote marks after `--split`, the characters you want to split at. For example:

```
npm run eb -- new --source myworddoc.docx --split "##"
```

See below for more detail on split markers.

If you want to split an existing markdown file into separate files, if that file is already in its book folder, run:

```
npm run eb -- text --book existingbookname --source markdownfile.md --split
```

### The split marker

The split marker is the character, or characters, in the markdown file that mark where the file should be split.

By default, the file will be split at each heading marked with `#` in the document (that is, the first-level heading, `h1`). You can specify a different string to split on, like `##`, by specifying it in quotes after `--split`, e.g. `--split '##'`.

Important: the split marker you specify must appear in the *markdown* file. So if you are converting from `.docx`, you need to know how your split marker will appear once it has been converted to markdown.

In `.docx`, headings that are styled as 'Heading 1' in Word will be converted to markdown as lines that begin with `#`, which is our default split marker. So, by default, imported `.docx` files will be split on those first-level headings, if they are correctly styled as such in Word. Second-level 'Heading 2' headings in Word become lines starting with `##` in markdown. If you use a unique string of characters, like `split()me` for example, in Word, those would probably come out exactly like that in markdown.

So you can use any characters as a split marker, as long as they are the first thing on their line in markdown.

Importantly, *the remaining characters on the line will be used for the filename*, prefixed by a number. In practice, this means that by default a file that begins with the first-level heading 'The Boy Who Lived', for example, will be saved as `01-the-boy-who-lived.md`.

The splitting process will add top-of-page YAML to each file it creates. If you've used `#`s as your marker, it will also add the `title:` to the top-of-page-YAML, also using that heading's text. E.g.:

```md
---
title: "The Boy Who Lived"
---

# The Boy Who Lived
```

After splitting a file, you will need to add the separate files to the book's `files`, `toc`, and/or `nav` lists in its `.yml` file in `_data/works`. To make this easier for you, the splitting process above will generate these lists for you to copy and paste. After you run a `--split` process, these generated lists will appear as files in the `_output` folder.

## Creating and editing book content

Each markdown file in `space-potatoes` is a part of a book, such as a table of contents or a chapter. Each file must start with:

~~~
---
---
~~~

And between those `---`s, we can and should specify some information about that part. This information is written in YAML syntax.

{:.box}
Note: the YAML between triple hyphens at the start of a markdown document is technically referred to as 'YAML frontmatter'. We don't use that term here, in order to avoid confusion with book frontmatter, also known as prelim pages. In these docs, we say 'top-of-page YAML'.

In each file's top-of-page YAML (the info between `---`s at the top) we specify the book-part's `title` and (sometimes) the book-part's `style` to use for that part. The `style` specifies what kind of book-part it is, such as `title-page`.

If a page has a `style` set, it must include one of `default-page`, `frontmatter-page`, or `endmatter-page` in order to get margin-box content, like running heads and page numbers. Including `style` *without* one of these effectively turns off margin boxes, which may be your intention, for instance on a `title-page`, which never has running heads or page numbers.

{:.box}
Technical note: the `style` YAML sets the class attribute of the output HTML's `<body>` element. That class is then used for CSS.

When you create your book, we recommend following these conventions for file naming and top-of-page YAML `style` settings:

| Book section                | Example filename          | Style in YAML                |
| --------------------------- | ------------------------- | ---------------------------- |
| Front cover (for the ebook) | `0-0-cover.md`            | `cover-page`                 |
| Previous publications page  | `0-1-previous.md`         | `previous-publications-page` |
| Half-title page             | `0-2-halftitle-page.md`   | `halftitle-page`             |
| Title page                  | `0-3-title-page.md`       | `title-page`                 |
| Copyright page              | `0-4-copyright.md`        | `copyright-page`             |
| Table of contents           | `0-5-contents.md`         | `contents-page`              |
| Epigraph page               | `0-6-epigraph.md`         | `epigraph-page`              |
| Acknowledgements            | `0-7-acknowledgements.md` | `frontmatter-page`           |
| Dedication page             | `0-8-dedication.md`       | `dedication-page`            |
| Part page                   | `01-part-page.md`         | `part-page`                  |
| A first chapter             | `01-01-chapter-1.md`      | `default-page`               |
| A second chapter            | `01-02-chapter-2.md`      | `default-page`               |
| Index                       | `50-01-index.md`          | `endmatter-page`             |

If you don't set the `style`, the page will default to `style: default-page`. So you actually don't need to set `style: default-page` in a YAML header. For most chapters in a book, then, your page YAML will simply include a chapter title:

~~~
---
title: "Chapter One: What are Space Potatoes?"
---
~~~

Page styles we've built into the template include:

*	`cover-page` for a front cover, which will appear in ebook editions
*	`halftitle-page` for a book's halftitle page
*	`previous-publications-page` for a book's list of the author's previous publications
*	`title-page` for a book's title page
*	`copyright-page` for the copyright or imprint page
*	`contents-page` for the book's table of contents
*	`dedication-page` for a dedication page
*	`epigraph-page` for an epigraph page
*	`frontispiece-page` for a frontispiece page
*	`frontmatter-page` for other prelim pages not accounted for otherwise
*	`endmatter-page` for endmatter pages
*	`default-page` for a book's default chapter page (and the global default)

Note that they all end with `-page`. Use only one `-page` style for a document. If you use more than one, only one of them will be applied.

You can also invent your own page styles, and use them in your custom CSS instead of these.

### Set 'page number one'

Many books have two 'page ones':

1.	the half-title or title page and,
2.	if the prelims have roman-numeral page numbers, the first chapter.

You should specify those pages so that Prince knows where to start numbering when creating PDFs.

Why? Well, for example, in print output if you use `frontmatter-page` on a book-part, by default it will have roman-numeral page numbers. When the first `default-page` starts, it will have decimal page numbers. However, the page numbering will be consecutive from roman through decimal. That is, it will run 'ix, x, 11, 12'. You reset the numbering to 1 at the start of the first chapter to avoid this.

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
	style: default-page page-1
	---
	~~~

	Remember that `default-page` is the default, so you normally don't have to specify it. *But* if you want to *add* a class in addition to `default-page`, you must specify both classes. This is because, if you were to use `style: page-1` in a YAML header, the class `page-1` would override and replace the default `style: default-page`, not add to it.

2.	Alternatively, add the `page-1` class to the first block-level element in the chapter by adding the tag `{:.page-1}` in the line immediately after it. But for this to work, the element must *not* have a CSS float applied to it. So often this doesn't work as well as specifying `page-1` in top-of-page YAML.

### Breaking chapters into smaller web pages

By default, when you generate a PDF, each markdown file – when rendered as part of a book – will start with a page break. This makes sense when each markdown file is a chapter of a book. You want page breaks between chapters.

However, on the web and in apps, each markdown file is a (web) page. There, an entire chapter as one scrolling page can be very long. This is not great for readability. (It also isn't great for SEO or for finding search results.)

So, you can create separate markdown files for each section of your book, no matter how small. Then on the web and in an app, each scrolling page will only be that long.

But now your PDF is full of page breaks! This creates big lumps of white space between sections and bloats your book's page extent.

So, to avoid a page break *in PDF output* before a markdown file, you must add the `continued` tag to its top-of-page YAML, like this:

```
---
title: Your Chapter's Subsection Title
style: default-page continued
---
```

Remember that `default-page` is the default page style, so you normally don't have to specify it. But here you are *adding* a style in addition to `default-page` (or `frontmatter-page` or any other built-in page style listed above), so you must specify both `default-page` and `continued`.

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
