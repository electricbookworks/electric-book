---
title: About the EBW
categories: about
order: 1
---

# Introduction
{:.no_toc}

* Page contents
{:toc}

At [Electric Book Works](https://electricbookworks.com), we'd been producing books with InDesign for years. InDesign is awesome, but it makes publishing simultaneously to print and digital formats a real pain. No matter how we set things up, we always ended up with separate master files: one for print, one for the ebook, and one for the website. And keeping those in sync over time was almost impossible.

We needed a way to instantly create PDF (for high-end, professional book publishing), epub and website editions of a book from a single master source. We needed great version control and cloud backup. We wanted to be able to edit from anywhere, in a way that is easy for non-technical people to learn. 

And we didn't want to be locked into proprietary tools, whose price or availability could change at any time. We needed to use open-source technologies to ensure our content was future-proof. And we didn't want to develop code that others had already developed as open-source.

We spent several years piecing together a solution, bit by bit. Eventually, we settled on a workflow that is simple and powerful:

1.	We store a book's master files in plain text, formatted as [markdown](https://daringfireball.net/projects/markdown/syntax#philosophy).
2.	We turn that plain text into clean HTML instantly (using [Jekyll](https://jekyllrb.com/)).
3.	We apply stylesheets to that HTML to generate beautiful web versions, ebooks and print PDFs instantly.
4.	Everything is stored securely with state-of-the-art version-control (using [GitHub](https://github.com)).

Markdown is so simple that non-technical people can learn how to create and edit it in under an hour. They can even work directly on the master files online (on [GitHub.com](https://github.com), [Prose](https://prose.io/) or our [Electric Book Manager](https://manage.electricbook.works).

Jekyll is great at generating clean HTML in flexible ways, and has a big, active development community. It also includes kramdown and Sass, which are critical to creating flexible book designs quickly.

PrinceXML is the only software we use that isn't open. While it's proprietary, it's an excellent implementation of the open standards for CSS Paged Media. In future, we hope to support other PDF renderers, too, such as:

* [Antenna House](https://www.antennahouse.com/), a proprietary, mature system
* [PagedJS](https://www.pagedjs.org/), an open Javascript-based approach for rendering pages with CSS Paged Media in the browser
* [WeasyPrint](https://weasyprint.org/), an open-source PDF engine in active development
* [Vivliostyle](https://vivliostyle.com/en/), which is [partly open-source](https://github.com/vivliostyle/vivliostyle)
* [PDFReactor](https://www.pdfreactor.com/), a proprietary PDF engine
* [DocRaptor](https://docraptor.com/), a cloud-service implementation of PrinceXML.

## Alternative tools

There are several digital-first book-publishing systems around. Some are also based on markdown, like ours. Not all produce print, ebook and web editions. For example:

* [Quire](https://quire.getty.edu/)
* [Gitbook IO](https://www.gitbook.io/)
* [LeanPub](https://leanpub.com/) (which uses [Markua](https://markua.com/))
* [PubPub](https://www.pubpub.org/)
* [MagicBook](https://github.com/magicbookproject/magicbook)
* [Bookdown](https://bookdown.org/)
* [Phil Schatz's viewer](https://philschatz.com/2014/07/07/tiny-book-reader).

[PressBooks](https://pressbooks.com/) is another superb, affordable service. It's built on Wordpress, and takes a different approach technically.

The Coko Foundation provides [Editoria](https://editoria.pub/) built with their new [PubSweet](https://coko.foundation/resources.html) framework. If you're a large organisation, especially in scholarly publishing, or have in-house developers, it's worth checking out.
