const spawn = require('cross-spawn'); // for spawning child processes like Jekyll across platforms
const mergeYaml = require('merge-yaml');

const { processOutput } = require('./_helpers.js');

exports.command = 'server [folder]'
exports.desc = 'Serve HTML built from template and reload on file change.'
exports.builder = {
  folder: {
    default: 'book'
  },
  host: {
    default: '0.0.0.0'
  },
  port: {
    default: '8000'
  },
}
exports.handler = function (argv) {
  console.log(`Starting development server from source folder '${argv.folder}'\n`)

  let configs = ['_config.yml', '_configs/_config.web.yml'];

  context = mergeYaml(configs);

  var proc = spawn(
      'bundle',
      [
        'exec', 'jekyll', 'serve', 
        '--incremental',
        '--config', configs.join(','),
        '--baseurl', `/${argv.folder}`, 
        '--host', argv.host, 
        '--port', argv.port,
      ]
  );

  processOutput(proc);
}