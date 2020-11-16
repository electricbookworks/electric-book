---
title: Design
categories:
  - layout
order: 1
---

# Design books
{:.no_toc}

* Page contents
{:toc}

The design of your books is created in CSS stylesheets. These are written in Sass or CSS syntax. Each output format has a dedicated stylesheet:

- `print-pdf.scss`
- `screen-pdf.scss`
- `web.scss`
- `epub.scss`
- `app.scss`

By default, the screen PDF inherits its styles from the print PDF design, except for trim and crop marks (none on screen PDF) and the colour profile (RBG in screen PDF, CMYK in print PDF). Also by default, the app inherits the web styles.

Some aspects of design are easy for non-technical users to change. Some advanced design features need to be coded by an experienced CSS developer.

Each project comes with a library of predefined styles in the `_sass` folder. That's where you set or change styles that affect all books in a project.

Then, each book's styles can build on or override those project-wide styles in the `.scss` files in its own `styles` folder (e.g. `book/styles/web.scss`).

> **Electric Book Manager users**
>
> By default, you cannot edit the project's predefined styles in the Electric Book Manager.
>
> Files that non-technical users need not see in the EBM, such as advanced technical files, are hidden by adding them to the `ignore` list in `/_prose.yml`.
{:.box}

To edit a book's styles:

1. Open the `.scss` file for the output format that you want to edit. For example, to change the print-PDF styles only for the book in the `book` directory, edit `book/styles/print-pdf.scss`.
2. Many of a book's design features are set as variables, which start with `$` signs. E.g. `$page-width`. Change the values you see there for each variable as needed. For instance, you can change the values for page size, colours, running heads, and so on.
3. If you know how to write CSS or Sass, add your own custom styles at the bottom of the `.scss` file.

Output the relevant format to see how your changes look. If the output fails, you may have used invalid CSS or Sass syntax. For more on editing Sass, see [sass-lang.com/guide](http://sass-lang.com/guide).
