---
title: Epub output
---

# Epub output
{:.no_toc}

* toc
{:toc}

## Recommended tools

In addition to [Sigil](https://github.com/Sigil-Ebook/Sigil/releases), we recommend installing the following tools:

1. The [FlightCrew Sigil plugin](https://github.com/Sigil-Ebook/flightcrew/releases) for checking for epub errors.
2. The [AddiBooksXML Sigil plugin](https://www.mobileread.com/forums/showthread.php?t=272241) for defining iBooks font options.
3. The [EPUB3-itizer Sigil plugin](https://github.com/kevinhendricks/ePub3-itizer/tree/master/plugin) for converting from EPUB2 to EPUB3.
4. The [Pagina EPUB-Checker](https://www.pagina.gmbh/produkte/epub-checker/).

## Quick-epub process checklist

Here's a handy checklist for assembling an epub in Sigil: 

1. **Run the output script** for our OS (e.g. `run-windows.bat` or `run-mac.command`) and choose the epub option.
1.	**Open first file.** File > Open… and select the first HTML file in `_site/book/text`. (The output script tries to do this for you.)
2.	**Fix image path.** Fix the path to cover image file in cover HTML.
2.	**Add book files.** Right-click the Text folder > Add Existing Files… and select the remaining HTML files for the epub.
	1.	If this doesn't automatically add the `epub.css` file, right-click the Text or Styles folder > Add Existing Files… and select the epub's CSS file from `_site/book/styles`.
4.	**Generate TOC.** Tools > Table Of Contents > Generate Table Of Contents
5.	**Add cover to TOC.** Optionally, add the cover HTML to generated TOC with the TOC editor.
6.	If outputting EPUB3:
	1. **Change `.html` to `.xhtml`.**Rename all files `.html` to `.xhtml` (select files > Rename > enter only `.xhtml` in replace box).
	1. **Convert to EPUB3** using the [EPUB3-itizer](https://github.com/kevinhendricks/ePub3-itizer/tree/master/plugin) plugin.
	1. **Close** current EPUB2. **Open** newly saved EPUB3.
	1. **Add [iBooks XML](https://gist.github.com/arthurattwell/4932d28d874d9b268c6d186ee38d6aa1)** with [AddiBooksXML plugin](https://github.com/dougmassay/addibooksxml-sigil-plugin). Optional.
	1. **Hide generated in-book TOC** by adding a `hidden=""` attribute to the `nav` element in `nav.xhtml`: `<nav epub:type="toc" id="toc" hidden="">`. Optional.
5.	**Add file metadata semantics** (right-click HTML files > Add Semantics…)
6.	**Define cover image.** Right-click the cover JPG and select Cover Image.
6.	Save, and [validate](#validate-the-epub) with the Flightcrew plugin and separately with EPUBCheck.

Depending on your needs, you may also need to:

*	search-and-replace for SVG images, footnotes, or video, if you need EPUB2;
*	add font files if you're embedding fonts;
*	split large files ([as described below](#splitting-large-files)).

Then test:

1. Validate with [epubcheck](https://www.pagina.gmbh/produkte/epub-checker/).
2. Open in Adobe Digital Editions and do a visual check.
3. Open in Kindle Previewer (and/or run the epub through KindleGen).

The following sections go into more detail.

## Run the script

Run the output script for our OS (e.g. `run-windows.bat` or `run-mac.command`) and choose the epub option.

The script tells Jekyll to compile epub-ready HTML, opens Sigil, and opens `0-0-cover.html` there, which automatically imports your book's metadata into the epub. It also opens a file browser to the epub-ready HTML files.

In Sigil, then, add the remaining content files, define file semantics, and generate a TOC.

If you're not using the script, at a command prompt in the same folder as the scripts, run `bundle exec jekyll b --config="_config.yml,_config.epub.yml"`. Then from Sigil, open the `0-0-cover.html` file in `_site/book/text`. That will import book metadata, and you can then assemble the epub in Sigil.

> Technical background: To get the metadata to import to Sigil, you must *open* one of your book's HTML files in Sigil (the cover is best, since it's the first file). That is, don't 'Add Existing Files…' to a new, blank epub. Only by opening a single HTML file (as in 'File > Open…', then select the HTML file) will Sigil read and import the file's Dublin Core metadata. After that, you can add the remaining files in Sigil using 'Add Existing Files…'.
{:.box}

## Assembling the epub

We like to assemble our epubs (as EPUB2 for compatibility with older ereaders) in [Sigil](https://github.com/user-none/Sigil/). If we're not changing something major, it takes five minutes. (See the pro tip below for an even quicker way.)

1.	Put the HTML files from `_site` into your `Text` folder.
1.	If it's not automatically imported, put the finished `epub.css` (from your book's `styles` folder in `_site`) into your Sigil `Styles` folder. (Our `epub.css` file is not the same as `web.css`. It does not link to font files and avoids CSS3 features, like @fontface, some pseudo classes and media queries, to work better with popular readers with poor or buggy CSS support, such as Adobe Digital Editions.)
1.	**Replace any SVG images** in the `Images` folder with JPG equivalents. And:
1.	Search-and-replace any links to .svg in your HTML files with .jpg.
1.	**Copy any fonts** into the `Fonts` folder, if you want them embedded. (If you don't want to embed fonts, remove any `@font-face` rules from your stylesheet to avoid file-not-found validation errors. We don't recommend embedding fonts unless they are required for meaning or unusual character sets.)
1.	**Remove videos** in iframes (iframes are invalid in EPUB2 XHTML 1.1). We recommend replacing videos with a link to an online version, e.g. to a YouTube page. This is best done manually. Search for `videowrapper` to find instances of embedded videos. To **replace** the standard video wrapper with a link to the video:

	*	Search (with DotAll regex) for:

		~~~
		(?s).<div class="videowrapper non-printing">(.*)src="(.*?)"(.*)</div>(.*?)<!--.videowrapper-->
		~~~

		This will find the videowrapper and store the URL of the embedded video in memory.

	*	Replace with

		~~~
		<a href="\2" class="button">Watch</a>
		~~~

		This will replace the entire wrapper with a link to the same iframe URL it memorised (at `\2`). Replace `Watch` with whatever phrase you want to be the clickable text.
1.  If your book includes endnotes (kramdown footnotes), replace `fnref:` with `fnref-` and `fn:` with `fn-`. ( Background: If you have a colon in any element ID – for instance if you've used [kramdown's footnote syntax](http://kramdown.gettalong.org/quickref.html#footnotes) – EpubCheck will return an 'invalid NCName' error. You need to replace those colons with another character. If your invalid IDs follow a set pattern (as kramdown's footnote references do), you can replace-all quickly.)
1.	**Check your epub's metadata** using Sigil's Metadata Editor, and edit if necessary. Include at least:
	*	title: subtitle
	*	author
	*	date of creation
	*	publisher
	*	ISBN (or other identifier like a [UUID](https://www.uuidgenerator.net/))
	*	Relation ISBN (if any; we use the print ISBN as a parent ISBN)
1.	**Add file semantics** (right click the file name in Sigil for the semantics context menu) to:
	*	key HTML files
	*	the cover JPG.
1.	{:#adding-the-epub-toc}**Generate the epub's table of contents** (Tools > Table Of Contents…). This TOC is generated only from the headings (`h1` to `h6`) in the text. So it does not include the cover, which has no heading, or any other files without a heading (e.g. sometimes the copyright page). If you need to add a cover to the TOC:
	1. Go to Tools > Table Of Contents > Edit Table Of Contents… 
	2. Click on the first entry in the TOC list.
	3. Click 'Add Above'.
	4. Click 'Select Target' and select the cover HTML file (usually `0-0-cover.html`).
	5. In the blank space under 'TOC Entry', double-click and type 'Cover'.
	6. Click Okay.
	7. Use the same process for adding any other files you need to add to the TOC.
1.	If fonts are important (you've either embedded fonts or the difference between serif and sans-serif is semantically significant), add iBooks XML. ([See below for detail](#adding-ibooks-display-options-file).)
1.	{:#validate-the-epub}Validate the epub in Sigil and fix any validation errors. Sigil let's some things past that EpubCheck flags, so also validate with EpubCheck directly. You can use:
	*	the [IDPF's online version of EpubCheck](http://validator.idpf.org/)
	*	[epubcheck](https://github.com/IDPF/epubcheck/wiki/Running) installed locally, and run from the command line; or
	*	[pagina EPUB-Checker](http://www.pagina-online.de/produkte/epub-checker/).

> Tip: If you get validation errors about images, check that your paths to images are correct and case-sensitive. For instance, Sigil needs images to be in `Images` not `images`.
{:.box}

For general guidance on creating epubs with Sigil, check out [EBW's training material](http://electricbookworks.github.io/ebw-training/) and the [Sigil user guide](https://github.com/Sigil-Ebook/Sigil/tree/master/docs).

## Splitting large files

If you have very large text files that, in the epub output, you'd like to split up into separate HTML files, Sigil can help. Using this tag in HTML, you can mark where Sigil must split your HTML file(s):

~~~
<hr class="sigil_split_marker" />
~~~

To create that in markdown, use a three-asterisk divider with a `sigil_split_marker` class, like this:

~~~
***
{:.sigil_split_marker}
~~~

Also, remember to hide those markers in print output (and web and elsewhere as needed) with this in your CSS:

~~~
.sigil_split_marker {
	display: none;
}
~~~

Then, when you're assembling the epub in Sigil, just run Edit > Split At Markers.

Sigil will then split the HTML file into separate HTML files at the markers, and remove the `<hr>` element.

A common use case for this is books with end-of-book endnotes. To create end-of-book endnotes using kramdown footnotes you must put all content with endnotes in one markdown (and therefore HTML) file. This file is too large for sensible epub use, so splitting is important. Sigil is smart enough to update your internal links when you run 'Split At Markers'.

> **NB: Before running Split At Markers: save, close, and reopen your epub.** At least till Sigil 0.9.3, there is [an issue with updating internal links when using Split At Markers](http://www.mobileread.com/forums/showthread.php?p=3277498#post3277498). In order for internal links to update correctly, Sigil must *first* have rewritten all link paths to HTML files according to its `../Text/` folder structure (e.g. the links to chapters in a Table of Contents file). Sigil only rewrites all these paths when an epub file is opened. So to make sure links are udpated when running Split At Markers, you need to save, close, and reopen the epub first. This [may be fixed from Sigil 0.9.5](http://www.mobileread.com/forums/showpost.php?p=3277552&postcount=11).

## Mobi conversion

These days, you should not need to create a mobi file for Amazon. It's better to upload an epub and let Amazon convert it.

If you really do need a mobi file, we recommend putting your EPUB into the [Kindle Previewer](http://www.amazon.com/gp/feature.html?docId=1000765261), which automatically converts to mobi using Kindlegen and saves the mobi file to a folder beside your epub.

If Previewer cannot convert the epub, we've found that adding it to [Calibre](http://calibre-ebook.com/) first, then (without converting) give Calibre's version to Kindle Previewer. Calibre gives you greater control over specific ebook conversions, but we've found Kindle Previewer converts some CSS better (e.g. floats and borders).

> If you need to dig into a mobi file's code to troubleshoot, try the [KindleUnpack plugin for Calibre](http://www.mobileread.com/forums/showthread.php?t=171529).
{:.box}

## EPUB3 conversion

To convert an EPUB2 to EPUB3 in Sigil, use [Kevin Hendricks' EPUB-itizer plugin](https://github.com/kevinhendricks/ePub3-itizer).

Note that EPUB3 prefers all files to have `.xhtml` filename extensions, while Jekyll uses `.html`. So, before you run the EPUB3-itizer:

1. In Sigil's BookBrowser window select all `.html` files
2. Right click on your selection and select Rename
3. In the "Rename Files Starting At" dialog, remove everything and replace it with `.xhtml` and click "OK".

When adding file semantics, we have found that setting `cover.jpg` to 'Cover image' (i.e. adding `<meta content="cover.jpg" name="cover" />` to `content.opf`) causes KindleGen to crash when converting to Amazon formats. So you may want to avoid this setting for the cover image file.

## Adding iBooks display-options file

If you need to add the `com.apple.ibooks.display-options.xml` file to your epub for iBooks display options, you can use the [AddiBooksXML](http://www.mobileread.com/forums/showthread.php?t=272241) plugin in Sigil.

A very basic display-options file contains this XML:

~~~
<?xml version="1.0" encoding="UTF-8"?>
<display_options>
    <platform name="*">
        <option name="specified-fonts">true</option>
        <option name="interactive">false</option>
        <option name="fixed-layout">false</option>
        <option name="open-to-spread">false</option>
        <option name="orientation-lock">none</option>
    </platform>
</display_options>
~~~

The file should be in the epub's META-INF folder, which Sigil does not let you edit by default, hence the need for the plugin.

To install the plugin:

*	[Download the zip file](http://www.mobileread.com/forums/showthread.php?t=272241).
*	In Sigil, go to Plugins > Manage Plugins.
*	Click Add Plugin and locate and select the zip file you downloaded.

To use the plugin:

*	First, in a plain-text/code editor create an `com.apple.ibooks.display-options.xml` file containing only the XML shown above. If necessary, change the five options settings in it. Save the XML file with your source material for the book for future use/reference.
*	In Sigil, with the epub open, go to Plugins > Edit > AddiBooksXML and find and select the `com.apple.ibooks.display-options.xml` file you just created.
