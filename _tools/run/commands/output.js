/*jslint node es6 */

// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

var helpers = require('../helpers/helpers');

// Functions

function pdf(argv) {
    'use strict';
    helpers.jekyll(
        'build',
        helpers.configString(argv),
        argv.baseurl,
        helpers.switches(argv),
        helpers.outputPDF,
        argv
    );
}

function web(argv) {
    'use strict';
    helpers.jekyll(
        'serve',
        helpers.configString(argv),
        argv.baseurl,
        helpers.switches(argv)
    );
}

function epub(argv) {
    'use strict';
    helpers.jekyll(
        'build',
        helpers.configString(argv),
        argv.baseurl,
        helpers.switches(argv),
        helpers.outputEpub,
        argv
    );
}

// Exports

exports.command = 'output';
exports.desc = 'Generate a project or publication';
exports.handler = function (argv) {
    'use strict';

    switch (argv.format) {
    case 'print-pdf':
    case 'screen-pdf':
        pdf(argv);
        break;
    case 'epub':
        epub(argv);
        break;
    case 'app':
        // TO DO
        break;
    default:
        web(argv);
        break;
    }
};
