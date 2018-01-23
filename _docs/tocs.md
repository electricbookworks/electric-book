---
title: Tables of contents
categories: editing
---

# Tables of contents
{:.no_toc}

We create tables of contents (and contents navigation bars for the web) in the `_data/meta.yml` file of the Electric Book template. The data in the `meta.yml` file is written in a syntax called yaml, which is very strict (e.g. a slight error in indentation can prevent your whole book from building), but once you get the hang of it, adding your book's information for output will be easy enough. You can test whether your yaml is valid by pasting it into the box on [yamllint.com](http://www.yamllint.com/) and clicking ‘Go’. The yamllint validator will tell you whether it is valid or not, and will tell you on which lines errors appear with relative accuracy. 

The `_data/meta.yml` file includes all of the metadata of your book, from the series name and ISBN to the names of each file for your contents page. By default, the title page, copyright page and contents page pull information from the `_data/meta.yml` file. To add files to the table of contents, in the `works:` section, and then in the directory section for your particular book, and then under `products:`, scroll down to the format you are interested in and create a `toc:` section. Follow the template's example for adding a `file`, `label` and optionally an `id` and `class` for each TOC entry. (If you only add a TOC for print or web output, the template will try to read that TOC for the other formats, too, so that you don't have to repeat your `toc` for every format. If you want a different TOC for a given format, you can give that format it's own `toc` section).

There is more detail below.

## File lists and tables of contents for print PDFs

In this case we want to add files to the first section under ‘products:’, for the print PDF output. Under ‘print-pdf:’, add code for your new files exactly as done for the template so far: under ‘files:’, add a hyphen followed by the filename in straight double quotes. This filename is the exact name of the file as it is in your project, but without the ‘.md’ file extension. 

~~~
        files:
          - "0-1-titlepage"
          - "0-2-copyright"
          - "0-3-contents"
          - "01"
          - "02"
~~~

Once you have listed all the files that should be included in the print PDF there, scroll down to the ‘toc:’ section (for the table of contents), and include the `label`, `file` and optionally an `id` for each chapter in your book, and optionally subsections of those chapters as `children`.

The `label` can be anything you want, but is usually the heading of the section you are including in the table of contents, since the label is what displays in the table of contents. The `file` is the filename of the file that heading refers to, without its ‘.md’ file extension. The optional `id` is thte slug of the heading (the heading stripped of spaces, punctuation, and uppercase letters).

~~~
          - label: "Chapter 1"
            file: "01"
            id: "1-hello-world"
          - label: "Chapter 2"
            file: "02"
            id: "2-goodbye-world"
            children: 
              - label: "subsection"
                file: "02"
                id: "example-id"
~~~

For the print PDF, `id`s ensure the TOC contains accurate page numbers in books where the chapter starts with a blank left-hand page.

Note that within a file, an `id` can only be used once, as `id`s are unique. So, for example, if you have two subsections in one file both titled ‘Extra Information’, the `id`s will likely be ‘extra-information-1’ and ‘extra-information-2’. If you are having trouble finding the slug for the `id`: generate a web version of your book, go to the heading, right click on it and choose ‘Inspect’ (you may need to choose the click option in the inspect box, or cmd Shift C on Mac to get element-specific information). In the Elements box you should see a line of code that gives you the element’s `id`. For a heading level 1 called ‘Chapter 5: Animals’, the `id` is shown in this line of code followed by the label:

~~~
<h1 id="chapter-5-animals">Chapter 5: Animals</h1>
~~~

Where `chapter-5-animals` is the id. (Note that to make it easier to find the web files from the website navigation, they must be included in your web output in the ‘nav:’ section of `_data/meta.yml`. Otherwise you have to know the URL of the page you're looking for and enter it directly into the browser's address bar.)

You can optionally add a `class` line to specify the [class](classes.html) of an element. For example, frontmatter in the book (such as a copyright page which you might want to look different from text content) can be given a different style by adding the line `class: "frontmatter-reference"` to the node of the metadata where you defined its `label`, `file` and `id`. By default, `frontmatter-reference` in PDF output can provide a lower-roman-numeral page number, if `lower-roman` has been set in the `$frontmatter-reference-style` variable in your book's `-pdf.scss` stylesheets.

## Adding a contents (nav) sidebar for web navigation

If you want to list files or locations in the web navigation, under `web:`, and under `nav:` add code for your new files as done in the template.

The `nav` section is constructed exactly as the `toc` section is.

An entry looks like this:

~~~
          - label: "Chapter Two"
            file: "02"
            id: "2-goodbye-world"
~~~

Each significant section in the book should get a label (which will display in the web navigation bar), and should include at least a `file` and a `label`. Optionally, include an `id` for deep linking within the file. The `label` can be anything you want, but is usually the name of the section’s heading within the book.

To nest items, add them to a `children` subsection. For instance, if a section or heading in the book has subsections or subheadings which you’d like to include in the contents page and navigation, you need to add ‘children:’ below the parent heading's information, and then add `label`s, `file`s, and optionally `id`s for the children on the following lines, with a greater degree of indentation than the parent’s information. Like this:

~~~
          - label: "Chapter Two"
            file: "02"
            id: "2-goodbye-world"
            children: 
              - label: "subsection"
                file: "02"
                id: "example-id"
~~~

You can optionally add a line to specify the class of an element. For example, frontmatter in the book (such as a copyright page which you might want to look different from text content) can be given a different style by adding the line `class: "frontmatter-reference` to the node of the metadata where you defined its `label`, `file` and `id`.

Once you have constructed your metadata for all of the outputs of the book that you're outputting (for example, print PDF and web formats), use `{% include toc %}`, which generates a table of contents, in the markdown file dedicated to your table of contents. In the default template this is the `0-3-contents.md` file.


