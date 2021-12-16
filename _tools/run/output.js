/*jslint node es6 */

var helpers = require('./_helpers');
var fsPath = require('path');

function pdf(argv) {
    'use strict';
    var filePath = fsPath.normalize(process.cwd() + '/_output/' + helpers.outputFilename(argv));
    helpers.jekyll(
        'build',
        helpers.configString(argv),
        argv.baseurl,
        helpers.switches(argv),
        helpers.outputPDF,
        argv
    );

    console.log('Your PDF will be saved to ' + filePath);
}

function web(argv) {
    'use strict';
    helpers.jekyll('serve', helpers.configs('_config.web.yml', argv), argv.baseurl, helpers.switches(argv));
}

// Exports

exports.command = 'output [--format=""] [--book=""]';
exports.desc = 'Generate a project or publication.';
exports.builder = {
    format: {
        default: 'web'
    },
    book: {
        default: 'book'
    }
};

exports.handler = function (argv) {
    'use strict';

    switch (argv.format) {
    case 'print-pdf':
        pdf('print-pdf', argv);
        break;
    case 'screen-pdf':
        pdf('screen-pdf', argv);
        break;
    case 'epub':
        // TO DO
        break;
    case 'app':
        // TO DO
        break;
    default:
        web('web', argv);
        break;
    }
};
