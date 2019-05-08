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

*   **HTML and CSS**: the fundamental building blocks of almost all digital content.
*   **Markdown**: a simple, plain-text shortcut for creating HTML. (The original [Markdown syntax reference](http://daringfireball.net/projects/markdown/syntax) is the easiest intro to basic markdown. We use a markdown variant called [kramdown](http://kramdown.gettalong.org). It lets us use attributes like classes, has a stricter syntax, and allows adding of IDs to elements.
*   **Sass**: a way to create complex CSS from simple rules.
*   **Git**: software for tracking a team's changes and syncing them with a remote server. We like to use [GitHub](http://github.com).

## How it works

Very broadly, this is how the Electric Book template works.

*   The template is set up as a [Jekyll](https://jekyllrb.com/) project, with lots of predefined defaults in various files. When you run the template's `run-` script for your operating system, Jekyll builds those snippets and your content into HTML pages. (See ['Using the template'](#using-the-template) below for detail on the template's structure, and [Jekyll's docs on structure](https://jekyllrb.com/docs/structure/).)
*   You store your markdown content in a book's `text` folder, and images in its `images/_source` folder. You create your designs in the stylesheets in its `styles` folder. You store project settings in `_data/settings.yml` and book metadata in `_data/meta.yml`.
*   Depending which options you select when you run the `run-` script, the script might:
    * pass the finished HTML to Prince to convert to PDF
    * serve the finished HTML as a website that you can browse on your machine
    * zip the finished HTML into an epub
    * pass the finished HTML to Cordova to wrap in an app
    * pass the finished HTML to Pandoc to convert to Word
    * run the finished HTML through PhantomJS to build a search index.
*   The `run-` script also lets you choose to process images. It converts any images in a book's `_source` folder into variations for print-PDF, screen-PDF, web, epub and app outputs.

## Structure

A project folder (which you should track in Git as a repository) can contain one or more related books. Its folders and files follow the [standard Jekyll structure](http://jekyllrb.com/docs/structure/). We store each book's content in its own subfolder. In the template, the first book folder is simply called `book`.

Here is an explanation of all the folders and files in the template.

*   `_app`: template files for app output. You shouldn't ever have to change these.
*   `_configs`: a folder of configuration settings for different outputs. You'll rarely have to change these, though you might occasionally need to customise outputs here.
*   `_data`: a folder of data to use in your books (including project metadata). This folder includes at least three important files:

    * `meta.yml`: your publication metadata,
    * `locales.yml`: phrases used in your publications,
    * `settings.yml`: settings for your project.

*   `_docs`: this documentation on how to use the template.
*   `_epub`: template files for epub output. You shouldn't ever have to change these.
*   `_includes`: HTML templates that Jekyll uses to build your books. You will rarely change anything here. You may need to add new templates here for custom book features.
*   `_layouts`: templates that Jekyll uses to structure pages. You shouldn't ever have to change these.
*   `_output`: the folder where our output scripts will save your PDFs and epubs.
*   `_sass`: a folder that stores the default styles for your books. You shouldn't ever have to change these unless you're heavily modifying designs for a series.
*   `_site`: where Jekyll and our output scripts will generate the web and app versions of your books.
*   `_tools`: utilities required for output. For instance, colour profiles for PDFs and image conversions and the Zip utility for creating epubs. You shouldn't have to change these. You might add your own colour profiles to `_tools/profiles` for specialised projects.
*   `assets`: a folder of Javascript, font files and images that your whole project might use.

    Here, the template includes:

    *   `styles`: a folder that contains project-wide stylesheets, mainly for use on project home pages.
    *   `images`: a folder that contains:
        -   `cover.jpg`: a front-cover image used as the default for the project as a whole.
        -   `publisher-logo.jpg`: a logo (which you'll replace with your own) for the project and website as a whole.
    *   `fonts`: a place to store fonts that all books in a project might use. The template includes several open-licensed fonts here already.
    *   `js`: Javascript used in the template. Advanced users might add their own scripts here and manage which scripts are included on pages in `bundle.js`. See the ['Using Javascript'](../advanced/javascript.html) section for more detail.

*   `book`: a folder for a book's content, stored in markdown files. You might add more similarly structured folders for further books in your project. You'd duplicate and rename this folder for each book you add to your project.

    The `book` folder and its subfolders also contain some important files and folders:

     *   `index.md`: a landing page for the book. You can leave this file as is. It's useful in web and app versions, and just redirects to the `text` folder. If you create a new book, you should copy this file as is into the same place in the new book's folder.
     *   `package.opf`: on epub output, Jekyll fills out this file and it's built into the epub. If you create a new book, you should copy this file as is into the same place in the new book's folder.
     *   `toc.ncx`: a navigation file for backwards-compatibility in older ereaders. You only need this file in a book if that backwards-compatibility is important to you.
     *   `fonts`: store any font files for your book here. (If you want to share font files across books, you can also store fonts in `assets/fonts`.)
     *   `images`: this is where you store images for a book. See the ['Adding image files' section](../images/adding-image-files.html) for more detail.
     *   `styles`: contains the stylesheets for designing your book's various outputs. See the ['Design'](../layout/design.html) section for more detail.
     *   `text`: where you store your content files in markdown (`.md`) files.
       
         The `text` folder contains these important files. They should be present as is in every book's `text` folder. You don't need to change them at all:

         * `file-list`: Jekyll turns this into a list of files that the system uses for output, for instance to tell PrinceXML which files to include in a PDF. It gets this file list from the `files:` lists that you create in `_data/meta.yml`
         * `index.md`: a landing page for your book. Jekyll will build this to contain the book's cover image, and clicking it will open the book's start page, which you define in `_data/meta.yml`.

*   `samples`: a sample book for demo and testing purposes. You can safely delete it (if you do, you should also remove its metadata in `_data/meta.yml`).
*   `_config.yml`: a file for setting configuration options for Jekyll, which will compile your book for output.
*   `_prose.yml`: configuration settings for using [prose.io](http://prose.io) for online book editing (generally, you won't have to edit this file) and for excluding files from view in the [Electric Book Manager](https://electricbookworks.github.io/electric-book-gui/).
*   `gulpfile.js`: the 'recipe' for processing images from `_source` into various output formats. Most users can ignore this. Advanced users may want to adjust it, or use it for processing and minifying Javascript.
*   `index.md`: the home page of your project when served as a website.
*   `search.md`: the search page of your project when served as a website.
*   Three scripts for generating books in different formats on various operating systems:

    *   `run-windows.bat`
    *   `run-mac.command`
    *   `run-linux.sh`

    Note that to run the Mac and Linux scripts, you must first give your computer permission to run them. This is usually done in a Terminal in the project folder, where you enter `chmod +x run-mac.command` on Mac or `chmod +x run-linux.sh` on Linux. After that, on Mac you can just double-click the `run-mac.command` file. On Linux, you must run it from the Terminal, when in the folder, by typing `./run-linux.sh`.

*   `README.md`: the starting place for your collaborators. Edit the template's text to suit your project. It should tell them how to use the project.

### Files and folders to ignore

You should keep the following files and folders, but you can largely ignore them.

*   `.sass-cache`: after your first output, Jekyll creates this folder to make styles build faster next time. You can ignore it.
*   `.gitignore`: tells Git what not to track. You shouldn't need to edit it.
*   `.jekyll-metadata` is created by Jekyll. You can ignore it.
*    `CHANGELOG.md`: the list of things we've improved in the template. You can ignore this unless you're curious. It can be useful to compare to newer version of the template, if you want to see what your older version doesn't have.
*   `eslint.json`: advanced users might use this when processing Javascript with our Gulpfile. Most users can ignore it.
*   `Gemfile` and `Gemfile.lock`: determines which versions of Ruby gems your project uses. You'll rarely have to chance this unless you know exactly why you're changing it.
*   `LICENSE`: the license terms under which this template is created.
*   `node_modules`: once you install Gulp and its dependencies for a project, you'll also see this folder in your project. You can ignore this, but don't delete it. It will not be tracked by Git.
*   `package.json` and `package-lock.json`: determines which Node modules your projects needs for things like image processing and building apps. Most users can ignore this file. Advanced users will need to edit it to use new Node modules.
