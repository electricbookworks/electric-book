---
title: Epub output
categories: output
order: 3
---

# Epub output
{:.no_toc}

* Page contents
{:toc}

You can create an epub by running the output script for your OS and choosing the epub option. Before that will work, though, your project must be prepared correctly.

## Package files

The template comes with `package.opf` and `toc.ncx` files in the `book` and `samples` folders. For epub output, every book you create should have at least the `package.opf` file in its directory. The `toc.ncx` is for backwards compatibility with older epub readers, and so some vendors require it.

If you're creatnig translations, you also need these files in the translation directory (e.g. at `great-expectations/fr/package.opf`). There is an example in the template's `samples` book directory.

## Metadata and settings

Your epub will build correctly only if you have provided sufficient, accurate information about it in `_data/meta.yml`. You may also need to adjust some epub settings in `_data/settings.yml`.

1. File list: you must list all the files to be included in your epub in the epub `files` section of `meta.yml`.
2. Optionally, add guide names to key files in that list, e.g. `"0-0-cover": "cover"`.
3. There must be a `nav` section in `meta.yml` that points to at least one of your epub's files. For epubs, every item in the `nav` must include a file (unlike web output, where label-only items are allowed). 
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
7. If you're using a `toc.ncx` file for backwards compatibility with old ereaders, you have to be especially careful with how you construct your epub `toc` tree in `meta.yml`.

	In an NCX, you cannot have two items in nav pointing to the same target. So in your epub `toc` in `meta.yml`, you can't have two items with the same `file` and `id`. To differentiate them, you add an `id` pointing to, say, a heading in the document to differentiate one target in the same file from another.

	Also, in an NCX, every item must include a link. So if an item in your toc has no link, and only children items, then in the `toc.ncx` the Electric Book will create a link for it. It will use the `file` (without the `id`) of its first child. So, to ensure that you don't get duplicate links, you must add an `id` to that first child. This way, the parent will point to the `file`, and the first child item will point to the `file` + `id`.

## Fonts

To embed fonts in an epub:

1. add the font files to `_epub/fonts`;
2. list the font files in `_data/settings.yml` at `epub-fonts`.

## Javascript

Add any scripts to `_epub/js`. See the [Javascript](../advanced/javascript.html) section for more detail.

## Validation

