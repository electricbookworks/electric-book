# Changelog

## 23 December 2022

This is a major restructuring of the Electric Book template. It introduces many new features. Notably:

1. We've removed the `/text` folder, moving markdown files up into the book folder, alongside the `images`, `styles` and `fonts` folders. This results in shorter URLs (no `/text/` path) that are better for readability and SEO. It also provides a more intuitive mental model for editing, because markdown files are the foundation of the book, onto which we add images, styles and fonts.
2. For PDF output, by default all HTML files are merged into one HTML file. This means you can create shorter web pages (e.g. subsections of chapters), but still avoid page breaks between them in PDF output.
3. Book metadata (in `_data`) is now split into book-specific files. We've replaced the `meta.yml` file with separate metadata files, where each book gets its own file. This makes it much easier to maintain projects with several books.
4. We've replaced the interactive output scripts with cross-platform Node commands. Processes (like output or image processing) are run with a single command. This makes it possible to automate commands (e.g. from a web- or Electron-based GUIs in future, or for automated testing). See the new README for details.
5. We've added a command that checks for basic project structure, and a command that adds a new book folder based on an existing book.
6. Prototyping a new book is much faster, because it's not necessary to create `nav` and `toc` nodes in book metadata for web navigation to work. Until you do specify those nodes in book metadata, navigation and TOCs will be automatically built from available files. See the `book` folder in the template for an example.

We've also made general improvements to HTML structures, epub structure, and the organisation of Sass files for custom theming. The default styling is a little more elegant, while remaining as unopinionated (aka vanilla) as possible, ready for customisation.

We've removed version numbering from the `_config.yml` file, and won't use semver numbering on releases going forward. Semantic versioning is not that useful for a template (as opposed to an upgradeable software app), and the current master branch here is always the latest version of the template. If we create tagged releases in future, it will be to document major new features, and provide a way to notify those watching this repo.

## 0.19.0

