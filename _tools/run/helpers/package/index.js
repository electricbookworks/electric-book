const fs = require('fs')
const fsPath = require('path')
const createReadStream = require('fs').createReadStream
const createInterface = require('readline').createInterface
const once = require('events').once
const JSZip = require('jszip')

// Files and folders to skip in regex format.
// We'll extend this array below.
const repoDirectory = fsPath.normalize(process.cwd())
const pathsToSkip = [
  fsPath.normalize(repoDirectory + '/.git'),
  fsPath.normalize(repoDirectory + '/_output'),
  fsPath.normalize(repoDirectory + '/node-modules)')
]

// Files to zip
const files = []

// Add all paths from .gitignore to pathsToSkip
// (https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line)
async function readGitignore () {
  try {
    const readlineInterface = createInterface({
      input: createReadStream('.gitignore'),
      crlfDelay: Infinity
    })

    readlineInterface.on('line', line => {
      // Remove trailing wildcards and trailing slashes,
      line = line.replace(/\*.*/, '')
      line = line.replace(/\/$/, '')
      // and skip blank lines and lines that start with #
      if (line.length > 0 && !line.startsWith('#')) {
        pathsToSkip.push(fsPath.normalize(repoDirectory + '/' + line))
      }
    })

    await once(readlineInterface, 'close')
    return pathsToSkip
  } catch (err) {
    console.error(err)
  }
}

// Thanks https://github.com/lostandfound/epub-zip
// for the initial idea for this.
async function getFiles (root, base) {
  'use strict'

  base = base || ''
  const directory = fsPath.normalize(fsPath.join(root, base))

  if (fs.lstatSync(directory).isDirectory()) {
    if (pathsToSkip.includes(directory)) {
      // console.log('Skipping ' + directory)
    } else {
      fs.readdirSync(directory)
        .forEach(function (directoryEntry) {
          // console.log('Reading ' + directory + '...' + directoryEntry)
          getFiles(root, fsPath.normalize(fsPath.join(base, directoryEntry)))
        })
    }
  } else {
    if (pathsToSkip.includes(base)) {
      // console.log('Skipping ' + base);
    } else {
      files.push(base)
    }
  }

  return files
}

async function packageProject () {
  'use strict'

  // Get the root directory's name for the zip filename
  const zipFileName = process.cwd().replace(/^.*[\\/]/, '')

  // Feedback
  console.log('Packaging ' + zipFileName + ' as ' + zipFileName + '.zip')

  // Create a new instance of JSZip
  const zip = new JSZip()

  // Get the files to zip
  await readGitignore()
  await getFiles(repoDirectory)

  // Add all the files
  files.forEach(function (file) {
    // console.log('Adding ' + file + ' to zip.');
    zip.file(file, fs.readFileSync(fsPath.normalize(fsPath.join(repoDirectory, file))), { compression: 'DEFLATE' })
  })

  // Create an _output folder. We ignored it earlier to avoid
  // including its contents, but we do want one in the package.
  // Include a .gitignore file as in the template.
  zip.folder('_output')
    .file('.gitignore', '# Ignore everything in this directory\n*\n# Except this file\n!.gitignore\n')

  // Write the zip file to disk
  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream('_output/' + zipFileName + '.zip'))
    .on('finish', function () {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log(zipFileName + '.zip saved to _output.')
    })
}

module.exports = packageProject
