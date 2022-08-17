---
title: Technical overview
categories: about
order: 2
---

# Technical overview
{:.no_toc}

* toc
{:toc}

To set up the workflow, you need some technical confidence. Once it's set up, non-technical editorial team members with a couple of hours training (taught or self-taught) can add and edit books in it.

The technical team members who run the workflow should be familiar with:

* **HTML and CSS**: the fundamental building blocks of almost all digital content.
* **Markdown**: a simple, plain-text shortcut for creating HTML. (The original [Markdown syntax reference](https://daringfireball.net/projects/markdown/syntax) is the easiest intro to basic markdown. We use a more advanced markdown variant called [kramdown](https://kramdown.gettalong.org). It lets us use attributes like classes, has a stricter syntax, and allows adding of IDs to elements.
* **Sass**: a syntax for writing complex CSS more efficiently.
* **Git**: software for tracking a team's changes and syncing them with a remote server. We like to use [GitHub](https://github.com).

## How it works

The template is set up as a [Jekyll](https://jekyllrb.com/) project, with lots of predefined defaults. When you run `npm run electric-book` commands, Jekyll builds those snippets and your content into HTML pages.

See ['Structure'](#structure) below for detail on the template's structure, and [Jekyll's docs on structure](https://jekyllrb.com/docs/structure/). In short:

- **Content:** Each book in your project has its own folder. You store your markdown content in a book's folder, and images in its `images/_source` folder.
- **Design:** You define designs for your project in `_sass/theme`, and book-specific design features in a book's `styles` folder.
- **Metadata:** You store project settings in `_data/settings.yml`, project info in `_data/project.yml`, and book metadata in `_data/works`.


## Structure

A project folder (which you should track as a repository with Git) can contain one or more related books. Its folders and files follow the [standard Jekyll structure](https://jekyllrb.com/docs/structure/). We store each book's content in its own subfolder. In the template, the first book folder is simply called `book`.

Here is an explanation of folders and files in the template.

* `_app`: template files for app output. You shouldn't ever have to change these.
* `_configs`: a folder of configuration settings for different outputs. You'll rarely have to change these, though you might occasionally need to customise outputs here.
* `_data`: a folder of data to use in your books (including project metadata). This folder includes important folders files, including:

  * `works`: your books' metadata in YAML files,
  * `locales.yml`: phrases used in your publications,
  * `settings.yml`: settings for your project.

* `_docs`: this documentation on how to use the template.
* `_epub`: template files for epub output. You shouldn't ever have to change these, except to add font files to `_epub/assets/fonts` if you're embedding fonts in epubs.
* `_includes`: HTML templates that Jekyll uses to build your books. You will rarely change anything here. You may need to add new templates here for custom book features.
* `_layouts`: templates that Jekyll uses to structure pages. You shouldn't ever have to change these.
* `_output`: the folder where our output scripts will save your PDFs and epubs.
* `_sass`: a folder that stores the default styles for your books. You should only edit the files in `_sass/theme`.
* `_site`: where Jekyll and our output scripts will generate the web and app versions of your books.
* `_tools`: utilities required for output. For instance, colour profiles for PDFs and image conversions. You shouldn't have to change these. You might add your own colour profiles to `_tools/profiles` for specialised projects.
* `assets`: a folder of Javascript, font files and images that your whole project might use.

  Here, the template includes:

  * `styles`: a folder that contains project-wide stylesheets, mainly for use on project home pages.
  * `images`: a folder that contains:
    - `cover.jpg`: a front-cover image used as the default for the project as a whole.
    - `logo.jpg`: a logo (which you'll replace with your own) for the project and website as a whole.
  * `fonts`: a place to store fonts that any book in a project might use. The template includes several open-licensed fonts here already. (You may also choose to store fonts in `_epub/assets/fonts` for [epub output](../output/epub-output.html#fonts).)
  * `js`: Javascript used in the template. Advanced users might add their own scripts here and manage which scripts are included on pages in `bundle.js`. See the ['Using Javascript'](../advanced/javascript.html) section for more detail.

* `book`: a folder for a book's content, stored in markdown files. You might add more similarly structured folders for further books in your project. You'd duplicate and rename this folder for each book you add to your project.

  The `book` folder and its subfolders also contain some important files and folders:

  * `index.md`: a landing page for the book. You can leave this file as is. If you create a new book, you should copy this file as is into the same place in the new book's folder.
  * `package.opf`: on epub output, Jekyll fills out this file and it's built into the epub. If you create a new book, you should copy this file as is into the same place in the new book's folder. Do not edit it.
  * `toc.ncx`: a navigation file for backwards-compatibility in older ereaders. You only need this file in a book if that backwards-compatibility is important to you. Do not edit it.
  * `images`: this is where you store images for a book. See the ['Adding image files' section](../images/adding-image-files.html) for more detail.
  * `styles`: contains the stylesheets for designing your book's various outputs. See the ['Design'](../layout/design.html) section for more detail.
  * `index.md`: a landing page for your book. Jekyll will build this to contain the book's cover image, and clicking it will open the book's start page, which you define in the book's YAML file in `_data/works`.

* `samples`: a sample book for demo and testing purposes. You can safely delete it (if you do, you can also remove `_data/works/samples`).
* `_config.yml`: a file for setting configuration options for Jekyll, which will compile your book for output.
* `_prose.yml`: configuration settings for using [prose.io](https://prose.io) for online book editing (generally, you won't have to edit this file) and for excluding files from view in the [Electric Book Manager](https://electricbookworks.github.io/electric-book-gui/).
* `gulpfile.js`: this file controls many of the processes that optimise images and HTML for various book outputs. Most users should never edit this file. Advanced users may choose to adjust or extend it.
* `index.md`: the home page of your project when served as a website.
* `search.md`: the search page of your project when served as a website.
* `README.md`: the starting place for your collaborators. Edit the template's text to suit your project. It should tell them how to use the project.

### Files and folders to ignore

You should keep the following files and folders, but you can largely ignore them.

* `.sass-cache`: after your first output, Jekyll creates this folder to make styles build faster next time. You can ignore it. If you delete it, that's fine, Jekyll will just rebuild it.
* `.gitignore`: tells Git what not to track. You shouldn't need to edit it. Advanced users may want to adjust it.
* `.jekyll-metadata` is created by Jekyll. You can ignore it. If you delete it, Jekyll will build it again.
*  `CHANGELOG.md`: the list of things we've changed in the template. You can ignore this unless you're curious. It can be useful to compare to newer version of the template, if you want to see what your older version doesn't have.
* `Gemfile` and `Gemfile.lock`: determines which versions of Ruby gems your project uses. You'll rarely have to chance this unless you know exactly why you're changing it.
* `LICENSE`: the license terms under which this template is created.
* `node_modules`: once you install Gulp and its dependencies for a project, you'll also see this folder in your project. You can ignore this. If you delete it, you'll need to run the output script's 'Install dependencies' step again. It will not be tracked by Git.
* `package.json` and `package-lock.json`: determines which Node modules your projects needs for things like image processing and building apps. Most users can ignore this file. Advanced users may need to edit it to use new Node modules.
