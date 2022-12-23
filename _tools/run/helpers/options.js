// Options for yargs CLI

const options = {
  help: {
    description: 'Help',
    alias: 'h',
    type: 'boolean'
  },
  format: {
    description: 'Format to output',
    alias: 'f',
    default: 'web',
    defaultDescription: 'web',
    choices: ['print-pdf', 'screen-pdf', 'web', 'epub', 'app'],
    type: 'string',
    nargs: 1
  },
  book: {
    description: 'Relevant book or assets directory',
    alias: ['b', 'folder', 'dir'],
    default: 'book',
    defaultDescription: 'book',
    type: 'string',
    implies: ['format'],
    nargs: 1
  },
  name: {
    description: 'Name of a new book',
    alias: 'n',
    default: 'new',
    defaultDescription: 'new',
    type: 'string',
    implies: ['book'],
    nargs: 1
  },
  language: {
    description: 'Translation language, e.g. fr',
    alias: 'l',
    default: '',
    defaultDescription: 'None',
    type: 'string',
    implies: ['format', 'book'],
    nargs: 1
  },
  configs: {
    description: 'Custom files in /_configs, comma-separated',
    alias: 'c',
    default: '',
    defaultDescription: 'None',
    type: 'string',
    nargs: 1
  },
  mathjax: {
    description: 'Enable MathJax',
    alias: 'm',
    default: false,
    defaultDescription: 'false',
    type: 'boolean'
  },
  baseurl: {
    description: 'A custom base URL, e.g. /books',
    alias: 'u',
    default: '',
    defaultDescription: 'None',
    type: 'string',
    nargs: 1
  },
  incremental: {
    description: "Enable Jekyll's incremental build",
    alias: 'i',
    default: false,
    defaultDescription: 'false',
    type: 'boolean'
  },
  epubcheck: {
    description: 'Local path to folder containing epubcheck.jar (UNIX only)',
    alias: 'e',
    default: '/usr/local/bin/epubcheck-4.2.6',
    defaultDescription: '/usr/local/bin/epubcheck-4.2.6',
    type: 'string',
    nargs: 1,
    normalize: true
  },
  'app-os': {
    description: 'Target app operating system',
    alias: 'o',
    default: 'android',
    defaultDescription: 'android',
    choices: ['android', 'ios', 'windows'],
    type: 'string',
    implies: ['format'],
    nargs: 1
  },
  'app-build': {
    description: 'Create app with Cordova after building HTML',
    alias: 'd',
    default: false,
    defaultDescription: 'false',
    type: 'boolean',
    implies: ['format', 'app-os']
  },
  'app-release': {
    description: 'Make the app a signed release',
    alias: 'r',
    default: false,
    defaultDescription: 'false',
    type: 'boolean',
    implies: ['format', 'app-os', 'app-build']
  },
  'app-emulate': {
    description: 'Launch app in default emulator',
    alias: 'p',
    default: false,
    defaultDescription: 'false',
    type: 'boolean',
    implies: ['format', 'app-os', 'app-build']
  },
  'export-format': {
    description: 'File format to export to',
    alias: 'x',
    default: 'word',
    defaultDescription: 'MS Word',
    choices: ['word'],
    type: 'string',
    implies: ['format'],
    nargs: 1
  },
  merged: {
    description: 'Whether to merge HTML files for PDF output',
    alias: 'j',
    default: true,
    defaultDescription: 'true',
    type: 'boolean'
  }
}

exports.options = options
