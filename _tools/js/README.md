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
npm run electricbook
```

for the default output: a local web server.

Add arguments for other tasks, e.g.

```sh
npm run electricbook -- --task=output --format=print-pdf
```

for print output of the default `book`.

Another example. This will generate a screen PDF of the Samples book with maths enabled:

```sh
npm run electricbook -- --task=output --format=screen-pdf --book=samples --mathjax=true
```

### Project setup check

The `checkProjectSetup` function checks that basic folders and files exist for the project and the book being output. To run it:

```sh
npm run electricbook -- --task=check
```

The folders and files are listed in `setup.json`.

This check is not very thorough yet, and only checks the default `book` folder, not other, custom book folders.

## Arguments

This script runs with these arguments:

|     Argument    |      Aliases       | Default |                        Possible values                        |   Type  |
|-----------------|--------------------|---------|---------------------------------------------------------------|---------|
| --task          | -t                 | output  | check, output, images, index, install, export                 | string  |
| --format        | -f                 | web     | print-pdf, screen-pdf, web, epub, app                         | string  |
| --book          | -b                 | book    | [any dir except, assets, node_modules, or starts with _ or .] | string  |
| --subdir        | --language, -s, -l |         | [any dir inside book]                                         | string  |
| --configs       | -c                 |         | [any .yml file in /_configs]                                  | string  |
| --mathjax       | -m                 | false   | true or false                                                 | boolean |
| --baseurl       | -u                 |         | [any string that starts with a / and contains no spaces]      | string  |
| --incremental   | -i                 | false   | true or false                                                 | boolean |
| --epubcheck     | -e                 |         | [checks path, or uses value or arg as path]                   | string  |
| --app-os        | -o                 | android | android, windows, ios                                         | string  |
| --app-build     | -d                 | false   | true or false                                                 | boolean |
| --app-release   | -r                 | false   | true or false                                                 | boolean |
| --app-emulate   | -p                 | false   | true or false                                                 | boolean |
| --export-format | -x                 | word    | word                                                          | string  |

These are defined in `options.json`, which is [read by `argv`](https://www.npmjs.com/package/argv#options).

## Functions

I expect we'll break up the script into these functions.

``` js
checkProjectSetup(book); // checks project for critical files and folders
checkExists(path); // checks if user-provided paths exist
projectRoot(); // returns the absolute path to the project root

taskOutput(format); // runs the output process if -t output
taskImages(book, [subdir]); // processes images with gulp if -t images
taskIndex(format); // refreshes the search index if -t index
taskInstall(); // installs Ruby and Node dependencies (and may check for other application dependencies)
taskExport(sourceFormat, exportFormat); // runs the export process if -t export

outputPrintPdf(); // starting place when -t output -f print-pdf
outputScreenPdf();  // starting place when -t output -f screen-pdf
outputWeb(); // starting place when -t output -f web
outputEpub(); // starting place when -t output -f epub
outputApp(); // starting place when -t output -f app

jekyll(command, [configs, baseurl]); // runs Jekyll
renderMathjax(); // runs HTML through a headless browser with render-mathax.js
outputFilename(format, book, [subdir]); // returns a filename

epubAssemble(); // assembles epub in _site/epub
epubPackage(); // copies epub files into a compressed zip package correctly
epubValidate(path) // attempts to run the epub through epubcheck

appAssemble(); // assembles the app files in _site/app
appBuild(); // attempts to build the app with Cordova
appEmulate(); // attempts to open the app in an emulator

exportWord(); // converts .html files to .docx with pandoc

openOutputFolder(format); // opens the output folder in file explorer

killProcesses(); // kills child processes
exit(); // exits
```

## Resources

These look like they'll be useful or necessary for replacing parts of the output scripts.

- [ShellJS](https://github.com/shelljs/shelljs), which provides Unix shell commands for Node.js
- [npm: prince](https://www.npmjs.com/package/prince): useful if it can lock a Prince version per project
- [gulpjs/issues/770](https://github.com/gulpjs/gulp/issues/770#issuecomment-63121203) comment by @contra on how to use gulpfile in node script
- [nightmare.js](http://www.nightmarejs.org/) (npm install nightmare) to replace phantomjs (longer term to replace phantom entirely), if we don't already have electron available, in which case we should use that for consistency.

We probably won't need these, because we can execute these commands ourselves, but just in case:

- [node-pandoc](https://www.npmjs.com/package/node-pandoc) (still requires pandoc to be installed)
- [npm: infozip-bin](https://www.npmjs.com/package/infozip-bin)
- [gitbookIO/node-epubcheck](https://github.com/gitbookIO/node-epubcheck) (wrapper, still requires epubcheck to be available)
- [electron: shell.showitemInFolder(fullpath)](https://github.com/electron/electron/blob/master/docs/api/shell.md#shellshowiteminfolderfullpath) if we want to install electron
