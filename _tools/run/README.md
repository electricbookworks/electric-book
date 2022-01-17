# Electric Book Node runner

This is a temporary README during development.

This is an attempt to replace our EB output scripts with a single node script. After that, we'll try run the node script from an Electron GUI.

So far, this script can do some options from the run-* shell scripts:

- [x]  Create a print PDF
- [x]  Create a screen PDF
- [x]  Run as a website
- [x]  Create an epub
- [ ]  Create an app
- [x]  Export to Word
- [x]  Convert source images to output formats
- [x]  Refresh search index
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

Note that the `output` command comes after the free-standing ` -- `, including spaces on either side, after `electric-book`. This is [required by npm when parsing the command](https://medium.com/fhinkel/the-curious-case-of-double-dashes-b5e7711698f).

You can then change things like your output format:

```sh
npm run electric-book -- output --format=print-pdf
```

for a print-PDF output of the default `book`.

If you're not outputting the default `book`, you must specify the book folder you want with the `--book` option. This will generate a screen PDF of the *Samples* book, with maths enabled:

```sh
npm run electric-book -- output --format=screen-pdf --book=samples --mathjax=true
```

To get a Word export of a book, use `export` instead of `output`, e.g.:

```sh
npm run electric-book -- output --book=samples --format=screen-pdf
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
