---
title: Quick start
categories: setup
order: 0
---

# Quick start

It's possible to create a new project online and start editing it within minutes.

## Create a new project

1. Go to [github.com/electricbookworks/electric-book](https://github.com/electricbookworks/electric-book/) and click 'Use this template'. Follow the prompts to create a new repository for your project.

2. Your new project on GitHub will have a URL that looks like `https://github.com/your-name/your-project-name/`.

   Click in the address bar, and at the start of that line, insert `gitpod.io/#`, and hit Enter.

   Follow the prompts to launch your editing interface in Gitpod.

3. After a few minutes, when the Gitpod Terminal is ready, enter this command to serve a website of your project:

   ```sh
   npm run electric-book -- output
   ```

   When prompted, open the generated site in your browser and add `/electric-book/` to the address in the address bar. E.g.:

   ```
   https://4000-electricboo-electricboo-u3np6cdtayw.ws-eu116.gitpod.io/electric-book/
   ```

You're up and running! From here, you can make the project your own.

Note that the template includes two books:

- `book`: a bare-bones book to start working in; and
- `samples`: a long book containing loads of examples.

To find out how to add your own text from a Word file, see ['Setting up a book' > 'Importing a text file'](setting-up-a-book.html#importing-a-text-file).

## Edit and design the book

1. Open `_data/works/[book]/default.yml` (where `[book]` is the name of your new book folder) and replace the sample information there with your project and book information.

2. In the book's folder, edit and add markdown files. If you create new ones, add their names to the `files` and `nav` lists in `_data/works/[book]/default.yml`.

3. To change the design, edit the `.scss` files for each output format. You create project-wide styles in `_sass`, and book-specific styles in `book/styles`. We suggest making all modifications in `_sass/custom`.

   See [the 'Design' section](../layout/design.html) for more detail.
