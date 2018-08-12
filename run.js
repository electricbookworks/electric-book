const { shelljs } = require('shelljs');
const { argv } = require('yargs');
const fs = require('fs');
const options = require('./_tools/js/options.json');
const setup = require('./_tools/js/setup.json');

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

// runs Jekyll
function jekyll(command, [configs, baseurl]) {};

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

// returns the absolute path to the project root
function projectRoot() {
	return process.cwd();
};

// runs HTML through a headless browser with render-mathax.js
function renderMathjax() {};

// runs the export process if -t export
function taskExport(sourceFormat, exportFormat) {};

// processes images with gulp if -t images
function taskImages(book, [subdir]) {};

// refreshes the search index if -t index
function taskIndex(format) {};

// installs Ruby and Node dependencies (and may check for other application dependencies)
function taskInstall() {};

// runs the output process if -t output
function taskOutput(format) {};

// Execution
// ---------

// Store the project root location
var location = projectRoot();

// Check that the project contains required files
checkProjectSetup(argv.book);
