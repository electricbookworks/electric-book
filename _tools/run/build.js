exports.command = 'build [type] [folder]'
exports.desc = 'Build from template'
exports.builder = {
  type: {
    default: 'html'
  },
  folder: {
    default: 'book'
  }
}
exports.handler = function (argv) {
  console.log(`Building template with config '${argv.type}' from source '${argv.folder}'`)

  switch(argv.type) {
    case 'print-pdf':
        //background green
        break;
    case 'screen-pdf':
        //background yellow
        break;
    case 'epub':
        //background red
        break;
    case 'app':
        //background red
        break;
    default:
        //background grey
        break;
  }
}