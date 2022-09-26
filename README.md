# The Electric Book template

A Jekyll template for creating books in multiple formats:

- print PDFs for high-end book publishing
- screen PDFs for reading on screen
- a website of books
- epubs for ebook distribution
- [Cordova](https://cordova.apache.org/)-ready files for for Android, Windows and iOS apps
- MS Word outputs for old-school editing.

[Read the guide](https://electricbookworks.github.io/electric-book/) for much more. The guide *is* the template in action as a website.


## Expertise required

While you do *not* need to be a developer, you do need some technical confidence to make books this way. You should be able to use this if:

- you know how to open the command line (aka Terminal or Command Prompt) and enter commands
- you can read this README and feel like you know what's going on.

It's also highly recommended that you have just enough familiarity with Git version control that you can sync your work with GitHub using [GitHub Desktop](https://desktop.github.com/) (or similar).

If you happen to be a front-end developer with experience using static-site generators and Node, you'll feel right at home.


## Usage

The guidance below will get you started. You will also need to consult the docs for more detail as you create books this way. Those are in the `_docs` folder here, or you can read [the current template docs online](https://electricbookworks.github.io/electric-book/docs/), keeping in mind that your project might not include the latest updates to the template.


### Quick start with Gitpod

The fastest way to get working is by using [Gitpod](https://gitpod.io). If you open this project with Gitpod, Gitpod will automatically create a virtual machine for you to work on in your browser – no need to install anything on your own computer. To do that:

1. Go to this repo's page on GitHub. (This can be the [original page](https://github.com/electricbookworks/electric-book/) or the page for the fork or branch you want to work in.)
2. In the browser address bar, insert this *before* the URL: `https://gitpod.io/#`. Then hit enter.
3. Follow the prompts to create a Gitpod workspace, using your GitHub account. If you're prompted to choose an editor, we recommend the VS Code (browser) option.
4. After a few minutes, your Gitpod workspace will appear: a code editor and a Terminal for you to enter the commands described below.


### Setup

The first time you work on this project on your machine, run this at the command line, in the same folder as this README file:

```sh
npm run setup
```

Note that if you're using Gitpod, you don't need this step: it's done for you automatically.

Now the Electric Book template is ready to use.


### List possible commands

Start by entering this at the command line, in the same folder as this README file:

```sh
npm run electric-book
```

That lists available `electric-book` commands and options. You can also use `eb` instead of `electric-book`:

```sh
npm run eb
```

That's shorter, so we'll use that in the commands below.


### Output

The default `output` command serves your project as website:

```sh
npm run eb -- output
```

Note that the `output` command comes after the free-standing ` -- `, including spaces on either side, after `electric-book` or `eb`. (This is [required by npm when parsing the command](https://medium.com/fhinkel/the-curious-case-of-double-dashes-b5e7711698f).)

That is the shortest command, and implies the default `--format` option, `web`.

So the full command for the default web output is actually:

```sh
npm run eb -- output --format web
```

Note that each option, like `--format`, also has a short alias. For `--format`, that's `-f`. (Note that one-letter aliases use a single `-`.) So the command above is the same as:

```sh
npm run eb -- output -f web
```

#### Formats

Unless you really want the web output, you must specify the output format you want. For example, this command will generate a print-PDF version of the book that's in the `book` folder, instead of serving a website:

```sh
npm run eb -- output --format print-pdf --book book
```

Note that the `book` folder is the default, so you don't have to specify it. Here's the same command using short aliases. It outputs the default `book`:

```sh
npm run eb -- output -f print-pdf
```

If you're outputting a book other than the default `book`, you must specify the book folder you want with the `--book` (aka `-b`) option. For example, this will generate a screen PDF of the book that's in the `samples` folder:

```sh
npm run eb -- output -f screen-pdf -b samples
```

Note that when you specify a book with `--book` (or `-b`), any other books in your project will not be generated or processed at all. A useful effect of this is that if you're working on the web version of a specific book and want your website to rebuild faster after each change you make, specify the book you're working on in your output command. For example, if I run this in the default template:

```sh
npm run eb -- output -b samples
```

then the website output will only include the book in the `samples` folder, and *not* the book in the `book` folder (or any other book folders).

#### Translations

The Electric Book template includes a shorter French version of the `samples` book. If you want to output, say, a screen PDF of that French version of the book in `samples`, you add the `--language` option, like this:

```sh
npm run eb -- output --format screen-pdf --book samples --language fr
```

or, using short aliases:

```sh
npm run eb -- output -f screen-pdf -b samples -l fr
```

#### Other options

As mentioned above, the command `npm run eb` will list all available commands and options.

For example, if you want your website to rebuild faster by only rebuilding the files you're working on, add the `--incremental` option (aka `-i`). This particular option doesn't even need a value after the option:

```sh
npm run eb -- output --incremental
```

If you want to enable maths rendering, add the `--mathjax` option:

```sh
npm run eb -- output --format screen-pdf --book samples --mathjax true
```

Note that if maths is already enabled in a project's Jekyll config(s), the output script will detect that, and it isn't necessary to pass `--mathjax true` as well. (This is unlike older versions of the Electric Book output scripts, which did not check Jekyll configs.)


### Exporting to Word

To get a Word export of a book, use the `export` command instead of `output`, e.g.:

```sh
npm run eb -- export --book samples --format screen-pdf
```


### Project setup check

The `check` command checks that your project and its books include the folders and files required. It checks this for any books for which there are folders in `_data/works`. To run it, enter this at the command line:

```sh
npm run eb -- check
```


## Dependencies

If you want to use the Electric Book template on your local computer, you need to have several things installed:

- [Jekyll](https://jekyllrb.com/) (which also requires Ruby and Bundler)
- [Node.js](https://nodejs.org)
- [Gulp](https://gulpjs.com/)
- [GraphicsMagick](http://www.graphicsmagick.org/) (for creating multiformat images)

Optionally, you can also install:

- [PrinceXML](https://www.princexml.com/), required for PDF output. Prince is the only proprietary dependency.
- [Pandoc](https://pandoc.org/) for Word export
- [rsvg-convert](https://community.chocolatey.org/packages/rsvg-convert
) for good SVGs in Word export (this is already installed on most Mac and Linux machines)
- [Cordova](https://cordova.apache.org), [Android Studio](https://developer.android.com/studio), and (on OSX) [XCode](https://developer.apple.com/xcode/) for building ebook apps.

And of course you should:

- work in a good editor like [VS Code](https://code.visualstudio.com/), [Sublime](https://www.sublimetext.com/), [Brackets](https://brackets.io/) or [Atom](https://atom.io/)
- use [Git](https://git-scm.com/) (e.g. with [GitHub Desktop](https://desktop.github.com/)) for version control and collaboration.


## Support

We use this template for our projects at [Electric Book Works](https://electricbookworks.com). If your organisation wants to use this template and needs help, we can provide paid consulting and support.
