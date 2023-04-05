---
title: Epub output
categories: output
order: 3
---

# Epub output
{:.no_toc}

* Page contents
{:toc}

You can create an epub by running the output script with the epub option, and your book folder for the `book` option, e.g.:

``` shell
npm run electric-book -- output --format epub --book great-expectations
```

Before that will work, though, your project must be prepared correctly.

## Package files

The template comes with `package.opf` and `toc.ncx` files in the `book` and `samples` folders. For epub output, every book you create should have at least the `package.opf` file in its directory. The `toc.ncx` is for backwards compatibility with older epub readers, and so some vendors require it.

If you're creating translations, you also need these files in the translation directory (e.g. at `great-expectations/fr/package.opf`). There is an example in the template's `samples` book directory.

## Metadata and settings

Your epub will build correctly only if you have provided sufficient, accurate information about it in its YAML file in `_data/works/`. You may also need to adjust some epub settings in `_data/settings.yml`.

1. File list: you must list all the files to be included in your epub in the epub `files` section of your book's YAML file in `_data/works`.
2. Optionally, add guide names to key files in that list, e.g. `"0-0-cover": "cover"`.
3. There must be a `nav` section in your book's YAML file in `_data/works` that points to at least one of your epub's files. For epubs, every item in the `nav` must include a file (unlike web output, where label-only items are allowed).
4. To tell the epub package where to find navigation, you must either:
	1. Define the epub's `contents-page` item, as the content file that contains {% raw %}`{% include toc %}`{% endraw %}, e.g. `- contents-page: "0-3-contents"`, and/or
	2. Add the guide name `"toc"` to the relevant file in the `files` list (e.g. `- "0-3-contents": "toc"`).
5. Since EPUB3 requires a `nav` element, it is mandatory to include {% raw %}`{% include toc %}`{% endraw %} somewhere in your book, even if it's a file, listed at the end of your `epub` `files` list, that contains only:

	{% raw %}
	``` md
	---
	---

	{% include toc %}
	```
	{% endraw %}

6. If your epub must not include a *visible* table of contents in its pages (e.g. for a novel with no chapter headings), you can hide it visually by setting `hide-nav: true` in the `epub` section of `settings.yml`.
7. If you're using a `toc.ncx` file for backwards compatibility with old ereaders, you have to be especially careful with how you construct your epub `toc` tree in the book's `_data/works` file.

	In an NCX, you cannot have two items in nav pointing to the same target. So in your epub `toc` in your book's YAML file in `_data/works`, you can't have two items with the same `file` and `id`. To differentiate them, you add an `id` pointing to, say, a heading in the document to differentiate one target in the same file from another.

	Also, in an NCX, every item must include a link. So if an item in your toc has no link, and only children items, then in the `toc.ncx` the Electric Book will create a link for it. It will use the `file` (without the `id`) of its first child. So, to ensure that you don't get duplicate links, you must add an `id` to that first child. This way, the parent will point to the `file`, and the first child item will point to the `file` + `id`.

## Fonts

To embed font files in an epub (for `@import`ing in your epub's CSS), add the font files to `_epub/assets/fonts`.

Font files stored anywhere else in your project (e.g. in the main `assets/fonts` folder) are not included in epub outputs. This ensures that the epub includes only those font files that are specifically required for your epub.

Currently, the template does not support using different fonts for different epubs. If you are embedding fonts in your epubs, you must use the same ones for all your books.

## Javascript

See the [Javascript](../advanced/javascript.html) section for more detail.

## SVG images

If you include SVG images *inline* in an epub file – that is, the `<svg>` markup itself is in the final HTML, not just linked in an `<img src="*.svg">` element, you need to indicate that the file includes an inline SVG. This is because for an epub to be valid, the `package.opf` file must flag when a file includes inline SVGs.

In order to do this, you must add this to the file's YAML frontmatter:

```yaml
contains-svg: true
```

If you have many files that contain SVGs, you can set this value as a frontmatter default in `_config.yml`. E.g. if all your projects' title pages include inline SVG, you might include this in `_config.yml`:

```yaml
defaults:
  -
    scope:
      path: "*/01-title-page.html"
    values:
      contains-svg: true
```

## HTML transformations

You may want to make universal changes to your epubs' HTML when epubs are generated. These are called transformations. The template already includes one simple transformation for accessibility purposes: the `epubAriaSidenotes` transformation gives all elements with the class `sidenote` the ARIA attribute `role="note"`.

To add a transformation, add a file containing a single function to `_tools/gulp/transformations/epub`. For the structure of the function, copy one of the existing files there. For syntax, these functions use [Cheerio](https://cheerio.js.org/docs/api/classes/Cheerio#manipulation-methods).

## Troubleshooting

Epubs are notoriously hard to make, largely because validation is so strict. Here are some tips that may be useful when troubleshooting.

1. If you get errors from EpubCheck, the error will usually report the file name, line and column number of the content with the error. For instance, `(1,4587)` means that the error is on line 1, column (or character) 4587.

	Open the relevant file with the error in an editor that shows you the line and column/character position of your cursor. Then move your cursor to the relevant line and column number. When the error applies to a specific element, the column position is usually at the end of the offending element.

2. If you've used named HTML entities like `&nbsp;` in HTML snippets, kramdown may not have processed those as markdown, and therefore will not have converted them to unicode characters. Named entities are not valid in epub 3, and you'll need to replace them with their numeric equivalents, such as `&#160;` instead of `&nbsp;`.
3. If you get errors about your navigation or TOC (`nav`), see the guidelines on [Metadata and settings](#metadata-and-settings) above. The `toc.ncx` file is particularly sensitive.
4. Make sure your book has a `package.opf` file in its book directory. You can copy this from the Electric Book template. (It uses the `epub-package.html` include to generate the epub's metadata and manifest.)

> ## How epubs are generated
>
> This is technical background on how we generate Electric Book epubs. It's a two-step process.
>
> 1. In Jekyll, using an epub config file (`_configs/_config.epub.yml`), we generate:
>
>    1. the books, with each translation in a subfolder. Each book and translation has a `package.opf` file.
>    2. an `epub` folder (as a Jekyll collection) containing a boilerplate `META-INF` folder, `mimetype` file, and `mathjax` folder; and optional `js` and `fonts` folders.
>
> 2. In our output script:
>
>    1. We copy the relevant book or translation folders from `_site/book` (or whatever folder `book` has been renamed to) into `_site/epub`. We retain the subdirectory structure of translations, except for the `package.opf`, which goes to the root of `epub`.
>    2. We zip the contents of `epub` to `_output/book.zip` (where `book` may be a renamed book folder), and change the file extension to `.epub`.
{:.box}
