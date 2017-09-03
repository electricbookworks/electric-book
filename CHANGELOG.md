# Changelog

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
* HTML compressed with [compress.html](http://jch.penibelst.de/)
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
