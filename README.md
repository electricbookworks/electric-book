# The Electric Book template

A Jekyll template for creating books in multiple formats:

- print PDFs for high-end book publishing
- screen PDFs for reading on screen
- a website of books
- epubs for ebook distribution
- ebook apps for Android and iOS
- MS Word outputs for old-school editing.

[Read the guide](https://electricbookworks.github.io/electric-book/) for much more. That's the template in action as a website.

## Usage

The first time you work on this project on your machine, run this at the command line, in the same folder as this README file:

```sh
npm run setup
```

Now the Electric Book template is ready to use.

Start by entering this at the command line, in the same folder as this README file:

```sh
npm run electric-book
```

That lists available `electric-book` commands and options. You can also use `eb` instead of `electric-book`, here and in the following commands.

This default output command serves your project as website on your machine:

```sh
npm run electric-book -- output
```

Note that the `output` command comes after the free-standing `--`, including spaces on either side, after `electric-book`. (This is [required by npm when parsing the command](https://medium.com/fhinkel/the-curious-case-of-double-dashes-b5e7711698f).)

That is the shortest command, an implies the default `--format` option, `web`.

So the full command for a web server is actually:

```sh
npm run electric-book -- output --format web
```

You can specify a different output format. For example, this will generate a print-PDF version of the default book in the `book` folder, instead of serving a website:

```sh
npm run electric-book -- output --format print-pdf
```

If you're not outputting the default `book`, you must specify the book folder you want with the `--book` option. For example, this will generate a screen PDF of the _Samples_ book:

```sh
npm run electric-book -- output --format screen-pdf --book samples
```

And if you want to enable maths rendering in that screen PDF, add the `--mathjax` option:

```sh
npm run electric-book -- output --format screen-pdf --book samples --mathjax true
```

Note that if maths is enabled in a project's Jekyll config(s), the output script will detect that, and it isn't necessary to pass `--mathjax true` as well. (This is unlike older EBT output scripts, which did not check Jekyll configs.)

### Exporting to Word

To get a Word export of a book, use `export` instead of `output`, e.g.:

```sh
npm run electric-book -- export --book samples --format screen-pdf
```


### Project setup check

The `check` command checks that your project and its books include the folders and files required. It checks this for any books with folders in `_data/works`. To run it, enter this at the command line:

```sh
npm run electric-book -- check
```


## Dependencies

To use the Electric Book template, you need to have several applications installed on your machine.

You must have these installed:

- [Jekyll](https://jekyllrb.com/) (which also requires Ruby and Bundler)
- [Node.js](https://nodejs.org), [Gulp](https://gulpjs.com/) and [GraphicsMagick](http://www.graphicsmagick.org/) (to create multiformat images)

Optionally, you can also install:

- [PrinceXML](https://www.princexml.com/) for PDF output. Prince is the only proprietary dependency.
- [Pandoc](https://pandoc.org/) for Word export
- [rsvg-convert](https://community.chocolatey.org/packages/rsvg-convert
) for good SVGs in Word export (this is already installed on most Mac and Linux machines)
- [Cordova](https://cordova.apache.org), [Android Studio](https://developer.android.com/studio), and (on OSX) [XCode](https://developer.apple.com/xcode/) for building ebook apps.

And of course you should:

- work in a good editor like [VS Code](https://code.visualstudio.com/), [Sublime](https://www.sublimetext.com/), [Brackets](https://brackets.io/) or [Atom](https://atom.io/)
- use [Git](https://git-scm.com/) (e.g. with [GitHub Desktop](https://desktop.github.com/)) for version control and collaboration.
