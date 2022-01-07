exports.command = 'export [type]'
exports.desc = 'Export to third-party format after build from template.'
exports.builder = {
  type: {
    default: 'word'
  }
}
exports.handler = function (argv) {
  console.log(`Building template with config ${argv.type}`)

  switch(argv.type) {
    case 'word':
    default:
        
        break;
  }
}