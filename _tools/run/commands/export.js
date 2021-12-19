/*jslint node es6 */

// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

// var helpers = require('../helpers/helpers');

// Functions

// Processes images with gulp if -t images
function exportWord(argv) {
    'use strict';

    // TO DO
    console.log('Export for ' + argv['export-format'] + ' coming soon.');
}


// Exports

exports.command = 'export';
exports.desc = 'Export (coming soon)';
exports.handler = function (argv) {
    'use strict';

    switch (argv['export-format']) {
    case 'word':
        exportWord(argv);
        break;
    default:
        exportWord(argv);
        break;
    }
};
