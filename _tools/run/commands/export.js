/*jslint node es6 */

// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

var helpers = require('../helpers/helpers');

// Exports

exports.command = 'export';
exports.desc = 'Export (coming soon)';
exports.handler = function (argv) {
    'use strict';

    switch (argv['export-format']) {
    case 'word':
        helpers.exportWord(argv);
        break;
    default:
        helpers.exportWord(argv);
        break;
    }
};
