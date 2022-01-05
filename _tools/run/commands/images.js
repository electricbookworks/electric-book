/*jslint node es6 */

// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// Modules

var helpers = require('../helpers/helpers');
var spawn = require('cross-spawn');

// Exports

exports.command = 'images';
exports.desc = 'Process source images for output';
exports.handler = function (argv) {
    'use strict';

    helpers.processImages(argv);
};
