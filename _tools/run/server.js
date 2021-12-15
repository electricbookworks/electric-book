const spawn = require('cross-spawn'); // for spawning child processes like Jekyll across platforms
const mergeYaml = require('merge-yaml');
const { boolean } = require('yargs');

const { processOutput } = require('./_helpers.js');

exports.command = 'server [folder] [host] [--port]'
exports.desc = 'Serve HTML built from template and reload on file change.'
exports.builder = {
  folder: {
    alias: 'f',
    type: 'string',
    default: 'book'
  },
  host: {
    alias: 'h',
    type: 'string',
    default: '0.0.0.0'
  },
  port: {
    alias: 'p',
    type: 'string',
    default: '8000'
  },
  incremental: {
    alias: 'i',
    type: 'boolean',
  },
  watch: {
    alias: 'w',
    type: 'boolean',
  },
}
exports.handler = function (argv) {
  console.log(`Starting development server from source folder '${argv.folder}'\n`)

  let configs = ['_config.yml', '_configs/_config.web.yml'];

  context = mergeYaml(configs);

  var args = [
    'exec', 'jekyll', 'serve',
    '--config', configs.join(','),
    '--baseurl', `/${argv.folder}`,
    '--host', argv.host,
    '--port', argv.port,
  ]

  if (argv.incremental) {
    args.push("--incremental")
  }

  if (argv.watch) {
    args.push("--watch")
  }

  let proc = spawn('bundle', args);

  processOutput(proc);
}