# The Electric Book template

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
- [PrinceXML](https://www.princexml.com/) (for PDF output; the only proprietary requirement)
- [Node.js](https://nodejs.org), [Gulp](https://gulpjs.com/) and [GraphicsMagick](http://www.graphicsmagick.org/) (to create multiformat images)
- [Pandoc](https://pandoc.org/) (for Word export)
- [Cordova](https://cordova.apache.org), [Android Studio](https://developer.android.com/studio), and (on OSX) [XCode](https://developer.apple.com/xcode/) (for building ebook apps)

And of course a good editor like [VS Code](https://code.visualstudio.com/), [Sublime](https://www.sublimetext.com/), [Brackets](https://brackets.io/) or [Atom](https://atom.io/).


## Testing

### End to end testing

```bash
$ npm run test:e2e
```
```
> electric-book@0.1.0 test:e2e
> scripts/test.sh --config=./test/e2e/jest.config.js

Building Jekyll output for tests
Done

Running Jest tests

 PASS  test/e2e/html_output.test.js
  HTML output
    ✓ Files listed in meta.yml should exist (10 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.281 s, estimated 1 s
Ran all test suites.
Done
```

### Visual regression testing

```bash
$ npm run test:visual_regression
```
```
> electric-book@0.1.0 test:visual_regression
> scripts/test.sh --config=./test/e2e/visual_regression/jest.config.js

Building Jekyll output for tests
Done

Running Jest tests

 PASS   browser: chromium  test/e2e/visual_regression/html_visual_regression.test.js (185.87 s)
  HTML output visual regression
    ✓ Should look the same (184423 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   16 passed, 16 total
Time:        186.275 s
Ran all test suites.
Done
```
