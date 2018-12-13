# The Electric Book Jekyll template

A Jekyll template for creating books in multiple formats:

- print PDFs for high-end book publishing
- screen PDFs for reading on screen
- a website of books
- epubs for ebook distribution
- ebook apps for Android and iOS
- MS Word outputs for old-school editing.

## Usage and documentation

1. Copy or clone this folder
2. Edit as needed:
	- `_data/meta.yml` 
	- the stylesheet variables in `book/styles`
	- the content files in `book/text`
3. Run the `run-` script for your operating system.

[Read the guide](https://electricbookworks.github.io/electric-book) for much more. The guide is also an example of the template in action.

## Dependencies

To use the Electric Book template on your machine, you need to have installed:

- [Jekyll](https://jekyllrb.com/) (and which requires Ruby and Bundler)
- [PrinceXML](http://www.princexml.com/) (for PDF output; the only proprietary requirement)
- [PhantomJS](http://phantomjs.org/) (to generate search indexes for web and app outputs)
- [Node.js](https://nodejs.org), [Gulp](https://gulpjs.com/) and [GraphicsMagick](http://www.graphicsmagick.org/) (to create multiformat images)
- [Pandoc](http://pandoc.org/) (for Word export)
- [Cordova](https://cordova.apache.org), [Android Studio](https://developer.android.com/studio), and (on OSX) [XCode](https://developer.apple.com/xcode/) (for building ebook apps)

And of course a good editor like [Sublime](https://www.sublimetext.com/), [Brackets](http://brackets.io/) or [Atom](https://atom.io/).
