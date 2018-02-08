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

The design of your books is created in CSS stylesheets. These are written in a syntaxes called CSS or Sass. Each output format has a dedicated stylesheet:

- `print-pdf.scss`
- `screen-pdf.scss`
- `web.scss`
- `epub.scss`
- `app.scss`

Some aspects of design are easy for non-technical users to change. Some advanced design features need to be coded by an experienced CSS developer.

Each project comes with a library of predefined styles. Then each book's styles can build on or override the predefined project styles.

By default, you cannot edit the project's predefined styles in the Electric Book Manager.

> Technical note: files that non-technical users need not see in the EBM, such as advanced technical files, are hidden by adding them to the `ignore` list in `/_prose.yml`. These are hidden in the EBM with `display: none`; so they can be revealed by turning off `display: none` with a browser's Inspect tools.

To edit a book's styles:

1. From the editor, click on the `.scss` file for the output format that you want to edit. For example, for print-PDF styles for the `book` directory, edit `book/styles/print-pdf.scss`.
2. Many of a book's design features are set as variables, which start with `$` signs. E.g. `$page-width`. Change the values you see there for each variable as needed. For instance, you can easily edit variables that set page size, colours, running heads, and so on.
3. If you know how to write CSS or Sass, add your own custom CSS at the bottom of the `.scss` file.

Output the relevant format to see how your changes look. If the output fails, you may have used invalid CSS or Sass syntax. For more on editing Sass, see [sass-lang.com/guide](http://sass-lang.com/guide).
