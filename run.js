// const { shelljs } = require('shelljs'); // for unix commands, not needed yet
const setup = require('./_tools/js/setup.json'); // defines the project setup we check against
const options = require('./_tools/js/options.json'); // options for argv
const argv = require('yargs').options(options).argv; // for accepting arguments when calling this script
const fs = require('fs'); // for working with the file-system
const spawn = require('cross-spawn'); // for spawning child processes like Jekyll across platforms

// All the functions
// -----------------

// assembles the app files in _site/app
function appAssemble() {};

// attempts to build the app with Cordova
function appBuild() {};

// attempts to open the app in an emulator
function appEmulate() {};

// checks if user-provided paths exist
function checkExists(path) {};

// checks project for critical files and folders
function checkProjectSetup(book) {
    console.log('Checking project setup...');
    for (var i = 0; i < setup.length; i++) {
        if (setup[i].type == "required") {
            if (fs.existsSync(setup[i].path)) {} else {
                console.log('Missing: ' + setup[i].path + ' not found.');
            }
        }
    }
    console.log('Check complete.');
};

// return a string of Jekyll config files
function configs(configFiles = '') {

    var configs = '';

    // Add configs passed as argv's
    if (argv.configs) {
        console.log('Adding ' + argv.configs + ' to configs...');
        // Strip quotes that might have been added around arguments by user
        configs += '_configs/' + argv.configs.replace(/'/g, '').replace(/"/g, '') + ',';
    };

    // Add MathJax config if --mathjax=true
    if (argv.mathjax == true) {
        console.log('Enabling MathJax...');
        configs +=  '_configs/_config.mathjax-enabled.yml,';
    };

    // Add any configs passed as a string to this function.
    if (configFiles != '') {
        // Strip spaces, then split the string into an array,
        // then loop through the array adding each config file.
        // Don't add a comma after the last iteration.
        var configFiles = configFiles.replace(/\s/g, '');
            configFiles = configFiles.split(',');
            configFiles.forEach(function(configFile, index, array) {
                if (index === array.length - 1) {
                    configs += '_configs/' + configFile;
                } else {
                    configs += '_configs/' + configFile + ',';
                }
            });
    }

    return configs;
}

// assembles epub in _site/epub
function epubAssemble() {};

// copies epub files into a compressed zip package correctly
function epubPackage() {};

// attempts to run the epub through epubcheck
function epubValidate(path) {};

// exits
function exit() {};

// converts .html files to .docx with pandoc
function exportWord() {};

// Run Jekyll with options,
// and pass a calback through to processOutput,
// which calls the callback when Jekyll exits.
function jekyll(command = 'build', configs = '', baseurl = '', switches = '', callback = '') {

    console.log('Running Jekyll with command: ' + 
                'bundle exec jekyll ' + command +
                ' --config="' + configs + '"' +
                ' --baseurl="' + baseurl + '"' +
                ' ' + switches
                );

    // Credit for child_process examples:
    // https://medium.com/@graeme_boy/how-to-optimize-cpu-intensive-work-in-node-js-cdc09099ed41

    // Are we killing Jekyll or starting it?
    // We have our own 'kill' Jekyll argument for this.
    // If Jekyll is running and the command is to kill, kill the process.
    // NOTE: I'm not sure we need this kill.
    if (jekyllProcess && command == 'kill') {
        jekyllProcess.kill();
    } else {
        // Create a child process
        var jekyllProcess = spawn('bundle exec jekyll ' +
                                  command +
                                  ' --config="' + configs + '"' +
                                  ' --baseurl="' + baseurl + '"' +
                                  ' ' + switches
                                  );
        processOutput(jekyllProcess, 'Jekyll', callback);
    }

};

// kills child processes
function killProcesses() {};

// opens the output folder in file explorer
function openOutputFolder(format) {};

// starting place when -t output -f app
function outputApp() {};

// starting place when -t output -f epub
function outputEpub() {};

// returns a filename
function outputFilename(format, book, [subdir]) {};

// starting place when -t output -f print-pdf
function outputPrintPdf() {};

// starting place when -t output -f screen-pdf
function outputScreenPdf() {};

// starting place when -t output -f web
function outputWeb() {};

// Output spawned-process data to console
// and callback when the process exits.
function processOutput(process, processName = 'Process', callback = '') {

        // Listen to stdout
        process.stdout.on('data', 
            function (data) {
                console.log(processName + ': ' + data);
            }
        );

        // Listen to stderr
        process.stderr.on('data',
            function (data) {
                console.log(processName + ': ' + data);
            }
        );

        // Listen for an exit event:
        process.on('exit', function (exitCode) {
            console.log(processName + ' exited with code: ' + exitCode);
            callback;
        });
}

// returns the absolute path to the project root
function projectRoot() {
    return process.cwd();
};

// runs HTML through a headless browser with render-mathax.js
function renderMathjax() {};

// Return switches for Jekyll
function switches(switchesString = '') {

    var switches = '';
    var switchesString = switchesString;

    // Add incremental switch if --incremental=true
    if (argv.incremental == true) {
        console.log('Enabling incremental build...');
        switches += '--incremental ';
    };

    // Add switches passed as argv's to the switchesString
    if (argv.switches) {
        console.log('Adding ' + argv.switches + ' to switches...');
        // Strip quotes that might have been added around arguments by user
        switchesString += argv.switches.replace(/'/g, '').replace(/"/g, '');
    };

    // Add all switches in switchesString
    if (switchesString != '') {
        // Strip spaces, then split the string into an array,
        // then loop through the array adding each switch.
        switchesString = switchesString.replace(/\s/g, '');
        switchesString = switchesString.split(',');
        switchesString.forEach(function(switchString, index, array) {
            switches += '--' + switchString;
        });
    }

    return switches;
}

// runs the export process if -t export
function taskExport(sourceFormat, exportFormat) {};

// processes images with gulp if -t images
function taskImages(book, subdir) {
    var gulpProcess = spawn('gulp --book ' + book + ' --language ' + subdir)
    processOutput(gulpProcess, 'gulp');
};

// refreshes the search index if -t index
function taskIndex(format) {};

// Install Ruby and Node dependencies.
// To do: add checks for other Electric Book dependencies.
function taskInstall() {
        console.log(
            'Running Bundler to install Ruby gem dependencies...\n'+
            'If you get errors, check that Bundler is installed (https://bundler.io).'
            );
        var bundleProcess = spawn('bundle install');
        processOutput(bundleProcess, 'Bundler')

        console.log(
            'Running npm to install Node modules...\n' +
            'If you get errors, check that Node.js is installed (https://nodejs.org).'
            );
        var npmProcess = spawn('npm install');
        processOutput(npmProcess, 'npm')
};

// Create an Electric Book output
function taskOutput(format) {

    // print-pdf
    if (format == 'print-pdf') {
        jekyll('build', configs(), argv.baseurl, switches(), outputPrintPdf())
        // work-in-progress here: to see if outputPrintPdf() works as a callback
    }

    // web
    if (format == 'web') {
        jekyll('serve', configs(), argv.baseurl, switches())
    }

    // To do: output print-pdf, screen-pdf, epub, app
};

// Execution
// ---------

// Store the project root location
var location = projectRoot();

// Check that the project contains required files
if (argv.task == 'check') {
    checkProjectSetup(argv.book);
}

// Output a project or a book
if (argv.task == 'output') {
    taskOutput(argv.format)
}

// Process images
if (argv.task == 'images') {
    taskImages(argv.book, argv.subdir)
}

// Install dependencies
if (argv.task == 'install') {
    taskInstall()
}

