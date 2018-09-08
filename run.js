// const { shelljs } = require('shelljs'); // for unix commands, not needed yet
const setup = require('./_tools/js/setup.json'); // defines the project setup we check against
const options = require('./_tools/js/options.json'); // options for argv
const argv = require('yargs').options(options).argv; // for accepting arguments when calling this script
const fs = require('fs'); // for working with the file-system
const spawn = require('cross-spawn'); // for spawning child processes like Jekyll across platforms

// All the functions
// -----------------

// // assembles the app files in _site/app
// function appAssemble() {
//     'use strict';
//     console.log('Assembling app...');
// }

// // attempts to build the app with Cordova
// function appBuild() {
//     'use strict';
//     console.log('Building app HTML...');
// }

// // attempts to open the app in an emulator
// function appEmulate() {
//     'use strict';
//     console.log('Attempting to open app emulator...');
// }

// Checks if a file or folder exists
function checkExists(path) {
    'use strict';
    console.log('Checking that ' + path + ' exists.');
    fs.access(path, function (err) {
        if (err && err.code === 'ENOENT') {
            console.log('Missing: ' + path + ' not found.');
        }
    });
}

// checks project for critical files and folders
function checkProjectSetup(book) {
    'use strict';

    console.log('Checking project setup for ' + book);
    var i;
    for (i = 0; i < setup.length; i += 1) {
        checkExists(setup[i].path);
    }
    console.log('Check complete.');
}

// return a string of Jekyll config files
function configs(configFiles) {
    'use strict';

    var configString = '';

    // Add configs passed as argv's
    if (argv.configs) {
        console.log('Adding ' + argv.configs + ' to configs...');
        // Strip quotes that might have been added around arguments by user
        configString += '_configs/' + argv.configs.replace(/'/g, '').replace(/"/g, '') + ',';
    }

    // Add MathJax config if --mathjax=true
    if (argv.mathjax === true) {
        console.log('Enabling MathJax...');
        configString += '_configs/_config.mathjax-enabled.yml,';
    }

    // Add any configs passed as a string to this function.
    if (configFiles) {
        // Strip spaces, then split the string into an array,
        // then loop through the array adding each config file.
        // Don't add a comma after the last iteration.
        configFiles.replace(/\s/g, '');
        configFiles.split(',');
        configFiles.forEach(function (configFile, index, array) {
            if (index === array.length - 1) {
                configString += '_configs/' + configFile;
            } else {
                configString += '_configs/' + configFile + ',';
            }
        });
    }

    return configString;
}

// // assembles epub in _site/epub
// function epubAssemble() {
//     'use strict';
//     console.log('Assembling epub...');
// }

// // copies epub files into a compressed zip package correctly
// function epubPackage() {
//     'use strict';
//     console.log('Packaging epub...');
// }

// // attempts to run the epub through epubcheck
// function epubValidate(path) {
//     'use strict';
//     console.log('Validating epub...');
// }

// // Exit
// function exit() {
//     'use strict';
//     console.log('Exiting...');
// }

// // converts .html files to .docx with pandoc
// function exportWord() {
//     'use strict';
//     console.log('Exporting to Word...');
// }

// Run Jekyll with options,
// and pass a calback through to processOutput,
// which calls the callback when Jekyll exits.
function jekyll(command,
        configs,
        baseurl,
        switches,
        callback) {

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
        'bundle exec jekyll ' +
        command +
        ' --config="' + configs + '"' +
        ' --baseurl="' + baseurl + '"' +
        ' ' + switches
    );
    processOutput(jekyllProcess, 'Jekyll', callback);
}

// // kills child processes
// function killProcesses() {
//     'use strict';
//     console.log('Killing processes...');
// }

// // opens the output folder in file explorer
// function openOutputFolder(format) {
//     'use strict';
//     console.log('Opening output folder for ' + format + '...');
// }

// // starting place when -t output -f app
// function outputApp() {
//     'use strict';
//     console.log('Creating app...');
// }

