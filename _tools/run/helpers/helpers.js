/*jslint node es6 */

var fs = require('fs'); // for working with the file-system
var fsPath = require('path'); // Node's path tool, e.g. for normalizing paths cross-platform
var fsPromises = require('fs/promises'); // Node async filesystem operations
var spawn = require('cross-spawn'); // for spawning child processes like Jekyll across platforms
var open = require('open'); // opens files in user's preferred app
var prince = require('prince'); // installs and runs PrinceXML
var yaml = require('js-yaml'); // reads YAML files into JS objects
var concatenate = require('concatenate'); // concatenate files

// Store process status
// (Do we need to reset these at appropriate
// stages in the process to avoid false positives?)
var processStatus = {
    htmlFilesCleaned: false,
    indexCommentsRendered: false,
    indexLinksRendered: false,
    mathjaxRendered: false,
    xhtmlLinksConverted: false,
    xhtmlFilesConverted: false,
    epubAssembly: {
        bookText: false,
        bookStyles: false,
        bookImages: false,
        bookFonts: false,
        bundleJS: false,
        mathjax: false,
        packageOPF: false,
        ncx: false
    }
};

// Output spawned-process data to console
// and callback when the process exits.
function logProcess(process, processName, callback, callbackArgs) {
    'use strict';

    processName = processName || 'Process: ';

    // Listen to stdout
    process.stdout.on('data', function (data) {
        console.log(processName + ': ' + data);
    });

    // Listen to stderr
    process.stderr.on('data', function (data) {
        console.log(processName + ': ' + data);
    });

    // Listen for an error event:
    process.on('error', function (errorCode) {
        console.log(processName + ' errored with: ' + errorCode);
        if (callback) {
            callback();
        }
    });

    // Listen for an exit event:
    process.on('exit', function (exitCode) {
        console.log(processName + ' exited with: ' + exitCode);
        if (callback) {
            callback(callbackArgs);
        }
    });
}

