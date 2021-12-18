# Electric Book Node runner

This is a temporary README during development.

This is an attempt to replace our EB output scripts with a single node script. After that, we'll try run the node script from an Electron GUI.

So far, this script can do some options from the run-* shell scripts:

- [x]  Create a print PDF
- [x]  Create a screen PDF
- [x]  Run as a website
- [ ]  Create an epub
- [ ]  Create an app
- [ ]  Export to Word
- [x]  Convert source images to output formats
- [ ]  Refresh search index
- [x]  Install or update dependencies

Additional functions it provides:

- [x] Basic check of folder and file structure

This works alongside the prototyped Electric Book Builder, an Electron-based GUI for outputting Electric Book books.


## Usage

Run this at the command line with

```sh
npm run electric-book
```

to see all command options.

For the default output, a local web server:

```sh
npm run electric-book -- output
```

That is the shortest command, an implies the default `format` option, `web`.

So the full command for a web server is actually:

```sh
npm run electric-book -- output --format=web
```

Note that the `output` command comes after the free-standing ` -- `, including spcaes on either side, after `electric-book`. This is [required by npm when parsing the command](https://medium.com/fhinkel/the-curious-case-of-double-dashes-b5e7711698f).

You can then change things like your output format:

```sh
npm run electric-book -- output --format=print-pdf
```

for a print-PDF output of the default `book`. Since `output` is a default command, you can shorten this to:

```sh
npm run electric-book -- --format=print-pdf
```

If you're not outputting the default `book`, you must specify the book folder you want with the `--book` option. This will generate a screen PDF of the *Samples* book, with maths enabled:

```sh
npm run electric-book -- --format=screen-pdf --book=samples --mathjax=true
```

Note that if maths is enabled in a project's Jekyll config(s), the output script will detect that, and it isn't necessary to pass `--mathjax=true` as well. (This is unlike older EBT output scripts, which did not check Jekyll configs.)

To see all available options, enter:

```sh
npm run electric-book -- help
```


### Project setup check

The `check` command checks that basic folders and files exist for the project and any books with folders in `_data/works`. To run it:

```sh
npm run electric-book -- check
```


## Resources

These look like they'll be useful or necessary for replacing parts of the output scripts.

- [ShellJS](https://github.com/shelljs/shelljs), which provides Unix shell commands for Node.js
- [gulpjs/issues/770](https://github.com/gulpjs/gulp/issues/770#issuecomment-63121203) comment by @contra on how to use gulpfile in node script
- [nightmare.js](http://www.nightmarejs.org/) (npm install nightmare) to replace phantomjs (longer term to replace phantom entirely), if we don't already have electron available, in which case we should use that for consistency.

We probably won't need these, because we can execute these commands ourselves, but just in case:

- [node-pandoc](https://www.npmjs.com/package/node-pandoc) (still requires pandoc to be installed)
- [npm: infozip-bin](https://www.npmjs.com/package/infozip-bin)
- [gitbookIO/node-epubcheck](https://github.com/gitbookIO/node-epubcheck) (wrapper, still requires epubcheck to be available)
- [electron: shell.showitemInFolder(fullpath)](https://github.com/electron/electron/blob/master/docs/api/shell.md#shellshowiteminfolderfullpath) if we want to install electron