// // starting place when -t output -f epub
// function outputEpub() {
//     'use strict';
//     console.log('Creating epub...');
// }

// // returns a filename
// function outputFilename(format, book, subdir) {
//     'use strict';
//     console.log('Naming output file...');
// }

// Output a print PDF
function outputPrintPdf(book, subdir, mathjax, callback) {
    'use strict';

    console.log('To output ' + book + '/' + subdir + ' here.');
    if (mathjax === true) {
        console.log('Mathjax enabled.');
    }
    callback();
}

// // Output a screen PDF
// function outputScreenPdf() {
//     'use strict';
//     console.log('Creating screen PDF...');
// }

// // Serve a website
// function outputWeb() {
//     'use strict';
//     console.log('Building website...');
// }

// Output spawned-process data to console
// and callback when the process exits.
function processOutput(process, processName, callback) {
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

    // Listen for an exit event:
    process.on('exit', function (exitCode) {
        console.log(processName + ' exited with code: ' + exitCode);
        callback();
    });
}

// returns the absolute path to the project root
function projectRoot() {
    'use strict';
    return process.cwd();
}

// // runs HTML through a headless browser with render-mathax.js
// function renderMathjax() {
//     'use strict';
//     console.log('Rendering MathJax...');
// }

// Return switches for Jekyll
function switches(switchesString) {
    'use strict';

    var jekyllSwitches = '';

    // Add incremental switch if --incremental=true
    if (argv.incremental === true) {
        console.log('Enabling incremental build...');
        jekyllSwitches += '--incremental ';
    }

    // Add switches passed as argv's to the switchesString
    if (argv.switches) {
        console.log('Adding ' + argv.switches + ' to switches...');
        // Strip quotes that might have been added around arguments by user
        switchesString += argv.switches.replace(/'/g, '').replace(/"/g, '');
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

// // Export content
// function taskExport(sourceFormat, exportFormat) {
//     'use strict';
//     console.log('Exporting content...');
// }

// processes images with gulp if -t images
function taskImages(book, subdir) {
    'use strict';

    var gulpProcess = spawn('gulp --book ' + book + ' --language ' + subdir);
    processOutput(gulpProcess, 'gulp');
}

// // Refresh the search index
// function taskIndex(format) {
//     'use strict';
//     console.log('Generating search index...');
// }

// Install Ruby and Node dependencies.
// To do: add checks for other Electric Book dependencies.
function taskInstall() {
    'use strict';

    console.log(
        'Running Bundler to install Ruby gem dependencies...\n' +
        'If you get errors, check that Bundler is installed (https://bundler.io).'
    );
    var bundleProcess = spawn('bundle install');
    processOutput(bundleProcess, 'Bundler');

    console.log(
        'Running npm to install Node modules...\n' +
        'If you get errors, check that Node.js is installed (https://nodejs.org).'
    );
    var npmProcess = spawn('npm install');
    processOutput(npmProcess, 'npm');
}

// Create an Electric Book output
function taskOutput(format) {
    'use strict';

    // print-pdf
    if (format === 'print-pdf') {
        jekyll(
            'build',
            configs('_config.print-pdf.yml'),
            argv.baseurl,
            switches(),
            outputPrintPdf(argv.book, argv.subdir, argv.mathjax)
        );
    }

    // web
    if (format === 'web') {
        jekyll('serve', configs(), argv.baseurl, switches());
    }

    // To do: output print-pdf, screen-pdf, epub, app
}

// Execution
// ---------

// Store the project root location
var location = projectRoot();

// Check that the project contains required files
if (argv.task === 'check') {
    checkProjectSetup(argv.book);
}

// Output a project or a book
if (argv.task === 'output') {
    taskOutput(argv.format);
}

// Process images
if (argv.task === 'images') {
    taskImages(argv.book, argv.subdir);
}

// Install dependencies
if (argv.task === 'install') {
    taskInstall();
}

