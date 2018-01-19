---
title: Tables of contents
categories: editing
---

# Tables of contents
{:.no_toc}

We create tables of contents (and contents navigation bars for the web) in the `meta.yml` file of the Electric Book template. The data in the _data/meta.yml file is written in a language called Yaml, this language is extremely precise (a slight difference in indentation can prevent your whole book from working), but once you get the hang of it, adding your files for output will be easy enough. You can test whether your Yaml is valid by pasting it in http://www.yamllint.com/ and clicking ‘Go’. The yamllint validator will tell you whether it is valid or not, and will tell you on which lines errors appear with relative accuracy. 

In essence, the `_data/meta.yml` file includes all of the metadata of your book, from the series name and ISBN, to the names of each file for your Contents page. The Title Page, Copyright Page and Contents Page pull information from the `_data/meta.yml` file. In terms of adding files for inclusion in the Contents, under `Works:`, under the directory for your particular book, under `products:` scroll down to the format you are interested in (if you want the chapters included in all formats you need to add information to each format’s section). 

## Tables of contents for print PDFs

In this case we want to add files to the first section under ‘products:’, for the print PDF output. Under ‘print-pdf:’, add code for your new files exactly as done for the template so far: under ‘files:’, add a hyphen followed by the filename in straight double quotes. This filename is the exact name of the file as it is in your project, but without the ‘.md’ file extension which we use when we create those files. 

~~~
        files:
          - "0-1-titlepage"
          - "0-2-copyright"
          - "0-3-contents"
          - "01"
          - "02"
~~~

Once you have added all of your text files there, scroll down to the ‘toc:’ section (for the Table of Contents), and include the label, file and id for each chapter in your book, and optionally subsections of those chapters. The label can be anything you want, but is usually the heading of the section you are including in the Table of Contents, since the label is what displays in the Table of Contents. The file is the filename of wherever that heading is found, without its ‘.md’ file extension, and the id is a slug of the heading (the heading stripped of spaces, punctuation, and uppercase letters).

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

While for web versions ids are optional, for the print PDF, ids provide accurate page numbers. Note that within a file, an id can only be used once, as ids are unique. So if you have two subsections in one file, both titled ‘Extra Information’, the ids will likely be ‘extra-information-1’ and ‘extra-information-2’. If you are having trouble finding the slug of the label for the id, if you generate a web version of your book, go to the particular heading, right click on it and choose ‘Inspect’, you can scroll over the heading (you may need to choose the click option in the inspect box, or cmd Shift C on Mac to get element-specific information), and in the Elements box you should see a line of code that gives you the element’s id. For a heading level 1 called ‘Chapter 5: Animals’, the id is shown in this line of code followed by the label:

<h1 id="chapter-5-animals">Chapter 5: Animals</h1>

Where ‘chapter-5-animals’ is the id. Note that you cannot view elements on the web version if those files have not been included in your web output in the ‘nav:’ section of  _data/meta.yml. 

You can optionally add a line to specify the [class](_docs/classes.md) of an element. For example, frontmatter in the book (such as a copyright page which you might want to look different from text content) can be given a different style by adding the line `class: "frontmatter-reference"` to the node of the metadata where you defined its label, file and id. By default "frontmatter-reference" creates a small deviation in style from the book's chapters, and in print, can provide a lower roman numeral page number if that has been set in the `$frontmatter-reference-style` variable in your print stylesheet.

## Contents bars for web navigation

If we want to add files to the web version and include them in the Contents for web navigation, under `Web:`, under `files:` add code for your new files exactly as done for the template so far. 

For instance, Chapter Two’s file is included with `   - "02": "Chapter Two"`, notice that Chapter Two as a file for editing (file 02) must have a `.md` file extension, although when we include the file in the metadata, we leave the file extension out and just use “02”. The hyphen and filename in straight double quotes is followed by a colon and the more human name for the file in straight double quotes, this ‘human name’ is the name of the chapter as readers of the book should see it. Once you have added the files there, scroll down to the `nav:` section, this section controls the `Contents` navigation bar on the web version of your book. 

An entry looks like this:

~~~
          - label: "Chapter Two"
            file: "02"
            id: "2-goodbye-world"
~~~

Each significant section in the book should get a label (which will display in the web navigation bar), and should include at least a file (which links a whole file to a contents element), and optionally an id for deep linking within the book (this links a particular element in a file to a contents element). The label can be anything you want, but is usually the name of the section’s heading within the book. The indentation of the label determines what level heading it is. Follow this label with file (omitting the file extension again), and optionally an id (which is just a [‘slug’](https://blog.tersmitten.nl/slugify/) of the section’s heading) If a section or heading in the book has subsections or subheadings which you’d like to include in the contents page and navigation, you need to add ‘children:’ below the parent headings information, and then add labels, files, and optionally ids for the children on the following lines, with a greater degree of indentation than the parent’s information. Like this:

~~~
          - label: "Chapter Two"
            file: "02"
            id: "2-goodbye-world"
            children: 
              - label: "subsection"
                file: "02"
                id: "example-id"
~~~

You can optionally add a line to specify the [class](_docs/classes.md) of an element. For example, frontmatter in the book (such as a copyright page which you might want to look different from text content) can be given a different style by adding the line `class: "frontmatter-reference` to the node of the metadata where you defined its label, file and id. By default "frontmatter-reference" creates a small deviation in style from the book's chapters, and in print, provides a lower roman numeral page number.

Once you have constructed your metadata for all of the outputs of the book that you're interested in (for example for print PDF and web formats), make sure `{% include toc %}` is included in the top of the markdown file dedicated to your Table of Contents. In the default template this is the `0-3-contents.md` file.


