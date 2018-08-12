# Electric Book Node runner

This is a temporary README during development.

This is an attempt to replace our EB output scripts with a single node script. After that, we'll try run the node script from an Electron GUI.

## Resources

These look like they'll be useful or necessary for replacing parts of the output scripts.

- [ShellJS](https://github.com/shelljs/shelljs)
- [npm: prince](https://www.npmjs.com/package/prince): useful if it can lock a Prince version per project
- [gulpjs/issues/770](https://github.com/gulpjs/gulp/issues/770#issuecomment-63121203) comment by @contra on how to use gulpfile in node script
- [nightmare.js](http://www.nightmarejs.org/) (npm install nightmare) to replace phantomjs (longer term to replace phantom entirely), if we don't already have electron available, in which case we should use that for consistency.

We probbaly won't need these, because we can execute these commands ourselves, but just in case:

- [node-pandoc](https://www.npmjs.com/package/node-pandoc) (still requires pandoc to be installed)
- [npm: infozip-bin](https://www.npmjs.com/package/infozip-bin)
- [gitbookIO/node-epubcheck](https://github.com/gitbookIO/node-epubcheck) (wrapper, still requires epubcheck to be available)
- [electron: shell.showitemInFolder(fullpath)](https://github.com/electron/electron/blob/master/docs/api/shell.md#shellshowiteminfolderfullpath) if we wan to install electron

## Arguments

This script will run with arguments:

|     Argument    |      Aliases       | Default |                        Possible values                        |   Type  |
|-----------------|--------------------|---------|---------------------------------------------------------------|---------|
| --task          | -t                 | output  | output, images, index, install, export                        | string  |
| --format        | -f                 | web     | print-pdf, screen-pdf, web, epub, app                         | string  |
| --book          | -b                 | book    | [any dir except, assets, node_modules, or starts with _ or .] | string  |
| --subdir        | --language, -s, -l |         | [any dir inside book]                                         | string  |
| --configs       | -c                 |         | [any .yml file in /_configs]                                  | string  |
| --mathjax       | -m                 | false   | true or false                                                 | boolean |
| --baseurl       | -u                 |         | [any string that starts with a / and contains no spaces]      | string  |
| --epubcheck     | -e                 |         | [checks path, or uses value or arg as path]                   | string  |
| --app-os        | -a                 | android | android, windows, ios                                         | string  |
| --app-build     | -d                 | false   | true or false                                                 | boolean |
| --app-release   | -r                 | false   | true or false                                                 | boolean |
| --app-emulate   | -p                 | false   | true or false                                                 | boolean |
| --export-format | -x                 | word    | word                                                          | string  |

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

## Project setup check

The `checkProjectSetup` function checks that the following folders and files exist, for the project and the book being output:

``` json
[
    {
    "path": "_app",
    "type": "required",
    "description": "Template files required for app output. You shouldn't ever have to change these."
    },
    {
    "path": "_configs",
    "type": "required",
    "description": "A folder of configuration settings for different outputs. You'll rarely have to change these, though you might occasionally need to customise outputs here."
    },
    {
    "path": "_data",
    "type": "required",
    "description": "A folder of data to use in your books (including project metadata)."
    },
    {
    "path": "_data/meta.yml",
    "type": "required",
    "description": "Your project's metadata."
    },
    {
    "path": "_data/locales.yml",
    "type": "required",
    "description": "Text for phrases, per language."
    },
    {
    "path": "_data/settings.yml",
    "type": "required",
    "description": "Project settings."
    },
    {
    "path": "_docs",
    "type": "recommended",
    "description": "Documentation on how to use the template."
    },
    {
    "path": "_epub",
    "type": "required",
    "description": "Template files required for epub output. You shouldn't ever have to change these."
    },
    {
    "path": "_includes",
    "type": "required",
    "description": "HTML templates that Jekyll uses to build your books. You will rarely change anything here. You may need to add new templates here for custom book features."
    },
    {
    "path": "_layouts",
    "type": "required",
    "description": "Templates that Jekyll uses to structure pages. You shouldn't ever have to change these."
    },
    {
    "path": "_output",
    "type": "required",
    "description": "The folder where output scripts will save your PDFs and epubs."
    },
    {
    "path": "_sass",
    "type": "required",
    "description": "A folder that stores the default styles for your books. You shouldn't ever have to change these unless you're heavily modifying designs for a series."
    },
    {
    "path": "_site",
    "type": "automatic",
    "description": "Jekyll will automatically generate this folder for the web and app versions of your books."
    },
    {
    "path": "_tools",
    "type": "required",
    "description": "Utilities required for output. For instance, colour profiles for PDFs and image conversions and the Zip utility for creating epubs. You shouldn't have to change these. You might add your own colour profiles to `_tools/profiles` for specialised projects."
    },
    {
    "path": "assets",
    "type": "required",
    "description": "A folder of Javascript, font files and images that your whole project might use."
    },
    {
    "path": "assets/cover.jpg",
    "type": "recommended",
    "description": "An image used as the default for the project as a whole."
    },
    {
    "path": "assets/publisher-logo.jpg",
    "type": "optional",
    "description": "A logo (which you'll replace with your own) for the project and website as a whole."
    },
    {
    "path": "assets/fonts",
    "type": "optional",
    "description": "A place to store fonts that all books in a project might use. The template includes several open-licensed fonts here already."
    },
    {
    "path": "assets/js",
    "type": "required",
    "description": "Javascript used in the template. Advanced users might add their own scripts here and manage which scripts are included on pages in `bundle.js`. See the ['Using Javascript'](../advanced/javascript.html) section for more detail."
    },
    {
    "path": "book",
    "type": "optional",
    "description": "The default folder for a book's content, stored in markdown files. You might add more similarly structured folders for further books in your project. You'd duplicate and rename this folder for each book you add to your project."
    },
    {
    "path": "book/index.md",
    "type": "required",
    "description": "A landing page for the book. You can leave this file as is. It's useful in web and app versions, and just redirects to the `text` folder. If you create a new book, you should copy this file as is into the same place in the new book's folder."
    },
    {
    "path": "book/package.opf",
    "type": "required",
    "description": "Required for epub output. Jekyll fills out this file and it's built into the epub. If you create a new book, you should copy this file as is into the same place in the new book's folder."
    },
    {
    "path": "book/toc.ncx",
    "type": "optional",
    "description": "A navigation file for backwards-compatibility in older ereaders. You only need this file in a book if that backwards-compatibility is important to you."
    },
    {
    "path": "book/fonts",
    "type": "recommended",
    "description": "Store any font files for your book here. (If you want to share font files across books, you can also store fonts in `assets/fonts`.)"
    },
    {
    "path": "book/images",
    "type": "recommended",
    "description": "This is where you store images for a book."
    },
    {
    "path": "book/styles",
    "type": "required",
    "description": "Contains the stylesheets for designing your book's various outputs."
    },
    {
    "path": "book/text",
    "type": "required",
    "description": "Where you store your content files in markdown (`.md`) files."
    },
    {
    "path": "book/text/file-list",
    "type": "required",
    "description": "Jekyll turns this into a list of files that the system uses for output, for instance to tell PrinceXML which files to include in a PDF. It gets this file list from the `files:` lists that you create in `_data/meta.yml`"
    },
    {
    "path": "book/text/index.md",
    "type": "required",
    "description": "A landing page for your book. Jekyll will build this to contain the book's cover image, and clicking it will open the book's start page, which you define in `_data/meta.yml`."
    },
    {
    "path": "_config.yml",
    "type": "required",
    "description": "A file for setting configuration options for Jekyll, which will compile your book for output."
    },
    {
    "path": "_prose.yml",
    "type": "recommended",
    "description": "Configuration settings for using [prose.io](http://prose.io) for online book editing (generally, you won't have to edit this file) and for excluding files from view in the [Electric Book Manager](https://electricbookworks.github.io/electric-book-gui/)."
    },
    {
    "path": "gulpfile.js",
    "type": "required",
    "description": "The 'recipe' for processing images from `_source` into various output formats. Most users can ignore this. Advanced users may want to adjust it, or use it for processing and minifying Javascript."
    },
    {
    "path": "index.md",
    "type": "required",
    "description": "the home page of your project when served as a website."
    },
    {
    "path": "search.md",
    "type": "required",
    "description": "the search page of your project when served as a website."
    },
    {
    "path": "run-windows.bat",
    "type": "required",
    "description": "A script for running the Electric Book project on Windows."
    },
    {
    "path": "run-mac.command",
    "type": "required",
    "description": "A script for running the Electric Book project on a Mac."
    },
    {
    "path": "run-linux.sh",
    "type": "required",
    "description": "A script for running the Electric Book project on Linux."
    },
    {
    "path": "README.md",
    "type": "recommended",
    "description": "The starting place for your collaborators. It should tell them how to use the project."
    },
    {
    "path": ".gitignore",
    "type": "required",
    "description": "The .gitignore file tells Git what files not to track. You shouldn't need to edit it."
    },
    {
    "path": "eslint.json",
    "type": "optional",
    "description": "Advanced users might use this when processing Javascript with our Gulpfile. Most users can ignore it."
    },
    {
    "path": "Gemfile",
    "type": "required",
    "description": "Determines which versions of Ruby gems your project uses. You'll rarely have to chance this unless you know exactly why you're changing it."
    },
    {
    "path": "Gemfile.lock",
    "type": "automatic",
    "description": "Defines which gems were installed when Ruby ran the Gemfile."
    },
    {
    "path": "LICENSE",
    "type": "recommended",
    "description": "The license terms under which this project is published."
    },
    {
    "path": "node_modules",
    "type": "automatic",
    "description": "Once you install Gulp and its dependencies for a project, you'll also see this folder in your project. You can ignore this, but don't delete it. It will not be tracked by Git."
    },
    {
    "path": "package.json",
    "type": "required",
    "description": "Determines which Node modules your projects needs for things like image processing and building apps. Most users can ignore this file. Advanced users will need to edit it to use new Node modules."
    },
    {
    "path": "package-lock.json",
    "type": "automatic",
    "description": "Defines which packages were installed when Node ran package.json."
    }
]

```
