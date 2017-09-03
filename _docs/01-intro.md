---
title: Introduction
---

# Introduction
{:.no_toc title="Introduction" .page-1}

At [Electric Book Works](http://electricbookworks.com), we'd been producing books with InDesign for years. InDesign is awesome, but it makes publishing simultaneously to print and digital formats a real pain. No matter how we set things up, we always ended up with separate master files: one for print, one for the ebook, and one for the website. And keeping those in sync over time was almost impossible.

We needed a way to instantly create PDF (for high-end, professional book publishing), epub and website editions of a book from a single master source. We needed great version control and cloud backup. We wanted to be able to edit from anywhere, in a way that is easy for non-technical people to learn. 

And we didn't want to be locked into any proprietary tools, whose price or availability could change at any time. We needed to use entirely open technologies to ensure our content was future-proof. And we didn't want to develop any code that others had already developed.

We spent several years piecing together a solution, bit by bit. Eventually, we settled on a workflow that is (relatively) simple and powerful:

1.	We store a book's master files in plain text, formatted as [markdown](http://daringfireball.net/projects/markdown/syntax#philosophy).
2.	We turn that plain text into clean HTML instantly (using [Jekyll](http://jekyllrb.com/)).
3.	We apply different stylesheets to that HTML to get beautiful web versions, ebooks and print PDFs in minutes (using [Sigil](http://sigil-ebook.com/) and [PrinceXML](http://www.princexml.com/)).
4.	Everything is stored securely with state-of-the-art version-control (using [GitHub](https://github.com) and similar services).

Markdown is so simple that non-technical people can learn how to create and edit it in under an hour. They can even work directly on the master files online using [Prose](http://prose.io/).

Jekyll is great at generating clean HTML in flexible ways, and has a big, active development community and committed project owners. Is also includes kramdown and Sass, which are critical to creating new book designs quickly.

While PrinceXML is proprietary software, it's our favourite implementation of the open standards for CSS Paged Media.

## Alternative tools

There are several digital-first book-publishing systems around. Some are also based on markdown, like ours. For example:

*	[Gitbook IO](http://www.gitbook.io/)
*	[Penflip](http://www.penflip.com/)
*   [LeanPub](https://leanpub.com/) (which uses [Markua](http://markua.com/))
*   [PubPub](https://www.pubpub.org/)
*   [MagicBook](https://github.com/magicbookproject/magicbook)
*	[Phil Schatz's viewer](http://philschatz.com/2014/07/07/tiny-book-reader).

[PressBooks](http://pressbooks.com/), which is built on Wordpress, is a superb, affordable service.

And if you're a serious publishing outfit, have a look at [O'Reilly Atlas](https://atlas.oreilly.com/).

The Coko Foundation is building [Editoria](https://editoria.pub/) with their new [PubSweet](http://coko.foundation/resources.html) framework. 

For converting HTML/CSS to print PDF, we use PrinceXML, which is proprietary. Other alternatives, which we haven't tested or don't yet support all the page-layout features we need, include:

*	[Antenna House](https://www.antennahouse.com/), a proprietary, mature system
*	[WeasyPrint](http://weasyprint.org/), an open-source PDF engine in active development
*	[Vivliostyle](http://vivliostyle.com/en/), which is [partly open-source](https://github.com/vivliostyle/vivliostyle)
*	[PDFReactor](http://www.pdfreactor.com/), a proprietary PDF engine
*	[DocRaptor](http://docraptor.com/), a cloud-service implementation of PrinceXML.