If you want the output script to run EpubCheck (recommended), [download it from the IDPF](https://github.com/IDPF/epubcheck/releases).

On Windows, extract the zip file and save the contents somewhere easy to find, like `C:\EpubCheck\`. Then [add that folder to your PATH](http://windowsitpro.com/systems-management/how-can-i-add-new-folder-my-system-path).

On Mac or Linux, extract the zip file and save the contents somewhere sensible like `/usr/local/bin`. The output script will ask for the path to the EpubCheck `.jar` file.

## Troubleshooting

Epubs are notoriously hard to make, largely because validation is so strict. Here are some tips that may be useful when troubleshooting.

1. If you get errors from EpubCheck, the error will usually report the file name, line and column number of the content with the error. For instance, `(1,4587)` means that the error is on line 1, column (or character) 4587.

	Open the relevant file with the error in an editor that shows you the line and column/character position of your cursor. Then move your cursor to the relevant line and column number. When the error applies to a specific element, the column position is usually at the end of the offending element.

2. If you've used named HTML entities like `&nbsp;` in HTML snippets, kramdown may not have processed those as markdown, and therefore will not have converted them to unicode characters. Named entities are not valid in epub 3, and you'll need to replace them with their numeric equivalents, such as `&#160;` instead of `&nbsp;`.
3. If you get errors about your navigation or TOC (`nav`), see the guidelines on [Metadata and settings](#metadata-and-settings) above. The `toc.ncx` file is particularly sensitive.
4. Make sure your book has a `package.opf` file in its book directory. You can copy this from the Electric Book template. (It uses the `epub-package` include to generate the epub's metadata and manifest.)

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
>    2. We zip the contents of `epub` to `_output/book.zip` (where `book` may be a renamed book folder), and change the file extension to `.epub`
> 
> The output script does a lot of work. It asks the user some questions, it has to check for the existence of files (e.g. `styles` in a translation, which are optional), and it removes the `mathjax` folder from `epub` if mathjax is not included.
{:.box}

## Legacy methods

Before we generated finished epubs from the Electric Book template's output script, we generated only 'epub-ready' HTML, and assembled finished epubs in Sigil. The following guidance is only for that approach.

### Recommended tools

In addition to [Sigil](https://github.com/Sigil-Ebook/Sigil/releases), we recommend installing the following tools:

1. The [FlightCrew Sigil plugin](https://github.com/Sigil-Ebook/flightcrew/releases) for checking for epub errors.
2. The [AddiBooksXML Sigil plugin](https://www.mobileread.com/forums/showthread.php?t=272241) for defining iBooks font options.
3. The [EPUB3-itizer Sigil plugin](https://github.com/kevinhendricks/ePub3-itizer/tree/master/plugin) for converting from EPUB2 to EPUB3.
4. The [Pagina EPUB-Checker](https://www.pagina.gmbh/produkte/epub-checker/).

### Quick-epub process checklist

Here's a handy checklist for assembling an epub in Sigil. Below, each step is explained in more detail.

1. **Run the output script** for your OS (e.g. `run-windows.bat` or `run-mac.command`) and choose the epub option.
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

### Run the script

Run the output script for our OS (e.g. `run-windows.bat` or `run-mac.command`) and choose the epub option.

Then from Sigil, open the `0-0-cover.html` file in `_site/book/text`. That will import book metadata, and you can then assemble the epub in Sigil.

Note: To get the metadata to import to Sigil, you must *open* one of your book's HTML files in Sigil (the cover is best, since it's the first file). That is, don't 'Add Existing Files…' to a new, blank epub. Only by opening a single HTML file (as in 'File > Open…', then select the HTML file) will Sigil read and import the file's Dublin Core metadata. After that, you can add the remaining files in Sigil using 'Add Existing Files…'.

### Assembling the epub

1.	Put the HTML files from `_site` into your `Text` folder.
1.	If it's not automatically imported, put the finished `epub.css` (from your book's `styles` folder in `_site`) into your Sigil `Styles` folder. (Our `epub.css` file is not the same as `web.css`. It does not link to font files and avoids CSS3 features, like @fontface, some pseudo classes and media queries, to work better with popular readers with poor or buggy CSS support, such as Adobe Digital Editions.)
1.	**Replace any SVG images** in the `Images` folder with JPG equivalents, if you're assembling EPUB2. And, if so search-and-replace any links to .svg in your HTML files with .jpg.
1.	**Copy any fonts** into the `Fonts` folder, if you want them embedded. (If you don't want to embed fonts, remove any `@font-face` rules from your stylesheet to avoid file-not-found validation errors. We don't recommend embedding fonts unless they are required for meaning or unusual character sets.)
1.	**Remove videos** in iframes (iframes are invalid in EPUB2 XHTML 1.1). We recommend replacing videos with a link to an online version, e.g. to a YouTube page. This is best done manually. Search for `videowrapper` to find instances of embedded videos. For example, to **replace** the standard video wrapper with a link to the video, you might:

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

### Splitting large files

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

> **NB: Before running Split At Markers: save, close, and reopen your epub.** At least till Sigil 0.9.3, there is [an issue with updating internal links when using Split At Markers](http://www.mobileread.com/forums/showthread.php?p=3277498#post3277498). In order for internal links to update correctly, Sigil must *first* have rewritten all link paths to HTML files according to its `../Text/` folder structure (e.g. the links to chapters in a Table of Contents file). Sigil only rewrites all these paths when an epub file is opened. So to make sure links are updated when running Split At Markers, you need to save, close, and reopen the epub first. This [may be fixed from Sigil 0.9.5](http://www.mobileread.com/forums/showpost.php?p=3277552&postcount=11).

### Mobi conversion

These days, you should not need to create a mobi file for Amazon. It's better to upload an epub and let Amazon convert it. This is largely because Amazon will convert to several formats for different user devices, and it's best that Amazon has your original epub to convert from.

If you really do need a mobi file, we recommend putting your EPUB into the [Kindle Previewer](http://www.amazon.com/gp/feature.html?docId=1000765261), which automatically converts to mobi using Kindlegen and saves the mobi file to a folder beside your epub.

If Previewer cannot convert the epub, we've found that adding it to [Calibre](http://calibre-ebook.com/) first, then (without converting) give Calibre's version to Kindle Previewer. Calibre gives you greater control over specific ebook conversions, but we've found Kindle Previewer converts some CSS better (e.g. floats and borders).

> If you need to dig into a mobi file's code to troubleshoot, try the [KindleUnpack plugin for Calibre](http://www.mobileread.com/forums/showthread.php?t=171529).
{:.box}

### EPUB3 conversion

To convert an EPUB2 to EPUB3 in Sigil, use [Kevin Hendricks' EPUB3-itizer plugin](https://github.com/kevinhendricks/ePub3-itizer).

Note that EPUB3 prefers all files to have `.xhtml` filename extensions, while Jekyll uses `.html`. So, before you run the EPUB3-itizer:

1. In Sigil's BookBrowser window select all `.html` files
2. Right click on your selection and select Rename
3. In the "Rename Files Starting At" dialog, remove everything and replace it with `.xhtml` and click "OK".

When adding file semantics, we have found that setting `cover.jpg` to 'Cover image' (i.e. adding `<meta content="cover.jpg" name="cover" />` to `content.opf`) can cause KindleGen to crash when converting to Amazon formats. So you may want to avoid this setting for the cover image file.

### Adding iBooks display-options file

Some ereaders (such as iBooks) need to be told explicitly to respect your serif/sans-serif font choices and other settings. This is done with as `com.apple.ibooks.display-options.xml` file.

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
