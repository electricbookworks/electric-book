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

Each project comes with a library of predefined styles in the `_sass/template` folder. Generally, you should not change these styles. Rather, extend and override them with your own theme, which you define in the files in `_sass/theme`.

That's where you set or change styles that affect all the books in your project.

Then, each book's styles can build on or override those project-wide styles in the `.scss` files in its own `styles` folder (e.g. `book/styles/web.scss`).

> **Electric Book Manager users**
>
> By default, you cannot edit the project's predefined styles in the Electric Book Manager.
>
> Files that users cannot see in the EBM, such as advanced technical files, are included in the `ignore` list in `/_prose.yml`.
{:.box}

## Edit project-wide styles

Usually, you'll define styles for all the books in your project by editing only the files in `_sass/theme`. Any colours, variables, `@import`s or CSS/Sass rules there will override the template styles.

- All style variables (such as `$page-width`) should be set in `_sass/theme/*-variables.scss`, where `*` is the format you're working on. It's best practice to include the `!default` flag on your variable values here, so that you can still override them per-book if necessary.
- Similarly, all `@import`s, such as Google Fonts, should be included in `_sass/theme/*-imports.scss`.
- Similarly, all new CSS/Sass rules should be added to `_sass/theme/*-rules.scss`. It's best practice to keep your rules organised by creating new partials (new `.scss` files) in `_sass/theme/partials` and `@include`ing them here.

This file structure also makes it possible to add a pre-built theme easily by copying the theme files to `_sass/theme`.

## Edit a book's styles

This is for when you want one book in your project to have different styles to the other books.

1. Go into the book's folder, then into `styles`, and open the `.scss` file for the output format that you want to edit. For example, to change the print-PDF styles for the book in the `book` directory, edit `book/styles/print-pdf.scss`.
2. Many of a book's design features are set as variables, which start with `$` signs. E.g. `$page-width`. Set your desired values by defining variables. For instance, you can change the values for page size, colours, running heads, and so on. All available variables are defined, with defaults, in `_sass/template/print-pdf.scss` (and similarly for other output formats).
3. If you know how to write CSS or Sass, add your own custom styles at the bottom of the book's relevant `.scss` file.

Output the relevant format to see how your changes look. If the output fails, you may have used invalid CSS or Sass syntax. For more on editing Sass, see [sass-lang.com/guide](https://sass-lang.com/guide).
