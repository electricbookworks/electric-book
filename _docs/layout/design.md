---
title: Design
categories:
  - layout
order: 1
---

# Designing books
{:.no_toc}

* Page contents
{:toc}

The design of your books is created in CSS stylesheets. These are written in Sass or CSS syntax. Each book's `styles` folder has a dedicated stylesheet for each output format:

- `print-pdf.scss`
- `screen-pdf.scss`
- `web.scss`
- `epub.scss`
- `app.scss`

By default, the screen PDF inherits its styles from the print PDF design, except for trim and crop marks (none on screen PDF) and the colour profile (RBG in screen PDF, CMYK in print PDF). Also by default, the app inherits the web styles.

Some aspects of design are easy for non-technical users to change. Some advanced design features need to be coded by an experienced CSS developer. Get started, and see how you go.

## Book, template, base, and custom styles

The Electric Book template has a flexible but complex system for styling at different levels.

- Each book can have its own styles in its own `styles` folder. In practice, book-level styles are rarely used. By default, each book just imports the `template` styles in the project's `_sass` folder.
- The `template` styles provide basic conventions that are almost universal in book design, like a table of contents and running headers. These basics are unopinionated, 'vanilla' styles with little personality. You should generally avoid modifying the files in `template` in case you want to update your project from the latest Electric Book template styles later.
- After laying the foundations, the `template` styles then include the styles in the `custom` folder. This is where you can create your own designs that override and extend the `template` styles. (More on this below.)
- Finally, the `custom` styles import an optional `base` design in the `base` folder. Base designs are a quick way to copy an existing design that might have lots of personality. By default, the `base` folder in `_sass` is empty of styles. Your `custom` styles extend any base design, rather than starting from the plain vanilla `template` styles. See the `README` file in `_sass/base` for guidance.

Electric Book Works creates base designs for its clients. If you are interested in licensing or commissioning a base design, [contact our team](https://electricbookworks.com/contact/).
{:.box}

## Editing `custom` styles

Usually, you'll define styles for all the books in your project by editing only the files in `_sass/custom`. Any colours, variables, `@import`s or CSS/Sass rules there will override the `template` styles.

- All style variables (such as `$page-width`) should be set in `_sass/custom/*-variables.scss`, where `*` is the format you're working on. It's best practice to include the `!default` flag on your variable values here, so that you can still override them per-book if necessary.
- Similarly, all `@import`s, such as Google Fonts, should be included in `_sass/custom/*-imports.scss`.
- Similarly, all new CSS/Sass rules should be added to `_sass/custom/*-rules.scss`. It's best practice to keep your rules organised in `_sass/custom/partials` and `@import` them.

The variables, imports, rules and partials for a `base` design are organised in the same way.

## Non-book styles in `assets`

Web and app outputs of your project include pages that are not inside a book, like the landing `index` page, `contact` and `about`. In the same way that each book has a `styles` folder, these pages get their styles from `assets/styles`, which also then include the `template`, `custom` and `base` styles.
