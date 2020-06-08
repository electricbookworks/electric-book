---
# Replace the text on this page with content
# for your your own project's landing page.
title: The Electric Book workflow
style: home
---

{% include metadata %}

# Book-making with superpowers
{:.no_toc}

The Electric Book template produces **website, ebook, app and print books from a single content source.** It is [packed with features for professional book production](#basic-features), and lets team members collaborate on projects remotely. You're looking at the default website it generates. The template includes:

- [a blank book](book/text/0-3-contents.html) to start working into,
- [a book of sample features](samples/) to learn from,
- [a demo translation](samples/fr/), and
- {% if site.output == "web" %}[how-to documentation](docs/){% else %}[online how-to documentation](http://electricbook.works/docs/index.html){% endif %}. {% if output-docs == true %}[Read the docs]({{ site.baseurl }}/docs/){:.button}{% endif %}

You'll find [the open-source repository on GitHub](https://github.com/electricbookworks/electric-book).

## Basic features

### Web, mobile, and print

[Once your computer is set up]({{ site.baseurl }}/docs/setup/setting-up-your-computer.html), you can instantly output print PDF, screen PDF, epub, website and app versions of your books from a single content source.

### Series and collections

Create a series or collection of books in one website or app. They can share common designs, features, [metadata]({{ site.baseurl }}/docs/setup/metadata.html), and [content templates]({{ site.baseurl }}/docs/setup/repeatable-items.html).

### Share content across books

If several books in a collection share content – e.g. disclaimers, questions, author bios, images – maintain them in one place and [include them in each book with a simple tag]({{ site.baseurl }}/docs/setup/repeatable-items.html).

### Fast and mobile-friendly sites

The template generates a static website, which is secure, easy to host, and lightning fast. It's also designed to be mobile-friendly throughout.

### Windows, Mac, Linux

You can use the template on Windows, Mac and Linux computers.

### Documentation

The docs you need are embedded in your project, including guidance on [how to edit in markdown]({{ site.baseurl }}/docs/editing/markdown.html).

### Online editing

Non-technical team members can make edits, submit changes for review, and explore project history with the [Electric Book Manager](https://manage.electricbook.works). The EBM is separate software that requires setup and [hosting](https://electricbookworks.com/book-hosting).

### Export to Word

Sometimes you need your book in MS Word format. For instance, an author might be working on a new edition. You can easily, instantly [export books to MS Word]({{ site.baseurl }}/docs/output/word-output.html).

## Design and layout

### Built-in book features

Select from dozens of [built-in tags for common book features]({{ site.baseurl }}/docs/editing/classes.html), such as boxes, epigraphs, sidenotes and bibliographies.

### Easy design settings

We deliberately made the template look plain – it's ready for your design decisions. Quickly change the design with [dozens of simple settings]({{ site.baseurl }}/docs/layout/design.html), from fonts and sizes to the position of page numbers and the width of your sidebar. Then add your own CSS stylesheets. [See the Electric Book Works portfolio for examples of what's possible](https://electricbookworks.com/work/).

### Mathematics

[Include complex maths]({{ site.baseurl }}/docs/editing/maths.html) using LaTex notation. [See a simple demo here](https://deploy-preview-471--electric-book.netlify.app/samples/text/03-02-maths.html).

### Refined page typography

For high-quality print publishing, [control letter-spacing]({{ site.baseurl }}/docs/editing/classes.html#formatting) in individual paragraphs for page refinement.

### Optimised images

[Automatically convert your master images]({{ site.baseurl }}/docs/images/image-conversions.html) to optimized sizes and color profiles. For instance, CMYK for print, and RGB at different sizes for large vs mobile screens.

### Print PDF profiles

Easily [control colour and PDF profiles]({{ site.baseurl }}/docs/layout/colour-profiles.html) for professional, large-scale printing.


## Translations and variants

### Translations

[Add translations]({{ site.baseurl }}/docs/setup/translations.html) of a book to a project, and localise features like [landing pages](https://deploy-preview-471--electric-book.netlify.app/fr/) and button text.

### Variant editions

Instantly generate [variant editions]({{ site.baseurl }}/docs/setup/variants.html) of a book with different content or designs. For instance, a teacher's edition of a setwork with extra teaching notes, all from the same content source.

### Redacted PDFs

Tag text and images for redaction, then instantly [output fully redacted PDFs]({{ site.baseurl }}/docs/editing/redaction.html) without affecting page flow.


## Interactivity

### Interactive questions

Add self-marking [multiple-choice questions]({{ site.baseurl }}/docs/editing/multiple-choice-questions.html), and group them into quizzes. Add [fill-in-the-blank questions]({{ site.baseurl }}/docs/editing/questions.html#fill-in-the-blanks) to any text.

### Video

Easily [embed streaming video]({{ site.baseurl }}/docs/editing/video.html) from YouTube or Vimeo.

### Collapsible pages

Make long web pages [collapse on major headings]({{ site.baseurl }}/docs/layout/content-accordion.html) for easier reading. [See a demo here](https://deploy-preview-471--electric-book.netlify.app/samples/text/01-01-plain-text.html).

### Search

Search functionality works out of the box. Easily [build and refresh search indexes]({{ site.baseurl }}/docs/setup/search-indexes.html) for websites and apps.

### Bookmarking ([coming soon](https://github.com/electricbookworks/electric-book/pull/444))

Let users save their places, and automatically save their last location for the next time they visit.


## Extending and integrating

### WordPress compatible

Do you already have a WordPress website? No problem. Electric Book websites are fully compatible with WordPress-driven servers.

### Members-only option ([coming soon](https://github.com/electricbookworks/electric-book-wp/))

Do you need to restrict book access to certain users on your WordPress site – like paying customers or authorised members? Use the [Electric Book WP plugin](https://github.com/electricbookworks/electric-book-wp/).

### Annotation

[Turn on open annotation]({{ site.baseurl }}/docs/setup/settings.html#annotation) on website editions with [Hypothesis](https://hypothes.is). Useful for both public comment and private team discussions. [See annotation in action on this demo](https://deploy-preview-471--electric-book.netlify.app/).

### Open-source software

The template is [open-source software](https://github.com/electricbookworks/electric-book), so you never have to worry about being locked out of your own books, or finding yourself at the mercy of one vendor's pricing. You can even change your copy of the software as needed.

Note that the template does use the excellent [PrinceXML](https://www.princexml.com/) for PDF output. Prince is not open-source, and is available as a free trial. We are [working on open alternatives](https://github.com/electricbookworks/electric-book/issues/382).


## Technical advantages

### Free hosting

You can host an Electric Book site for free with services like [GitHub Pages](https://pages.github.com/) and [Netlify](https://www.netlify.com/). The template works out of the box with both.

### Best-practice version control

The template is designed to work with [Git](https://www.atlassian.com/git) version control software. We recommend storing and collaborating on your project on GitHub, GitLab or BitBucket.

### Separate image storage

For books with many large images, link to [remote media]({{ site.baseurl }}/docs/images/external-media.html) and build Google Play apps with [expansion files]({{ site.baseurl }}/docs/output/app-output.html#android).

### Continuous deployment

For high-end, technical teams, easily [set up continuous integration and continuous deployment with services like CodeShip](https://gist.github.com/arthurattwell/75cf124f22b9b4dbc6d8504d952f9406).

### Packaging projects

Need to share, copy, or archive a project easily? Instantly [create a zip package]({{ site.baseurl }}/docs/advanced/packaging-the-project.html) of your project with one command.

### Updating related projects

If you're maintaining related Electric Book projects, keep them in sync with [instant updates]({{ site.baseurl }}/docs/setup/updates.html#using-the-update-script).
