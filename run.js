// Run this at the command line with
// npm run electricbook
// for the default output, a local web server.
// Add arguments for other tasks, e.g.
// npm run electricbook -- --task=output --format=print-pdf

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
function jekyll(command, configs, baseurl) {

	// Credit: https://stackoverflow.com/a/23852347/1781075
	// var bundleExecutable = process.platform === "win32" ? "bundle.cmd" : "bundle";

	// Credit for child_process examples:
	// https://medium.com/@graeme_boy/how-to-optimize-cpu-intensive-work-in-node-js-cdc09099ed41

	// Are we killing Jekyll or starting it?
	// We have our own 'kill' Jekyll argument for this.
	// If Jekyll is running and the command is to kill, kill the process.
	// NOTE: I'm not sure we need this.
	if (jekyllProcess && command == 'kill') {
		jekyllProcess.kill();
	} else {
		// Create a child process
		var jekyllProcess = spawn('bundle exec jekyll ' + command + ' ' + configs + ' ' + baseurl);

		// Listen to Jekyll's stdout
		jekyllProcess.stdout.on('data', 
		    function (data) {
		        console.log('Jekyll output: ' + data);
		    }
		);

		// Listen to Jekyll's stderr
		jekyllProcess.stderr.on('data',
		    function (data) {
		        console.log('Jekyll error: ' + data);
		    }
		);

		// Listen for an exit event:
		jekyllProcess.on('exit', function (exitCode) {
		    console.log('Jekyll exited with code: ' + exitCode);
		});
		
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
if (argv.task == 'check') {
	checkProjectSetup(argv.book);
}

// Output a project or a book
if (argv.task == 'output') {
	// Serve Jekyll as a site
	if (argv.format == 'web') {
		jekyll('serve', argv.configs, argv.baseurl)
	}
	// To do: output print-pdf, screen-pdf, epub, app
}
