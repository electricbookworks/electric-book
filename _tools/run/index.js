/*jslint node */
/*globals */

var options = require('./helpers/options.js').options;

// Parse arguments when calling this script
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .default('help')
    .commandDir('./commands/')
    .options(options)
    .demandCommand(1, "Provide at least one command, e.g. '-- output'")
    .showHelpOnFail(true)
    .wrap(100)
    .version(false) // disable, gives npm version number
    .scriptName("npm run electric-book")
    .argv;

// // Assembles epub in _site/epub
// function epubAssemble() {
//     'use strict';
//     console.log('Assembling epub...');
// }

// // Copies epub files into a compressed zip package correctly
// function epubPackage() {
//     'use strict';
//     console.log('Packaging epub...');
// }

// // Attempts to run the epub through epubcheck
// function epubValidate(path) {
//     'use strict';
//     console.log('Validating epub...');
// }

// // Exit
// function exit() {
//     'use strict';
//     console.log('Exiting...');
// }

// // Converts .html files to .docx with pandoc
// function exportWord() {
//     'use strict';
//     console.log('Exporting to Word...');
// }

// Kills child processes
// function killProcesses() {
//     'use strict';
//     console.log('Killing processes...');
// }

// // Starting place when -t output -f app
// function outputApp() {
//     'use strict';
//     console.log('Creating app...');
// }

// // Starting place when -t output -f epub
// function outputEpub() {
//     'use strict';
//     console.log('Creating epub...');
// }

// // Serve a website
// function outputWeb() {
//     'use strict';
//     console.log('Building website...');
// }

// // Export content
// function taskExport(sourceFormat, exportFormat) {
//     'use strict';
//     console.log('Exporting content...');
// }

// // Refresh the search index
// function taskIndex(format) {
//     'use strict';
//     console.log('Generating search index...');
// }
