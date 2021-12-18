/*jslint node es6 */

// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

var helpers = require('../helpers/helpers');

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

// Exports

exports.command = 'output [--format=""] [--book=""] [...]';
exports.desc = 'Generate a project or publication';
exports.handler = function (argv) {
    'use strict';

    switch (argv.format) {
    case 'print-pdf':
    case 'screen-pdf':
        pdf(argv);
        break;
    case 'epub':
        // TO DO
        break;
    case 'app':
        // TO DO
        break;
    default:
        web(argv);
        break;
    }
};
