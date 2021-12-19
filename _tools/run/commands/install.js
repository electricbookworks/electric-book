/*jslint node es6 */

// For more on yargs command modules like this one, see
// https://github.com/yargs/yargs/blob/main/docs/advanced.md#providing-a-command-module

// TO DO: add checks for other Electric Book dependencies.

// Modules

var helpers = require('../helpers/helpers');
var spawn = require('cross-spawn');

// Functions

// Install Node dependencies
function installNodeModules() {
    'use strict';

    console.log(
        'Running npm to install Node modules...\n' +
        'If you get errors, check that Node.js is installed \n' +
        'and up to date (https://nodejs.org). \n'
    );
    var npmProcess = spawn(
        'npm',
        ['install']
    );
    helpers.logProcess(npmProcess, 'Installing Node modules');
}

// Install Ruby dependencies
function installGems() {
    'use strict';

    console.log(
        'Running Bundler to install Ruby gem dependencies...\n' +
        'If you get errors, check that Bundler is installed \n' +
        'and up to date (https://bundler.io). \n'
    );
    var bundleProcess = spawn(
        'bundle',
        ['install']
    );
    helpers.logProcess(bundleProcess, 'Installing Ruby gems');
}

// Exports

exports.command = 'install';
exports.desc = 'Install or update dependencies';
exports.handler = function () {
    'use strict';

    installGems();
    installNodeModules();
};
