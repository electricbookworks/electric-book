#!/usr/bin/env node
const chalk = require('chalk');
const figlet = require('figlet');

console.log(chalk.red(figlet.textSync('Electric Book')));

const argv = require('yargs/yargs')(process.argv.slice(2))
    .commandDir('./')
    .demandCommand()
    .wrap(100)
    .help()
    .argv;
