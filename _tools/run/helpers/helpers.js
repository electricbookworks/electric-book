/*jslint node es6 */

var fs = require('fs'); // for working with the file-system
var fsPath = require('path'); // Node's path tool, e.g. for normalizing paths cross-platform
var spawn = require('cross-spawn'); // for spawning child processes like Jekyll across platforms
var open = require('open'); // opens files in user's preferred app
var prince = require('prince'); // installs and runs PrinceXML
var yaml = require('js-yaml'); // reads YAML files into JS objects
var concatenate = require('concatenate'); // concatenate files

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

// Get array of file paths for this output
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

// Processes mathjax in output HTML
var mathjaxRendered = false;
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
    logProcess(mathJaxProcess, 'Gulp', callback, callbackArgs);
    mathjaxRendered = true;
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

// Output a print PDF
function outputPDF(argv) {
    'use strict';

    // If Mathjax is enabled, first render mathjax
    // before continuing with the PDF process.
    if (mathjaxRendered === true) {
        runPrince(argv);
    } else if (mathjaxEnabled(argv)) {
        console.log('Mathjax enabled, rendering maths first.');
        renderMathjax(argv, outputPDF, argv);
    } else {
        runPrince(argv);
    }
}

// Return switches for Jekyll
function switches(argv) {
    'use strict';

    var jekyllSwitches = '';

    // Add baseurl if specified in argv
    if (argv.baseurl) {
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
    outputFilename,
    outputPDF,
    pathExists,
    projectSettings,
    runPrince,
    switches
};
