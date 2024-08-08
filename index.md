---
# Replace the text on this page with content
# for your your own project's landing page.
title: The Electric Book template
style: home
opener-image: banner-image.jpg
opener-image-alt-text: "An illustration of an enormous book. It is open, and its pages are each filled with an image of a starry sky. Beside the book, a man stands and looks at the pages. The book is bigger than he is."
opener-image-position: "0 60%"
---

# Book-making with superpowers

The Electric Book template is a code framework for producing **web books, ebooks, and print books from a single content source.** It is [packed with features for professional book production](#features), and lets team members collaborate on projects remotely. You're looking at the default website it generates. {% if  output-docs == true %}[Read the docs]({{ site.baseurl }}/docs/){:.button}{% endif %}


<div class="feature-boxes">

{% include feature-box
   text="The template includes [a blank book](book/0-3-contents.html) to add your content to."
   image="logo.svg"
   link="book/0-3-contents.html"
%}

{% include feature-box
   text="Learn from [a book of examples](samples/index.html), with a partial [translation](samples/fr/)."
   image="cover.jpg"
   image-position="0 35%"
   link="samples/index.html"
%}

{% if site.output == "web" and output-docs == true %}

{% include feature-box
   text="The template's [documentation](docs/) explains how its features work."
   image="banner-image.jpg"
   image-position="0 65%"
   link="docs/"
%}

{% endif %}

</div>

You'll find [the open-source repository on GitHub](https://github.com/electricbookworks/electric-book).

<div class="color-panel background-000 text-fff links-ccc" markdown="1">

## Skills required

To make books this way, you need some web-development know-how. You'll edit content in markdown with Liquid template tags; edit data in YAML files; commit your changes with Git; enter commands at the command line; and build and serve a static website. Design is done in Sass. Many features are written in Javascript.

If those concepts are not familiar to you, you'll need a web developer on your team to get you going, and to provide you with technical support when you get stuck.

You can also hire [Electric Book Works](https://electricbookworks.com) to handle setup or book production for you.

</div>

## Sample content

To see how these examples look in other formats, [download PDF and epub versions of the sample book](https://www.dropbox.com/scl/fo/uskmdm77do6s16r4mbwy4/AIrPyibgt3AFLumX-FFzYjk?rlkey=vuyn7dysx5w1d9texgemsioix&st=3nouz3mx&dl=0).

{% include visual-toc
   book="samples"
   files="
   * 00-05-contents-page
   * 01-01-plain-text-1
   * 01-10-questions
   * 02-01-plain-images
   * 02-02-figures
   * 03-02-maths
   * 04-02-video
   * 10-02-dynamic-index
" %}


<div class="color-panel text-000 links-ccc" markdown="1">

## How to start now

{% include video
   id="XmZ2mn8Vyy0"
   image="ebt-setup-video.png"
   description="Arthur Attwell, from Electric Book Works, explains how to start a new book in minutes."
   %}

</div>


## Features

### Web, mobile, and print

You can instantly output print PDF, screen PDF, epub, website and app versions of your books from a single content source.

### Series and collections

Create a series or collection of books in one website or app. They can share common designs, features and [metadata]({{ site.baseurl }}/docs/setup/metadata.html).

### Fast and mobile-friendly sites

The template generates a static website, which is secure, easy to host, and lightning fast. It's also designed to be mobile-friendly throughout.

### Windows, Mac, Linux

You can use the template on Windows, Mac and Linux computers. We recommend working in your browser with [Gitpod](https://gitpod.io), in which case you don't need to install anything on your computer.

### Documentation

The docs you need are embedded in your project, including guidance on [how to edit in markdown]({{ site.baseurl }}/docs/editing/markdown.html).

### Online editing

Team members can contribute online by either editing files on GitHub directly, or by using Gitpod. Our built-in Gitpod support means you can instantly start editing and generating a website, ebooks and PDFs. [Launch a testing environment here right now](https://gitpod.io/#https://github.com/electricbookworks/electric-book){:target="_blank"}.

### Export to Word

Sometimes you need your book in MS Word format. For instance, an author might be working on a new edition. You can easily, instantly [export books to MS Word]({{ site.baseurl }}/docs/output/word-output.html).


## Design and layout

### Built-in book features

Select from dozens of [built-in tags for common book features]({{ site.baseurl }}/docs/editing/classes.html), such as boxes, epigraphs, sidenotes and bibliographies.

### Easy design settings

We deliberately made this template look plain – it's ready for your design flair. Quickly change the design with [dozens of simple settings]({{ site.baseurl }}/docs/layout/design.html), from fonts and sizes to the position of page numbers and the width of your sidebar. Then add your own CSS stylesheets. [See the Electric Book Works portfolio for examples of what's possible](https://electricbookworks.com/work/).

### Mathematics

[Include complex maths]({{ site.baseurl }}/docs/editing/maths.html) using LaTex notation.

### Refined page typography

For high-quality print publishing, [control letter-spacing]({{ site.baseurl }}/docs/editing/classes.html#formatting) in individual paragraphs for page refinement. There are many other page-refinement tags available for advanced users.

### Optimised images

[Automatically convert your master images]({{ site.baseurl }}/docs/images/image-conversions.html) to optimized sizes and color profiles. For instance, CMYK for print, and RGB at different sizes for large vs mobile screens.

### Books indexes with automatic page numbers

Create back-of-the-book indexes where page numbering is automated, and the index works in website and ebook editions, too. [Read more at Electric Book Works](https://electricbookworks.com/thinking/dynamic-digital-book-indexes/).

### Print PDF profiles

Easily [control colour and PDF profiles]({{ site.baseurl }}/docs/layout/colour-profiles.html) for professional, large-scale printing.


## Translations and variants

### Translations

[Add translations]({{ site.baseurl }}/docs/setup/translations.html) of a book to a project, and localise (i.e. provide translations for) landing pages and button text.

### Variant editions

Instantly generate [variant editions]({{ site.baseurl }}/docs/setup/variants.html) of a book with different content or designs. For instance, a teacher's edition of a setwork with extra teaching notes, all from the same content source.

### Redacted PDFs

Tag text and images for redaction, then instantly [output fully redacted PDFs]({{ site.baseurl }}/docs/editing/redaction.html) without affecting page flow.


## Interactivity

### Bookmarking

Users can save their places, and the site will also automatically save their last location for the next time they visit.

### Search

Easily [build and refresh search indexes]({{ site.baseurl }}/docs/setup/search-indexes.html) for website and app outputs.

### Interactive questions

Add self-marking [multiple-choice questions]({{ site.baseurl }}/docs/editing/multiple-choice-questions.html), and group them into quizzes. Add [fill-in-the-blank questions]({{ site.baseurl }}/docs/editing/questions.html#fill-in-the-blanks) to any text.

### Video

Easily [embed streaming video]({{ site.baseurl }}/docs/editing/video.html) from YouTube or Vimeo.

### Collapsible pages

Make long web pages [collapse on major headings]({{ site.baseurl }}/docs/layout/content-accordion.html) for easier reading. [See a demo here](https://deploy-preview-471--electric-book.netlify.app/samples/01-01-plain-text.html).

### Clickable slides

Let users click through [slideshows]({{ site.baseurl }}/samples/04-05-slides.html), with useful equivalents in offline epub and PDF versions.


## Extending and integrating

### WordPress compatible

Do you already have a WordPress website? Electric Book websites live happily side-by-side with WordPress. Just place the generated files in a subfolder on your WordPress server.

### Annotation

[Turn on open annotation]({{ site.baseurl }}/docs/setup/settings.html#annotation) on website editions with [Hypothesis](https://hypothes.is). Useful for both public comment and private team discussions. [See annotation in action on this demo](https://deploy-preview-471--electric-book.netlify.app/).

### Open-source software

The template is [open-source software](https://github.com/electricbookworks/electric-book), so you never have to worry about being locked out of your own books, or finding yourself at the mercy of one vendor's pricing. You can change anything about the Electric Book software yourself, as needed.

Note that the template does use the excellent [PrinceXML](https://www.princexml.com/) for PDF output. Prince is not open-source, and is available as a free trial. We are [working on providing open-source alternatives](https://github.com/electricbookworks/electric-book/issues/382).


## Technical advantages

### Free hosting

You can host an Electric Book site for free with services like [GitHub Pages](https://pages.github.com/) and [Netlify](https://www.netlify.com/). The template works out of the box with both.

### Best-practice version control

The template is designed to work with [Git](https://www.atlassian.com/git) version control software. We recommend storing and collaborating on your project on GitHub, GitLab or BitBucket.

### Separate image storage

For books with many large images, link to [remote media]({{ site.baseurl }}/docs/images/external-media.html) and build Google Play apps with [expansion files]({{ site.baseurl }}/docs/output/app-output.html#android).

### Continuous deployment

We provide setup guidance for setting up [free continuous deployment with CodeShip Basic](https://gist.github.com/arthurattwell/75cf124f22b9b4dbc6d8504d952f9406).

### Packaging projects

Need to share, copy, or archive a project easily? Instantly [create a zip package]({{ site.baseurl }}/docs/advanced/packaging-the-project.html) of your project with one command.

### Updating related projects

If you're maintaining related Electric Book projects, keep them in sync with [instant updates]({{ site.baseurl }}/docs/setup/updates.html#using-the-update-script).
