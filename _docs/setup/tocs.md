---
title: Navigation and TOCs
categories: setup
order: 30
---

# Navigation and tables of contents
{:.no_toc}

* Page contents
{:toc}

We create website navigation and tables of contents for books in the `_data/works` files of the Electric Book template. The `_data/works` files are written in a syntax called YAML, which is simple but very strict (e.g. a slight error in indentation can prevent your whole book from building), but once you get the hang of it, adding your book's information for output will be easy enough.

You can test whether your YAML is valid by pasting it into the box on [yamllint.com](http://www.yamllint.com/) and clicking ‘Go’. The yamllint validator will tell you whether it is valid or not, and will tell you on which lines errors appear with relative accuracy.
{:.sidenote}

Each book has its own folder in `_data/works`. And in each book's data folder, there is at least a `default.yml` file, which contains all the default metadata for that book. E.g. the title, ISBNs, and the names of each file for your contents pages.

As described below, in the YAML files in `_data/works`, you define website and app navigation menus in the `nav` sections. If you do not define a `nav` section, the template will generate your navigation menu from your markdown files directly. This auto-generated menu is usually less refined than a `nav` you've defined manually, but it is a quicker way to get going.

> For navigation for non-book pages like 'About us' and 'Contact us', see [Project-wide navigation](#project-wide-navigation) below.
{:.box}

## How to edit the nav and TOC

1. In the YAML file for your book, find the `products:` section, then scroll down to the output format you want to edit. E.g. `web:`.
2. Edit (or create, if it doesn't exist) a `toc:` section indented by two spaces below, say, `web:`.
3. For each navigation or table of contents entry, add a line for each of `file: ""`, `label: ""` and, optionally, `id: ""` and `class: ""`, for each TOC entry. The first line in the TOC entry should have a `-`, like a bullet point.
4. To nest entries beneath an entry, give the parent entry a `children:` line, then indented on the next line add `file: ""`, `label: ""`, and so on.

The `label` can be anything you want, but is usually the heading of the section you are including in the table of contents, since the label is what displays in the table of contents or navigation.

The `file` is the filename of the file that the item will link to, without a file extension.

The optional `id` is usually the slug of the heading (the heading stripped of spaces, punctuation, and uppercase letters).

Here is an example:

``` yaml
        nav:
          - label: "Chapter Two"
            file: "02"
            id: "2-goodbye-world"
            children:
              - label: "subsection"
                file: "02"
                id: "example-id"
```

If you only add a `toc` for print or web output, the template will try to read that TOC for the other formats, too, so that you don't have to repeat your `toc` for every format. If you want a different TOC for a given format, you can give that format it's own `toc` section.

> Note that the `toc` and `nav` sections in your book's YAML file in `_data/works` are structurally identical. In many projects they are the same except that one starts with `toc` and the other `nav`. A PDF will never need a `nav`, but a website output might have both a `toc` (which displays a Table of Contents on a body text page) and a `nav` (which defines the dropdown menu on a website).

## Using IDs for accurate linking

For PDFs, `id`s ensure that the TOC contains accurate page numbers in books where chapters start with a blank left-hand page.

Note that within a file, an `id` can only be used once, as `id`s are unique. So, for example, if you have two subsections in one file both titled ‘Extra Information’, the `id`s will likely be `extra-information` and `extra-information-1`.

If you are having trouble finding the slug for the `id`: generate a web version of your book, go to the heading, right click on it and choose ‘Inspect’ (you may need Cmd Shift C on Mac to get element-specific information). In the Elements box you should see a line of code that gives you the element’s `id`. For a level-1 heading called ‘Chapter 5: Animals’, the `id` is shown in this line of code followed by the label:

``` html
<h1 id="chapter-5-animals">Chapter 5: Animals</h1>
```

Here `chapter-5-animals` is the `id`.

Note that to see files in website navigation at all, they must be included in your web output in the `nav:` section of your book's YAML file in `_data/works`. Otherwise you have to know the URL of the page you're looking for and enter it directly into the browser's address bar.
{:.sidenote}

## Adding classes to control design

You can optionally add a `class` line to specify the [class](../editing/classes.html) of an element. For example, frontmatter in the book (such as a preface, whose entry in the TOC which you might want to look different from chapter content) can be given a different style by adding the line `class: "frontmatter-reference"` to the node of the metadata where you defined its `label`, `file` and `id`.

By default, `frontmatter-reference` in PDF output can provide a lower-roman-numeral page number, if `lower-roman` has been set in the `$frontmatter-reference-style` variable in your book's `print-pdf.scss` and/or `screen-pdf.scss` stylesheets.

## Generating the TOC

Once you have constructed your metadata for all of the outputs of the book that you're outputting (for example, print PDF and web formats), use:

{% raw %}
``` liquid
{% include toc %}
```
{% endraw %}

in a markdown file. This tag generates a table of contents. In the default template you can see this in the `0-3-contents.md` file.

## Epub TOCs

Epubs have special TOC needs. See the [epub output section on metadata](../output/epub-output#metadata-and-settings).

## TOCs outside of books

Sometimes you may want to place the TOC of a book on a page that isn't inside that book's directly – on the home page, for instance. To do this, you need to tell the `toc` include which book's TOC you're generating, like this:

{% raw %}

``` liquid
{% include toc book="moon-potatoes" %}
```

{% endraw %}

By default, the `toc` include will generate the TOC of the book in the `book` folder.

## TOCs of book parts

Sometimes you may want to output a TOC of only part of a book. For instance, say your book has four parts, each containing several chapters. You may want each part page to include a TOC of its chapters.

In your book's YAML file in `_data/works`, the chapters you want are listed within each part's `children` node.

To list only those in this TOC, you need to tell the `toc` include to start there, with the part's `children`.

To do this, you add a `start` parameter to the include tag, pointing to that `children` node.

It can take some advanced technical know-how to write the 'address' of that node of data. Here is an example.

We need to add the following two lines to our part page's markdown file. The first assigns the `children` node's data to a variable. The second includes the TOC on the page, using that variable. This example assumes that your book's folder is called 'book':

{% raw %}

```liquid
{% assign my-chapter-list = site.data.works.book.products[site.output].toc[4].children %}

{% include toc start=my-chapter-list %}
```

{% endraw %}

If you want to know how that works, let's break it down. In

``` liquid
site.data.works.book.products[site.output].toc[4].children
```

each dot or `[` means we're drilling down into the data by one level:

- `site.data.works` refers to all the data in `_data/works`.
- `.book` refers to your book's folder.
- `.products` refers to the products – or output formats – of the work.
- `[site.output]` refers to the current site output format, which will be one of the child nodes of `products`.
- `.toc` refers to that output format's `toc` node.
- `[4]` refers to the fifth item in the `toc` node, which in our example is the part for which we want to list the chapters.
- `.children` refers to the list of chapters inside that `toc[4]` part. That's what we want for our TOC!

Finally, in `start=my-chapter-list` we're telling the TOC include to start listing chapters at `my-chapter-list`, which we just defined.

## Project-wide navigation

Websites and apps can also include pages that are not part of a book, like 'About us' and 'Contact us'. These are created as markdown files in the project's root directory.

They are added to the nav by listing them in `_data/nav.yml`. That file is organised by language, since your project may include different languages.

If you only include nav items for your project language (e.g. `en` for English), then all translated pages will include the English items, too.

If you include translations in your `nav.yml`, you must include the relevant files that you point to in that language's folder in the project root. For example, if you have this entry in your `nav.yml`:

``` yaml
fr:
  - label: "À propos de nous"
    file: "about"
```

then you must have a `fr/about.md` file in your project, or the link in your navigation will not work.
