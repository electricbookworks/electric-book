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

## How it works

Very broadly, this is how the Electric Book template works.

* The template is set up as a Jekyll project, with lots of predefined defaults in snippets of code. When you run the template's `run-` script for your operating system, Jekyll combines those snippets and your content into HTML pages. (See ['Using the template'](#using-the-template) below for detail on the template's structure, and [Jekyll's docs on structure](https://jekyllrb.com/docs/structure/).)
* You store your markdown content in a book's `text` folder, and images in its `images/_source` folder. You create your designs in the stylesheets in its `styles` folder. You store project settings in `_data/settings.yml` and book metadata in `_data/meta.yml`.
* Depending which options you select when you run the `run-` script, the script might then:
	* pass the finished HTML to Prince to convert to PDF
	* serve the finished HTML as a website that you can browse on your machine
	* move and zip the finished HTML into an epub
	* pass the finished HTML to Cordova to wrap into an app
	* pass the finished HTML to Pandoc to convert to Word
	* run the finished HTML through PhantomJS to build a search index.
* The `run-` script also lets you choose to process images. It converts any images in a book's `_source` folder into variations for print-PDF, screen-PDF, web, epub and apps.

Now we can go into more detail.

## Key structural concepts

Here are some of the main technical features of the template and how they work.

### Folder (repo) structure

A workflow folder (often tracked in Git as a repo) usually contains a set of related books. Its folders and files follow the [standard Jekyll structure](http://jekyllrb.com/docs/structure/). We then put each book's content in its own folder. In the template, the first book folder is simply called `book`.

### Using the template

The Electric Book repo (folder) is ready to use for a set of one or more books. In short, to get up and running, see the [Quick Start guide](setup/quick-start.html).

Now, let's get into some more detail about how it all works. There are several folders and files in the Electric Book template's root directory.

#### Folders

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

#### Files

*   `_config.yml`: a file for setting configuration options for Jekyll, which will compile your book for output.
*   `_prose.yml`: configuration settings for using [prose.io](http://prose.io) for online book editing (generally, you won't have to edit this file) and for excluding files from view in the [Electric Book Manager](https://electricbookworks.github.io/electric-book-gui/).
*   `index.md`: the home page of your project when served as a website.
*   `search.md`: the search page of your project when served as a website.
*   `.bat`, `.command` and `.sh` scripts for quickly generating books in different formats on various operating systems.
*   `CNAME`: you can delete this, or if you're using a custom domain with GitHub or similar hosts, you'll edit it to your own project's domain name.
*   `gulpfile.js`: the 'recipe' for processing images from `_source` into various output formats. Most users can ignore this. Advanced users may want to adjust it, or use it for processing and minifying Javascript.
*   `README.md`: the starting place for your collaborators. Edit the template's text to suit your project. It should tell them how to use the project.

#### Files and folders to ignore

You should keep the following files and folders, but you can largely ignore them.

*	`.sass-cache`: after your first output, Jekyll creates this folder to make styles build faster next time. You can ignore it.
*	Once you install Gulp and its dependencies for a project, you'll also see a `node_modules` folder in your project. You can ignore this, but don't delete it. It will not be tracked by Git.
*   `.gitignore`: tells Git what not to track. You shouldn't need to edit it.
*   `.jekyll-metadata` is created by Jekyll. You can ignore it.
*	`CHANGELOG.md`: the list of things we've improved in the template. You can ignore this unless you're curious. It can be useful to compare to newer version of the template, if you want to see what your older version doesn't have.
*   `eslint.json`: advanced users might use this when processing Javascript with our Gulpfile. Most users can ignore it.
*   `Gemfile` and `Gemfile.lock`: determines which versions of Ruby gems your project uses. You'll rarely have to chance this unless you know exactly why you're changing it.
*   `LICENSE`: the license terms under which this template is created.
*   `package.json` and `package-lock.json`: determines which Node modules your projects needs for things like image processing and building apps. Most users can ignore this file. Advanced users will need to edit it to use new Node modules.

There are other files in the root directory that are important to the template. Leave them as is, unless you really know what they are and what you're doing.
