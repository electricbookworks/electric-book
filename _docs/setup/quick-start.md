---
title: Quick start
categories: setup
order: 0
---

# Quick start
{:.no_toc}

You can create a new project online in just a few minutes. You will need a [free GitHub account](https://github.com/signup).

If you're comfortable using the Electric Book template on your own, enjoy! If you need professional assistance, you can hire [Electric Book Works](https://electricbookworks.com). We are always happy to have a friendly conversation about what's possible.
{:.box}

## Create a new project

1. Go to [github.com/electricbookworks/electric-book](https://github.com/electricbookworks/electric-book/) and click 'Use this template'. Follow the prompts to create a new repository for your project.

2. Your new project on GitHub will have a URL that looks like `https://github.com/your-name/your-project-name/`. Look for the green 'Code' button on the right side of the page, and click the dropdown arrow on that button. In the 'Codespaces' tab, click 'Create codespace on main'. This will create a new Codespace for your project. A Codespace is a virtual machine that runs in the cloud, with a terminal and an editor interface.
3. Wait a few minutes for the Codespace to be created. When it's ready, you will see a terminal window open in the Codespace, and the editor interface with a file list on the left.

## Generate a website

1. When the terminal is ready, enter this command to serve a website of your project:

   ```sh
   npm run electric-book -- output
   ```

2. When prompted, choose the 'Open in browser' option, which will open a new tab. Add `/electric-book/` to the address in the address bar. That is your project's base URL. E.g.:

   ```
   https://upgraded-zebra-7vr67g945r2xqq4-4000.app.github.dev/electric-book/
   ```

   (Your can change your base URL in future by editing it in your `_config` files.)

3. You should see the home page of your website. For now, it will be identical to the [template's home page](https://electricbookworks.github.io/electric-book/). From here, you can make the project your own by adding content and changing the design ([more detail below](#edit-and-design-the-book)).

   Note that the template includes two books:

   - `book`: a bare-bones book to start working in; and
   - `samples`: a long book containing loads of examples.

   To add your own text from a Word file, see ['Setting up a book' > 'Importing a text file'](setting-up-a-book.html#importing-a-text-file).

4. To stop your website, in order to run other processes, in the terminal press `Ctrl + C`.

## Generate PDFs

To generate a print-ready PDF of the `samples` book, enter:

```sh
npm run electric-book -- output --book samples --format print-pdf
```

To generate a screen PDF (aka 'PDF ebook') of the `samples` book, enter:

```sh
npm run electric-book -- output --book samples --format screen-pdf
```

## Generate an EPUB

To generate an EPUB of the `samples` book, enter:

```sh
npm run electric-book -- output --book samples --format epub
```

## Edit and design the book

1. Open `_data/works/[book]/default.yml` (where `[book]` is the name of your new book folder) and replace the sample information there with your project and book information.

2. In the book's folder (e.g. the `book` and `samples` directories are the template's book folders), edit and add markdown files. If you create new files, add their names to the `files` and `nav` lists in `_data/works/[book]/default.yml`.

3. To change the design, edit the `.scss` files for each output format. You create project-wide styles in `_sass`, and book-specific styles in `book/styles`. We recommend making all modifications in `_sass/custom`.

   See [the 'Design' section](../layout/design.html) for more information, including importing existing base designs.
