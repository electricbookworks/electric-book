const { exit } = require("yargs");

const processOutput = (process, processName, callback) => {
    'use strict';

    // Listen to stdout
    process.stdout.on('data', function (data) {
        console.log('' + data);
    });

    // Listen to stderr
    process.stderr.on('data', function (data) {
        console.log('' + data);
    });

    // Listen for an error event:
    process.on('error', function (errorCode) {
        console.log('ERROR: ' + errorCode);
        if (callback) {
            callback();
        }
    });

    // Listen for an exit event:
    process.on('exit', function (exitCode) {
        console.log('EXIT: ' + exitCode);
        if (callback) {
            callback();
        }
    });
}

exports.processOutput = processOutput;