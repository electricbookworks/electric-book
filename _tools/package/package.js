/*jslint node */
/*globals */

var fs = require('fs');
var path = require('path');
var createReadStream = require('fs').createReadStream;
var createInterface = require('readline').createInterface;
var once = require('events').once;
var JSZip = require('jszip');

// Rudimentary way to get a files list synchronously
var filesReady = false;

// Thanks https://github.com/lostandfound/epub-zip
// for the initial idea for this.
// Note that we use path.posix (not just path)
// to always get forward slashes in paths
// generated on Windows machines.
function getFiles(root, files, base) {
    'use strict';

    base = base || '';
    files = files || [];
    var directory = path.posix.join(root, base);

    // Files and folders to skip in regex format.
    // Start with commented lines, .git and any other paths to skip entirely...
    var pathsToSkip = ['.git', '_output'];

    // ... then add all paths from .gitignore
    // (https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line)
    (async function readGitignore() {
        try {
            const readlineInterface = createInterface({
            input: createReadStream('.gitignore'),
            crlfDelay: Infinity
        });

        readlineInterface.on('line', (line) => {
            // Remove trailing wildcards and trailing slashes,
            line = line.replace(/\*.*/, '');
            line = line.replace(/\/$/, '');
            // and skip blank lines and lines that start with #
            if (line.length > 0 && !line.startsWith('#')) {
                pathsToSkip.push(line);
            }
        });

        await once(readlineInterface, 'close');

        } catch (err) {
            console.error(err);
        }

        if (fs.lstatSync(directory).isDirectory()) {
            if (pathsToSkip.includes(directory)) {
                // console.log('Skipping ' + directory);
            } else {
                fs.readdirSync(directory)
                    .forEach(function (directoryEntry) {
                        // console.log('Reading ' + directory + '...' + directoryEntry);
                        getFiles(root, files, path.posix.join(base, directoryEntry));
                    });
            }
        } else {
            if (pathsToSkip.includes(base)) {
                // console.log('Skipping ' + base);
            } else {
                files.push(base);
            }
        }
        filesReady = true;
    })();
    return files;
}

module.exports = async function (repoDirectory) {
    'use strict';

    // Check if the directory exists
    if (!repoDirectory) {
        throw new Error('Sorry, could not find ' + repoDirectory + '.');
    }

    // Get the root directory's name for the zip filename
    var zipFileName = process.cwd().replace(/^.*[\\\/]/, '');

    // Feedback
    console.log('Packaging ' + zipFileName + ' as ' + zipFileName + '.zip');

    // Create a new instance of JSZip
    var zip = new JSZip();

    // Get the files to zip
    var files = getFiles(repoDirectory);

    var checkingForFilesReady = setInterval(function() {
        if (filesReady === true) {
            // Add all the files
            files.forEach(function (file) {
                // console.log('Adding ' + file + ' to zip.');
                zip.file(file, fs.readFileSync(path.posix.join(repoDirectory, file)), {compression: "DEFLATE"});
            });

            // Create an _output folder. We ignored it earlier to avoid
            // including its contents, but we do want one in the package.
            // Include a .gitignore file as in the template.
            zip.folder('_output')
                    .file('.gitignore', '# Ignore everything in this directory\n*\n# Except this file\n!.gitignore\n');

            // Write the zip file to disk
            zip
                .generateNodeStream({type: 'nodebuffer', streamFiles: true})
                .pipe(fs.createWriteStream('_output/' + zipFileName + '.zip'))
                .on('finish', function () {
                    // JSZip generates a readable stream with a "end" event,
                    // but is piped here in a writable stream which emits a "finish" event.
                    console.log(zipFileName + '.zip saved to _output.');
                });
            clearInterval(checkingForFilesReady);
        } else {
            console.log('Waiting for file list...');
        }
    }, 3000);
};

// Make this runnable from the command line
// https://www.npmjs.com/package/make-runnable
// This must be at the end of the file.
require('make-runnable/custom')({
    printOutputFrame: false
});
