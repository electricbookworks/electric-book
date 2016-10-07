# The Electric Book Jekyll template

A Jekyll template for making books, ebooks and book-like websites.

## Usage and documentation

1. Copy or clone this folder
2. Edit as needed:
	- `_data/meta.yml` 
	- the stylesheet variables in `book/styles`
	- the content files in `book/text`
3. Run the `run-` script for your operating system.

[Read the guide](http://electricbookworks.github.io/electric-book-workflow/) for much more. The guide is also an example of the template in action.

## Known bug in Jekyll 3.2.1 on Windows

Jekyll 3.2.1 does not run on Windows due to [a bug](https://github.com/jekyll/jekyll/issues/5192). Until this is fixed, [a workaround](https://github.com/jekyll/jekyll/issues/5192#issuecomment-237484567):

1. At a command prompt, type `gem environment`. See where your gems are installed.
2. Go there and in the `jekyll` folder find `lib/jekyll/layout.rb`.
3. Open `layout.rb` in a text editor and replace line 38 with `@path = base + "/" + name`.
4. Save and close `layout.rb`.

## Changelog

### 0.4.2

* New web navigation option to allow nested menu items: add a web nav tree to `meta.yml`, and enable in `_config.yml`.
* Move `youtube` include to theme and out of template. (How to manage embeds should be a theme decision.)
* Add index page to book folder that redirects to `text/index`
* Add related `redirect` include for redirecting any page
* Add `head-elements` include for injecting scripts and links in `<head>`
* Use electric-book-classic-theme v0.1.3

### 0.4.1

* Rename `get-metadata` include to `metadata` for simpler tag
* Fix broken font paths and management (fonts now all called from custom CSS)
* Add experimental Windows bundle install script

### 0.4.0

* Overhaul to work with Jekyll 3.2, supporting themes as gems.
* Automatically requires the Electric Book Classic Theme gem.
* Faster epub creation (file structure now matches Sigil conventions).
* Each book can have its own custom Sass/CSS.
* Bug fixes and improvements.

### 0.3.0

* Major change (and improvement) to metadata structures
* Output formats now consistently named print-pdf, screen-pdf, epub and web
* Fixes to mac-pdf.command script
* Minor edits

### 0.2.4

* Add Gemfile and require bundler for scripts to work (NB since Jekyll 3.2.1)
* Fix `-fitting` classes style inheritance in web and epub CSS
* Minor improvements

### 0.2.3

* Fix broken pink to print stylesheets.
* Fix broken links in @font-face partials.
* Add more font includes.
* Turn on kramdown auto_id_stripping to keep IDs neat and persistent, and ahead of 2.0 where this will be default.
* Fix line-height on chapter-numbers to retain baseline grid.

### 0.2.2

* Improve navigation layout.
* Simplify tag for embedding YouTube video.
* Add ability to combine `.smallcaps`/`.allsmallcaps` with `.bold` and `.italic` for italic/bold small caps.
* Add `web.scss` variables for media-query break points.
* Fix bug causing horizontal overflow.

### 0.2.1

* Bug-fix broken links in new nav include.
* Improve template index page.
* Make default web typography paras space-between (not text indent).

### 0.2.0

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

### 0.1.4

* Move all metadata out of `_config.yml`, into `_data` (no more setting up the slug)
* Support `<hr>` as text divider (\*\*\* in markdown)
* Minor improvements to code comments
* Minor improvement to layout of reference indexes
* Fix for blank baseurl in `win-web.bat` launcher
* Minor text edits

### 0.1.3

* Improve Windows batch script for PDF
* Add a Linux shell script for PDF
* Add Windows web batch script

### 0.1.2

* Experimental Windows batch file for PDF output
* Better image-set system using site variable
* Improved figure styling
* New control over image heights in figures to retain baseline grid
* Print-hiding for Sigil split markers
* Allow Prince hyphenation when no special dictionary is defined
* Fixed styling of .title-page-publisher
* Related documentation in Guide

### 0.1.1

* Add .title-page-publisher
* Liquid tags can populate whole title page and copyright page from _data