* [New CSS structure for themeable design](https://github.com/electricbookworks/electric-book/pull/541)
* [Easier Javascript in epubs](https://github.com/electricbookworks/electric-book/pull/540)
* [Improve appearance of nested nav items](https://github.com/electricbookworks/electric-book/pull/533)
* [Add interactive slide sequences](https://github.com/electricbookworks/electric-book/pull/523)
* [Suggest Jekyll v4 when managing own Jekyll version](https://github.com/electricbookworks/electric-book/pull/524)
* [Remove Formspree, and allow site-wide pages in the project root](https://github.com/electricbookworks/electric-book/pull/517)
* [Match the GitHub Pages Jekyll version by default](https://github.com/electricbookworks/electric-book/pull/509)
* [Improve the structure of styles for easier development](https://github.com/electricbookworks/electric-book/pull/514)
* [Enable video options, and a generic video include](https://github.com/electricbookworks/electric-book/pull/497)
* [Improve logic for setting the HTML title element](https://github.com/electricbookworks/electric-book/pull/507)
* Various minor fixes and refinements.


## 0.18.0

* [Enable bookmarking](https://github.com/electricbookworks/electric-book/pull/444)
* [Improve the reliability of search indexes and show 'Searching' notice in UX](https://github.com/electricbookworks/electric-book/pull/490)
* [Don't expand books in home nav by default](https://github.com/electricbookworks/electric-book/pull/489)
* [Exit the output script if Jekyll builds fail](https://github.com/electricbookworks/electric-book/pull/488)
* [Create fallbacks for OG page title](https://github.com/electricbookworks/electric-book/pull/484)
* [Let EBM users edit non-book styles, eg landing page](https://github.com/electricbookworks/electric-book/pull/476)
* [Improve landing-page presentation and default fonts](https://github.com/electricbookworks/electric-book/pull/473)
* [Various minor fixes and refinements](https://github.com/electricbookworks/electric-book/compare/d5a51fc83a7da5e8c35c3cb22043987777ddae4d...1e2bc3a2f03a8087dcc6bc9f107456a026d7a4a6).

## 0.17.0

* [Add ability to create a zip package of a project](https://github.com/electricbookworks/electric-book/pull/469)
* [Improve horizontal scrolling of tables on narrow screens](https://github.com/electricbookworks/electric-book/pull/468)
* [Add expand- and close-all buttons to content accordion](https://github.com/electricbookworks/electric-book/pull/467)
* [Various minor fixes and refinements](https://github.com/electricbookworks/electric-book/compare/014a476c0d0908c195ef5a3322c272344b25639f...d5a51fc83a7da5e8c35c3cb22043987777ddae4d).

## 0.16.0

* [Replace Phantom search-index dependency with Puppeteer](https://github.com/electricbookworks/electric-book/pull/464)
* [Support starting YouTube and Vimeo videos at specific times](https://github.com/electricbookworks/electric-book/pull/448)
* [Add script for faster updating across Electric Book projects](https://github.com/electricbookworks/electric-book/pull/442)
* [Zip epubs with Node for better Windows compatibility](https://github.com/electricbookworks/electric-book/pull/441)
* [Enable turning image lazyloading on/off in settings.yml](https://github.com/electricbookworks/electric-book/pull/433)
* [Implement better paragraph-indent](https://github.com/electricbookworks/electric-book/pull/432)
* [Support visible URLs in e-ink epubs](https://github.com/electricbookworks/electric-book/pull/431)
* [Generate separate web and app search indexes](https://github.com/electricbookworks/electric-book/pull/424)
* [Allow fully translated landing pages](https://github.com/electricbookworks/electric-book/pull/423)
* [Lazyload images to save user data](https://github.com/electricbookworks/electric-book/pull/419)
* [Create TOCs outside of book files (and other nav fixes)](https://github.com/electricbookworks/electric-book/pull/413)
* [Convert .html to .xhtml on epub output](https://github.com/electricbookworks/electric-book/pull/398)
* [Don't force a blank baseurl on web output](https://github.com/electricbookworks/electric-book/pull/397)
* [Localise home-page title element in locales](https://github.com/electricbookworks/electric-book/pull/396)
* [Add ability to hide content behind show-hide buttons](https://github.com/electricbookworks/electric-book/pull/394)
* [Add ability to use gap-fill questions](https://github.com/electricbookworks/electric-book/pull/389)
* [Add variables for content and style in side-margin boxes](https://github.com/electricbookworks/electric-book/pull/379)
* [Enable setting relative size of maths in PDF as a variable](https://github.com/electricbookworks/electric-book/pull/378)
* [Various minor fixes and refinements](https://github.com/electricbookworks/electric-book/compare/34f8038025a1df45b72f6e7fcdb1e066fdb6ee73...master).

## 0.15.0

* [Add PDF columns options](https://github.com/electricbookworks/electric-book/pull/372)
* [Inject SVGs inline](https://github.com/electricbookworks/electric-book/pull/371)
* [Add max-quality image output](https://github.com/electricbookworks/electric-book/pull/370)
* [Add an option for creating a sidebar in PDF output](https://github.com/electricbookworks/electric-book/pull/368)
* [Add classes for all PrinceXML-supported floats on figures in PDF](https://github.com/electricbookworks/electric-book/pull/367)
* [Add shift-up- and shift-down- classes for page refinement](https://github.com/electricbookworks/electric-book/pull/366)
* [Create a dedicated styles folder for non-book pages](https://github.com/electricbookworks/electric-book/pull/365)
* [Add easy way to set favicon](https://github.com/electricbookworks/electric-book/pull/362).
* [Improve use of images as text dividers](https://github.com/electricbookworks/electric-book/pull/361).
* [Footnote references popup footnote text on web](https://github.com/electricbookworks/electric-book/pull/358).
* [Tables scroll horizontally on small screens](https://github.com/electricbookworks/electric-book/pull/357).
* [Enable redaction in PDF](https://github.com/electricbookworks/electric-book/pull/342).
* [Fix math in Word export](https://github.com/electricbookworks/electric-book/pull/339).
* [Allow converting endnotes to footnotes in PDF](https://github.com/electricbookworks/electric-book/pull/337).
* [Improvements to video output](https://github.com/electricbookworks/electric-book/pull/329), and [allow turning on YouTube subtitles](https://github.com/electricbookworks/electric-book/pull/335).
* [Fix a bug where some multiline maths did not show in epub output](https://github.com/electricbookworks/electric-book/pull/352).
* [Various minor fixes and refinements](https://github.com/electricbookworks/electric-book/compare/149705bd114fb48fa3b84377eb192e23cd6a2c0f...master).

## 0.14.0

* [Major improvement to preprocessing and output of maths](https://github.com/electricbookworks/electric-book/pull/328)
* [Enable turning off or expanding accordion per-page](https://github.com/electricbookworks/electric-book/pull/318)
* [Fix to prevent false positives in active menu items](https://github.com/electricbookworks/electric-book/pull/316)
* [Add canonical link tag to head for better SEO and annotation](https://github.com/electricbookworks/electric-book/pull/314)
* [Hide breadcrumbs on small screens](https://github.com/electricbookworks/electric-book/pull/313)
* [Various minor fixes and refinements](https://github.com/electricbookworks/electric-book/compare/65a56fb75dd3e40223c9f327d144c176d12682e5...master).

## 0.13.0

* [Add ability to create reusable content items](https://github.com/electricbookworks/electric-book/pull/307).
* [Add annotation with Hypothes.is](https://github.com/electricbookworks/electric-book/pull/304).
* [Translation styles now augment, rather than replace, parent-language styles](https://github.com/electricbookworks/electric-book/pull/298).
* [New setting to avoid inaccurate image-colour-profile conversion on PDF output](https://github.com/electricbookworks/electric-book/pull/305).
* [New docs on building apps, and better Windows app](https://github.com/electricbookworks/electric-book/pull/293) [output](https://github.com/electricbookworks/electric-book/pull/294).
* [Prevent spans with `.keep-together` from breaking over lines](https://github.com/electricbookworks/electric-book/pull/292).
* [Fall back to book and project descriptions for Open Graph descriptions when page description not available](https://github.com/electricbookworks/electric-book/pull/285).
* [Upgrade gulp dependency to 4.0.0](https://github.com/electricbookworks/electric-book/pull/296).
* [Improvements to docs](https://github.com/electricbookworks/electric-book/pull/288) and [setup](https://github.com/electricbookworks/electric-book/pull/284) [guidance](https://github.com/electricbookworks/electric-book/pull/287).
* [Fix the ability to use a file list as a source for the nav list](https://github.com/electricbookworks/electric-book/pull/279).
* [Various minor fixes and refinements](https://github.com/electricbookworks/electric-book/compare/84e065f4f64571a95120ac89e38dc5ff01717fc8...master).

## 0.12.0

* [Add content accordion for web and app outputs](https://github.com/electricbookworks/electric-book/pull/250).
* [Add ability to include multiple-choice questions](https://github.com/electricbookworks/electric-book/pull/251).
* [Better docs on output formats and setting up GitHub Pages](https://github.com/electricbookworks/electric-book/commit/70ac2b10f6a929fccca137630253f3880c154633).
* [Add ability to override epub-specific language](https://github.com/electricbookworks/electric-book/pull/248).
* [Add toc.ncx for backwards-compatible epubs](https://github.com/electricbookworks/electric-book/pull/255). [And fixes to it](https://github.com/electricbookworks/electric-book/pull/263).
* [Add `image` include for responsive image tags](https://github.com/electricbookworks/electric-book/pull/256).
* [Add support for show-page-number and show-url classes](https://github.com/electricbookworks/electric-book/pull/259).
* [Support a 'start-on-right' class to start new recto pages](https://github.com/electricbookworks/electric-book/pull/261).
* [Distinguish between project logo and project image](https://github.com/electricbookworks/electric-book/pull/264).
* [Localise search](https://github.com/electricbookworks/electric-book/pull/266) [pages](https://github.com/electricbookworks/electric-book/pull/274).
* [Add ability to show a baseline grid](https://github.com/electricbookworks/electric-book/pull/272).
* [Add optional back button for app output](https://github.com/electricbookworks/electric-book/pull/275).
* [Various minor fixes and refinements](https://github.com/electricbookworks/electric-book/compare/ea42c5050375cbd9e30ec2c8f7c47b7e5ecf45b7...master).

## 0.11.1

* [Add pagination](https://github.com/electricbookworks/electric-book/pull/225) (next/previous lnks) to web and app outputs.
* [Allow RTL text direction to be set per language in `locales`](https://github.com/electricbookworks/electric-book/pull/224).
* [Fix issue](https://github.com/electricbookworks/electric-book/pull/222) that caused invalid epubs in EpubCheck 3.
* Use [clearer language-select icon](https://github.com/electricbookworks/electric-book/pull/223).
* [Fix issue](388ca1e81cf47f69817dee530dc5846aeb59cc32) where app output used web nav for breadcrumbs.
* [Remove clumsy doctype entities](7d5bb49ac9a537a201947bd99b0068e43ea439f1) in epub output.
* Updates to docs.
* [Fix issue](bd5d23422583c939985c8835f485b80f2a1cab0f) with timestamps on some Windows machines.
* [Improve docs](https://github.com/electricbookworks/electric-book/pull/229), especially guidance on `meta.yml`.
* [Improvements to iOS app output](https://github.com/electricbookworks/electric-book/pull/230).
* [Replace buggy version of Crimson Roman](https://github.com/electricbookworks/electric-book/commit/84ac35be8d7681fefdeeafe86eecff08c8083933).
* [Allow images to be stored externally](https://github.com/electricbookworks/electric-book/pull/240).
* [Fix epub output of translations](https://github.com/electricbookworks/electric-book/pull/242).
* [Add greyscale colour profiles](https://github.com/electricbookworks/electric-book/pull/244).
* [Add ability to output Lightning Source PDFs](https://github.com/electricbookworks/electric-book/pull/245).
* Various minor fixes and improvements.

## 0.11.0

* [Localisation](https://github.com/electricbookworks/electric-book/pull/209): text snippets can now be set in `locales.yml`
* [Better search indexing](https://github.com/electricbookworks/electric-book/pull/215)
* Fix print font defaults
* Match EBM colours
* Markdownify breadcrumbs
* Update Source Sans Pro
* Add Sass variables to make headers and footers easier to style
* Improved docs
* Fix epub output in OSX, Linux, and [various epub bugs and improvements](https://github.com/electricbookworks/electric-book/pull/199)
* Add app output to OSX, Linux
* Fix Word output on OSX, Linux
* Add image-processing with `gulp` to unix scripts
* Add minification and cleanup of SVGs on image processing
* Add variable for default rule thickness
* Add `.image-with-caption` class
* Add language-selector menu for when translations exist
* Improve `gulpfile` SVG optimisation for epubs
* Set hyphenation to manual by default
* Allow translation directories and language codes to differ
* Don't store Cordova `plugins` and `platforms` folders in source control
* Bug fixes and code-readability improvements

## 0.10.0

* Keep build tools in `_tools`
* Change term `series` to broader `project`
* Embed fonts and prevent risk of reflow from PDF font fallbacks
* Fix page-header functionality for running heads
* Hide technical files from non-tech editors prose.io and EBM

## 0.9.0

* Various updates to documentation
* Add epub generation (replaces old epub-ready files for Sigil approach)
* Epubs now MathJax and JS capable
* Add app generation (Android in Windows, app-ready HTML for iOS)
* Add gulpfile to autoprocess images from `_source` into output formats
* Important change to translations structure (documented)
* New `page-info` include for checking metadata for a book and given page
* All categorisation of docs
* Fix video embeds, and only load iframe JS on click
* Fixes to typos and tiny bugs

## 0.8.0

* Allow variant outputs (e.g. variations on `print-pdf` for derivative works)
* New `identifiers` include lists, e.g. ISBNs, from `meta.yml`
* New `_data/settings.yml` for Electric Book settings like variants, and
* for future Electric Book Manager integration
* Integrate documentation and typography samples (replaces separate docs repo)
* Output formats now force appropriate image-set
* Support Vimeo embeds
* Allow series footer text in addition to book-specific web footers
* Add `dialogue` styles
* Shorter, easy `{{ images }}` tag for path to set-sensitive images
* Update MathJax CDN
* Better open graph metadata
* Smarter video includes
* Completely remove buggy Crimson Text font
* Custom hyphenation dictionaries work and work better
* Make hr text dividers work better with ADE and Amazon
* Use latest Jekyll 3.5.2
* Various minor fixes and improvements

## 0.7.0

* Add support for translations as subdirectories of `text`
* Add MathJax output in PDF
* Assume/force use of format-specific image-sets
* Far more powerful `figure` include (and related styling)
* PDF export now conforms to major standards: X1-a for print-pdf, A-3b for screen-pdf.
* Add ability to change the PDF profile and colour intent in Sass config.
* Change Jekyll destination back to `_site_` (no longer non-standard `_html`)
* More variables available from `include metadata`
* Breadcrumb trail clickable, when destination files are defined in `meta.yml`'s web nav tree
* Simpler, better way to [create book-cover files](https://github.com/electricbookworks/electric-book/pull/81)
* Linux and Mac scripts fixed and updated
* Javascript in Prince activated by default in scripts
* HTML compressed with [compress.html](https://jch.penibelst.de/)
* Minor fixes and improvements (including base typography, nav buttons, TOC layout, default font, Prose config, gitignore, output scripts)

## 0.6.3

* Fix image-set bug in Windows batch file script

## 0.6.2

* Windows batch file script enables image-set switching
* Fixes and minor improvements to styling defaults

## 0.6.1

* Major improvements to web navigation
* Text search (client-side, using elasticlunr)
* Breadcrumbs in masthead
* Many fixes and minor improvements

## 0.5.2

* Hide web-only elements (e.g. masthead) from print output for printing from browser.
* Fix start depth for frontmatter.
* Add mispelling fallback for `.half-title-page`/`.halftitle-page`.
* Define nav-bar-prompt text color.
* Add contact-form include using formspree.io
* Various bug fixes and minor improvements.
* Some smarter defaults.

## 0.5.1

Bug fixes and minor improvements.

## 0.5.0

Major revision, the key change is that we no longer use a gem-based theme, but rather package everything in the template. Far more powerful Sass configs and better web navigation.

## 0.4.5

* Set `book` folder as default in `run-windows`

## 0.4.4

* `run-windows` script now installs Bundler if it's not installed
* `run-windows` script fixes: correct baseurl, correct epub firstfile
* Test with Jekyll 3.3.0 and allow in dependencies
* Update prose config
* Allow gh-pages repo in config
* Minor fixes

## 0.4.3

* Add output scripts for all formats for OSX and Linux
* Combine output scripts into one for each OS
* Minor bug fixes

## 0.4.2

* New web navigation option to allow nested menu items: add a web nav tree to `meta.yml`, and enable in `_config.yml`.
* Move `youtube` include to theme and out of template. (How to manage embeds should be a theme decision.)
* Add index page to book folder that redirects to `text/index`
* Add related `redirect` include for redirecting any page
* Add `head-elements` include for injecting scripts and links in `<head>`
* Use electric-book-classic-theme v0.1.3

## 0.4.1

* Rename `get-metadata` include to `metadata` for simpler tag
* Fix broken font paths and management (fonts now all called from custom CSS)
* Add experimental Windows bundle install script

## 0.4.0

* Overhaul to work with Jekyll 3.2, supporting themes as gems.
* Automatically requires the Electric Book Classic Theme gem.
* Faster epub creation (file structure now matches Sigil conventions).
* Each book can have its own custom Sass/CSS.
* Bug fixes and improvements.

## 0.3.0

* Major change (and improvement) to metadata structures
* Output formats now consistently named print-pdf, screen-pdf, epub and web
* Fixes to mac-pdf.command script
* Minor edits

## 0.2.4

* Add Gemfile and require bundler for scripts to work (NB since Jekyll 3.2.1)
* Fix `-fitting` classes style inheritance in web and epub CSS
* Minor improvements

## 0.2.3

* Fix broken pink to print stylesheets.
* Fix broken links in @font-face partials.
* Add more font includes.
* Turn on kramdown auto_id_stripping to keep IDs neat and persistent, and ahead of 2.0 where this will be default.
* Fix line-height on chapter-numbers to retain baseline grid.

## 0.2.2

* Improve navigation layout.
* Simplify tag for embedding YouTube video.
* Add ability to combine `.smallcaps`/`.allsmallcaps` with `.bold` and `.italic` for italic/bold small caps.
* Add `web.scss` variables for media-query break points.
* Fix bug causing horizontal overflow.

## 0.2.1

* Bug-fix broken links in new nav include.
* Improve template index page.
* Make default web typography paras space-between (not text indent).

## 0.2.0

* Move series template out into its own repo for easier forking/copying.
* Move themes into `_themes` folder (better theme management, and in line with likely forthcoming Jekyll theme structure).
* Improve `nav` and `footer` elements to give themes more to work with, and allow for fuller web output chapter menus.
* Change `print-list` to `file-list` and auto-generate from file lists per product in `meta.yml`.
* Create `win-epub.bat` to speed up EPUB creation.
* Improve Windows batch files for output to print PDF and PDF ebook
* Add CSS options for pure black in addition to rich black, and a $start-depth variable to keep chapter openers consistent more easily.
* Add template folders and minimal guidance for using Javascript.
* Update and improve Guide text in many places, mainly where it was out of date.
* Various minor improvements.

## 0.1.4

* Move all metadata out of `_config.yml`, into `_data` (no more setting up the slug)
* Support `<hr>` as text divider (\*\*\* in markdown)
* Minor improvements to code comments
* Minor improvement to layout of reference indexes
* Fix for blank baseurl in `win-web.bat` launcher
* Minor text edits

## 0.1.3

* Improve Windows batch script for PDF
* Add a Linux shell script for PDF
* Add Windows web batch script

## 0.1.2

* Experimental Windows batch file for PDF output
* Better image-set system using site variable
* Improved figure styling
* New control over image heights in figures to retain baseline grid
* Print-hiding for Sigil split markers
* Allow Prince hyphenation when no special dictionary is defined
* Fixed styling of .title-page-publisher
* Related documentation in Guide

## 0.1.1

* Add .title-page-publisher
* Liquid tags can populate whole title page and copyright page from _data