// Return a string of Jekyll config files.
// The filenames passed must be of files
// already saved in the _configs directory.
// They will be added after the default _config.yml.
function configString(argv) {
    'use strict';

    // Start with default config
    var string = '_config.yml';

    // Add format config, if any
    if (argv.format) {
        string += ',_configs/_config.' + argv.format + '.yml';
    }

    // Add any configs passed as argv's
    if (argv.configs) {
        console.log('Adding ' + argv.configs + ' to configs...');
        // Strip quotes that might have been added around arguments by user
        string += '_configs/' + argv.configs.replace(/'/g, '').replace(/"/g, '');
    }

    // Add MathJax config if --mathjax=true
    if (argv.mathjax) {
        console.log('Enabling MathJax...');
        string += ',_configs/_config.mathjax-enabled.yml';
    }

    return string;
}

// Jekyll configs as JS object. Note:
// This includes duplicate keys where concatenated
// config files have the same keys. That's not
// valid YAML, but it's okay in JSON, where
// the last value overrides earlier ones.
function configsObject(argv) {
    'use strict';

    // Create an array of paths to the config files
    var configFiles = configString(argv).split(',');
    configFiles.map(function (file) {
        fsPath.normalize(file);
    });

    // Combine them and load them as a JSON array
    var concatenated = concatenate.sync(configFiles);
    var json = yaml.loadAll(concatenated, {json: true});

    // Return the first object of the first object of the array
    return json[0];
}

// Check if MathJax is enabled in config or CLI arguments
function mathjaxEnabled(argv) {
    'use strict';

    // Check if Mathjax is enabled in Jekyll config
    var mathjaxConfig = configsObject(argv)["mathjax-enabled"];

    // Is mathjax on either in config
    // or activated by argv option?
    var mathJaxOn = false;
    if (argv.mathjax || mathjaxConfig === true) {
        mathJaxOn = true;
    }

    return mathJaxOn;
}

// Run Jekyll with options,
// and pass a callback through to logProcess,
// which calls the callback when Jekyll exits.
function jekyll(command,
        configs,
        baseurl,
        switches,
        callback,
        argv) {

    'use strict';

    console.log('Running Jekyll with command: ' +
            'bundle exec jekyll ' + command +
            ' --config="' + configs + '"' +
            ' --baseurl="' + baseurl + '"' +
            ' ' + switches);

    // Credit for child_process examples:
    // https://medium.com/@graeme_boy/how-to-optimize-cpu-intensive-work-in-node-js-cdc09099ed41

    // Create a child process
    var jekyllProcess = spawn(
        'bundle',
        ['exec', 'jekyll', command,
                '--config', configs,
                '--baseurl', baseurl,
                switches]
    );
    logProcess(jekyllProcess, 'Jekyll', callback, argv);
}

// Checks if a file or folder exists
function pathExists(path) {
    'use strict';

    try {
        if (fs.existsSync(fsPath.normalize(path))) {
            return true;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Get project settings from settings.yml
function projectSettings() {
    'use strict';
    var settings;
    try {
        settings = yaml.load(fs.readFileSync('./_data/settings.yml', 'utf8'));
    } catch (error) {
        console.log(error);
    }
    return settings;
}

// Returns a filename for the output file
function outputFilename(argv) {
    'use strict';

    var filename;
    var fileExtension = '.pdf';
    if (argv.format === 'epub') {
        fileExtension = '.epub';
    }

    if (argv.language) {
        filename = argv.book + '-' + argv.language + '-' + argv.format + fileExtension;
    } else {
        filename = argv.book + '-' + argv.format + fileExtension;
    }

    return filename;
}

// Get a list of works (aka books) in this project
function works() {
    'use strict';

    // Get the works data directory
    var worksDirectory = fsPath.normalize(process.cwd()
            + '/_data/works');

    // Get the folder names in the works directory
    var arrayOfWorks = fs.readdirSync(worksDirectory, {withFileTypes: true})

        // These only work with arrow functions?
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    return arrayOfWorks;
}

// Get the filelist for a format
function fileList(argv) {
    'use strict';

    var format;
    if (argv.format) {
        format = argv.format;
    } else {
        format = 'print-pdf'; // fallback
    }

    // Check for variant-edition output
    var variant = false;
    if (projectSettings()['active-variant']
            && projectSettings()['active-variant'] !== '') {
        variant = projectSettings()['active-variant'];
    }

    var book = "book"; // default
    if (argv.book) {
        book = argv.book;
    }

    // Build path to YAML data for this book
    var pathToYAMLFolder = process.cwd()
            + '/_data/works/'
            + book + '/';

    // Build path to default-edition YAML
    var pathToDefaultYAML = pathToYAMLFolder + 'default.yml';

    // Get the files list
    var metadata = yaml.load(fs.readFileSync(pathToDefaultYAML, 'utf8'));
    var files = metadata.products[format].files;

    // If there was no files list, oops!
    if (!files) {
        console.log('Sorry, couldn\'t find a files list in book data.');
        return [];
    }

    // Build path to translation's default YAML,
    // if a language has been specified.
    var pathToTranslationYAMLFolder,
        pathToDefaultTranslationYAML;
    if (argv.language) {
        pathToTranslationYAMLFolder = pathToYAMLFolder + argv.language + '/';
        pathToDefaultTranslationYAML = pathToTranslationYAMLFolder + 'default.yml';

        // If the translation has this format among its products,
        // and that format has a files list, use that list.
        if (pathToDefaultTranslationYAML
                && pathExists(pathToDefaultTranslationYAML)) {
            var translationMetadata = yaml.load(fs.readFileSync(pathToDefaultTranslationYAML, 'utf8'));
            if (translationMetadata
                    && translationMetadata.products
                    && translationMetadata.products[format]
                    && translationMetadata.products[format].files) {
                files = translationMetadata.products[format].files;
            }
        }
    }

    // Build path to variant-edition YAML,
    // if there is an active variant in settings.
    var pathToVariantYAML = false;

    // If there's a variant and this is a translation ...
    if (argv.language && variant) {
        pathToVariantYAML = pathToTranslationYAMLFolder + variant + '.yml';

    // ... otherwise just get the parent language variant path
    } else if (variant) {
        pathToVariantYAML = pathToYAMLFolder + variant + '.yml';
    }

    // If we have a path, and there's a files list there,
    // use that as the files list.
    if (pathToVariantYAML
            && pathExists(pathToVariantYAML)) {
        var variantMetadata = yaml.load(fs.readFileSync(pathToVariantYAML, 'utf8'));
        if (variantMetadata
                && variantMetadata.products
                && variantMetadata.products[format]
                && variantMetadata.products[format].files) {
            files = variantMetadata.products[format].files;
        }
    }
    // Note that files may be objects, not strings,
    // e.g. { "01": "Chapter 1"}
    return files;
}

// Get array of HTML-file paths for this output
function filePaths(argv) {
    'use strict';

    var fileNames = fileList(argv);

    // Provide fallback book
    var book;
    if (argv.book) {
        book = argv.book;
    } else {
        book = "book";
    }

    var pathToFiles;
    if (argv.language) {
        pathToFiles = process.cwd() + '/' +
                '_site/' +
                book + '/' +
                argv.language;
    } else {
        pathToFiles = process.cwd() + '/' +
                '_site/' +
                book;
    }
    pathToFiles = fsPath.normalize(pathToFiles);

    console.log('Using files in ' + pathToFiles);

    // Extract filenames from file objects,
    // and prepend path to each filename.
    var paths = fileNames.map(function (filename) {

        if (typeof filename === "object") {
            return fsPath.normalize(pathToFiles + '/'
                    + Object.keys(filename)[0] + '.html');
        } else {
            return fsPath.normalize(pathToFiles + '/'
                    + filename + '.html');
        }
    });

    return paths;
}

// Get array of book-asset file paths for this output.
// assetType can be images or styles.
function bookAssetPaths(argv, assetType) {
    'use strict';

    // Provide fallback book
    var book;
    if (argv.book) {
        book = argv.book;
    } else {
        book = "book";
    }

    // Image assets are in a subdirectory
    var formatSubdirectory = '';
    if (assetType === 'images') {
        formatSubdirectory = argv.format;
    }

    var pathToParentAssets, pathToTranslatedAssets;
    if (argv.language) {
        pathToTranslatedAssets = fsPath.normalize(process.cwd()
                + '/_site/'
                + book + '/'
                + argv.language + '/'
                + assetType + '/'
                + formatSubdirectory);
    } else {
        pathToParentAssets = fsPath.normalize(process.cwd()
                + '/_site/'
                + book + '/'
                + assetType + '/'
                + formatSubdirectory);
    }

    // If translated assets exist, use that path,
    // otherwise use the parent assets.
    var pathToAssets;
    if (argv.language
            && fs.readdirSync(pathToTranslatedAssets).length > 0) {
        pathToAssets = pathToTranslatedAssets;
    } else {
        pathToAssets = pathToParentAssets;
    }

    console.log('Using files in ' + pathToAssets);

    // Extract filenames from file objects,
    // and prepend path to each filename.
    var paths = fs.readdirSync(pathToAssets).map(function (filename) {

        if (typeof filename === "object") {
            return fsPath.normalize(pathToAssets + '/'
                    + Object.keys(filename)[0]);
        } else {
            return fsPath.normalize(pathToAssets + '/'
                    + filename);
        }
    });

    return paths;
}

// Processes mathjax in output HTML
function renderMathjax(argv, callback, callbackArgs) {
    'use strict';
    console.log('Rendering MathJax...');

    var mathJaxProcess;
    if (argv.language) {
        mathJaxProcess = spawn(
            'gulp',
            ['mathjax',
                    '--book', argv.book,
                    '--language', argv.language]
        );
    } else {
        mathJaxProcess = spawn(
            'gulp',
            ['mathjax', '--book', argv.book]
        );
    }
    logProcess(mathJaxProcess, 'Rendering MathJax', callback, callbackArgs);
    processStatus.mathjaxRendered = true;
}

// Processes index comments as targets in output HTML
function renderIndexComments(argv, callback, callbackArgs) {
    'use strict';
    console.log('Processing indexing comments ...');

    var indexCommentsProcess;
    if (argv.language) {
        indexCommentsProcess = spawn(
            'gulp',
            ['renderIndexCommentsAsTargets',
                    '--book', argv.book,
                    '--language', argv.language]
        );
    } else {
        indexCommentsProcess = spawn(
            'gulp',
            ['renderIndexCommentsAsTargets', '--book', argv.book]
        );
    }
    logProcess(indexCommentsProcess, 'Index comments', callback, callbackArgs);
    processStatus.indexCommentsRendered = true;
}

// Processes index-list items as linked references in output HTML
function renderIndexLinks(argv, callback, callbackArgs) {
    'use strict';
    console.log('Adding links to reference indexes ...');

    var indexLinksProcess;
    if (argv.language) {
        indexLinksProcess = spawn(
            'gulp',
            ['renderIndexListReferences',
                    '--book', argv.book,
                    '--language', argv.language]
        );
    } else {
        indexLinksProcess = spawn(
            'gulp',
            ['renderIndexListReferences', '--book', argv.book]
        );
    }
    logProcess(indexLinksProcess, 'Index links', callback, callbackArgs);
    processStatus.indexLinksRendered = true;
}

// Converts paths in links from *.html to *.xhtml
function convertXHTMLLinks(argv, callback, callbackArgs) {
    'use strict';
    console.log('Converting links from .html to .xhtml ...');

    var convertXHTMLLinksProcess;
    if (argv.language) {
        convertXHTMLLinksProcess = spawn(
            'gulp',
            ['epub:xhtmlLinks',
                    '--book', argv.book,
                    '--language', argv.language]
        );
    } else {
        convertXHTMLLinksProcess = spawn(
            'gulp',
            ['epub:xhtmlLinks', '--book', argv.book]
        );
    }
    logProcess(convertXHTMLLinksProcess, 'XHTML links', callback, callbackArgs);
    processStatus.xhtmlLinksConverted = true;
}

// Converts .html files to .xhtml, e.g. for epub output
function convertXHTMLFiles(argv, callback, callbackArgs) {
    'use strict';
    console.log('Converting links from .html to .xhtml ...');

    var convertXHTMLFilesProcess;
    if (argv.language) {
        convertXHTMLFilesProcess = spawn(
            'gulp',
            ['epub:xhtmlFiles',
                    '--book', argv.book,
                    '--language', argv.language]
        );
    } else {
        convertXHTMLFilesProcess = spawn(
            'gulp',
            ['epub:xhtmlFiles', '--book', argv.book]
        );
    }
    logProcess(convertXHTMLFilesProcess, 'XHTML files', callback, callbackArgs);
    processStatus.xhtmlFilesConverted = true;
}

// Cleans out old .html files after .xhtml conversions
function cleanHTMLFiles(argv, callback, callbackArgs) {
    'use strict';
    console.log('Cleaning out old .html files ...');

    var cleanHTMLFilesProcess;
    if (argv.language) {
        cleanHTMLFilesProcess = spawn(
            'gulp',
            ['epub:cleanHtmlFiles',
                    '--book', argv.book,
                    '--language', argv.language]
        );
    } else {
        cleanHTMLFilesProcess = spawn(
            'gulp',
            ['epub:cleanHtmlFiles', '--book', argv.book]
        );
    }
    logProcess(cleanHTMLFilesProcess, 'Clean HTML files', callback, callbackArgs);
    processStatus.htmlFilesCleaned = true;
}

// Opens the output file
function openOutputFile(argv) {
    'use strict';
    var filePath = fsPath.normalize(process.cwd() + '/_output/' + outputFilename(argv));
    console.log('Your ' + argv.format + ' is in ' + filePath);
    open(fsPath.normalize(filePath));
}

// Run Prince
function runPrince(argv) {
    'use strict';

    console.log('Rendering HTML to PDF with PrinceXML...');

    // Get Prince license file, if any
    // (and allow for 'correct' spelling, licence).
    var princeLicenseFile = '';
    var princeLicensePath;
    var princeConfig = require(process.cwd() + "/package.json").prince;
    if (princeConfig && princeConfig.license) {
        princeLicensePath = princeConfig.license;
    } else if (princeConfig && princeConfig.licence) {
        princeLicensePath = fsPath.normalize(princeConfig.licence);
    }
    if (fs.existsSync(princeLicensePath)) {
        princeLicenseFile = princeLicensePath;
        console.log('Using PrinceXML licence found at ' + princeLicenseFile);
    }

    // Currently, node-prince does not seem to
    // log its progress to stdout. Possible WIP:
    // https://github.com/rse/node-prince/pull/7
    prince()
        .license('./' + princeLicenseFile)
        .inputs(filePaths(argv))
        .output(process.cwd() + '/_output/' + outputFilename(argv))
        .option('javascript')
        .option('verbose')
        .timeout(100 * 1000) // required for larger books
        .execute()
        .then(function () {
            openOutputFile(argv);
        }, function (error) {
            console.log(error);
        });
}

// Add an array of files to the epub folder.
// The destinationFolder assumes, and is
// relative to, the destination epub folder,
// e.g. it might be `book/images/epub`.
function addToEpub(arrayOfFilePaths, destinationFolder,
        epubAssemblyType, callback, callbackArgs) {
    'use strict';

    // Ensure the destinationFolder ends with a slash
    if (!destinationFolder.endsWith('/')) {
        destinationFolder += '/';
    }

    // Build the full destination path
    var destinationFolderPath = fsPath.normalize(process.cwd()
            + '/_site/epub/' + destinationFolder);

    // Create the destination directory
    fs.mkdirSync(destinationFolderPath, {recursive: true});

    // Track how many files we have to copy
    var totalFiles = arrayOfFilePaths.length;
    var filesCopied = 0;

    // Add each file in the array to the destination
    arrayOfFilePaths.forEach(function (path) {

        // Deduce the filename
        var filename = path.replace(/^.*[\\\/]/, '');

        try {
            fsPromises.copyFile(path, destinationFolderPath + filename);
            console.log('Copied ' + filename + ' to epub folder.');
            filesCopied += 1;

            // Check if we're done
            if (filesCopied === totalFiles) {
                processStatus.epubAssembly[epubAssemblyType] = true;
                callback(callbackArgs);
            }
        } catch (error) {
            console.log('Could not copy ' + filename + ' to epub folder: \n'
                    + error);
        }
    });
}

// Zip the epub folder
function epubZip(argv) {
    'use strict';
    // TO DO
    console.log('Epub zip coming soon...' + argv);
}

// Assemble an epub folder
function assembleEpub(argv) {
    'use strict';

    // If all is assembled, move on to zipping,
    // otherwise continue assembly and recurse.
    if (processStatus.epubAssembly.bookText
            && processStatus.epubAssembly.bookStyles
            && processStatus.epubAssembly.bookImages
            && processStatus.epubAssembly.bookFonts
            && processStatus.epubAssembly.bundleJS
            && processStatus.epubAssembly.mathjax
            && processStatus.epubAssembly.packageOPF
            && processStatus.epubAssembly.ncx) {
        epubZip(argv);
    } else if (processStatus.epubAssembly.bookText === false) {

        // Add text
        addToEpub(filePaths(argv), argv.book, 'bookText', assembleEpub, argv);
    } else if (processStatus.epubAssembly.bookImages === false) {

        // Add images
        addToEpub(bookAssetPaths(argv, 'images'),
                argv.book + '/images/epub', 'bookImages',
                assembleEpub, argv);
    } else if (processStatus.epubAssembly.bookStyles === false) {

        // Add images
        addToEpub(bookAssetPaths(argv, 'styles'),
                argv.book + '/styles', 'bookStyles',
                assembleEpub, argv);
    } else {
        console.log('Epub assembly could not complete. Status:\n'
                + JSON.stringify(processStatus.epubAssembly, null, 2));
    }

    // TO DO
    // Add fonts
    // Add scripts: mathjax, bundle
    // Add package.opf
    // Add toc.ncx
}

// Output a print PDF
function outputPDF(argv) {
    'use strict';

    // If Mathjax is enabled, first render mathjax
    // before continuing with the process.
    if (processStatus.mathjaxRendered === true
            && processStatus.indexCommentsRendered === true
            && processStatus.renderIndexLinks === true) {
        runPrince(argv);
    } else if (mathjaxEnabled(argv)
            && processStatus.mathjaxRendered === false) {
        console.log('Mathjax enabled, rendering maths first.');
        renderMathjax(argv, outputPDF, argv);
    } else if (processStatus.indexCommentsRendered === false) {
        console.log('Checking for indexing comments ...');
        renderIndexComments(argv, outputPDF, argv);
    } else if (processStatus.indexLinksRendered === false) {
        console.log('Adding links to references indexes ...');
        renderIndexLinks(argv, outputPDF, argv);
    } else {
        runPrince(argv);
    }
}

// Output an epub
function outputEpub(argv) {
    'use strict';

    // TO DO. Process will involve:
    // 1. run jekyll [done]
    // 2. process through index comments, index links [done]
    // 3. convert to xhtml: links, files, clean [done]
    // 4. assemble epub folder:
    //    - text [done]
    //    - images [done]
    //    - appropriate styles [done]
    //    - scripts: mathjax, bundle
    //    - fonts
    //    - package, ncx
    // 5. zip epub folder
    // 6. run epubcheck
    // 7. open epub file location

    // First render index comments and links and
    // do XHTML conversions before assembling the epub.
    if (processStatus.indexCommentsRendered === true
            && processStatus.renderIndexLinks === true
            && processStatus.xhtmlLinksConverted === true
            && processStatus.xhtmlFilesConverted === true
            && processStatus.htmlFilesCleaned === true) {
        assembleEpub(argv);
    } else if (processStatus.indexCommentsRendered === false) {
        console.log('Checking for indexing comments ...');
        renderIndexComments(argv, outputEpub, argv);
    } else if (processStatus.indexLinksRendered === false) {
        console.log('Adding links to references indexes ...');
        renderIndexLinks(argv, outputEpub, argv);
    } else if (processStatus.xhtmlLinksConverted === false) {
        console.log('Converting links to XHTML ...');
        convertXHTMLLinks(argv, outputEpub, argv);
    } else if (processStatus.xhtmlFilesConverted === false) {
        console.log('Renaming .html files to .xhtml ...');
        convertXHTMLFiles(argv, outputEpub, argv);
    } else if (processStatus.htmlFilesCleaned === false) {
        console.log('Adding links to references indexes ...');
        cleanHTMLFiles(argv, outputEpub, argv);
    } else {
        assembleEpub(argv);
    }
}

// Return switches for Jekyll
function switches(argv) {
    'use strict';

    var jekyllSwitches = '';

    // Add baseurl if specified in argv.
    // Remember that the default argv options
    // include a blank baseurl in argv, so we don't
    // want to include a baseurl if it's blank.
    if (argv.baseurl && argv.baseurl.length > 0) {
        console.log('Adding baseurl...');
        jekyllSwitches += '--baseurl=' + argv.baseurl + ' ';
    }

    // Add incremental switch if --incremental=true
    if (argv.incremental === true) {
        console.log('Enabling incremental build...');
        jekyllSwitches += '--incremental ';
    }

    // Add switches passed as argv's
    var switchesString = '';
    if (argv.switches) {
        console.log('Adding ' + argv.switches + ' to switches...');
        // Strip quotes that might have been added around arguments by user
        switchesString = argv.switches.replace(/'/g, '').replace(/"/g, '');
    }

    // Add all switches in switchesString
    if (switchesString) {
        // Strip spaces, then split the string into an array,
        // then loop through the array adding each switch.
        switchesString.replace(/\s/g, '');
        switchesString.split(',');
        switchesString.forEach(function (switchString) {
            jekyllSwitches += '--' + switchString;
        });
    }

    return jekyllSwitches;
}

module.exports = {
    configsObject,
    configString,
    jekyll,
    fileList,
    filePaths,
    logProcess,
    mathjaxEnabled,
    openOutputFile,
    outputEpub,
    outputFilename,
    outputPDF,
    pathExists,
    projectSettings,
    runPrince,
    switches,
    works
};
