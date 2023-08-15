// Lint with JS Standard

// Import Node modules
const fs = require('fs-extra') // beyond normal fs, for working with the file-system
const fsPath = require('path') // Node's path tool, e.g. for normalizing paths cross-platform
const fsPromises = require('fs/promises') // Promise-based Node fs
const spawn = require('cross-spawn') // for spawning child processes like Jekyll across platforms
const open = require('open') // opens files in user's preferred app
const prince = require('prince') // installs and runs PrinceXML
const yaml = require('js-yaml') // reads YAML files into JS objects
const concatenate = require('concatenate') // concatenates files
const epubchecker = require('epubchecker') // checks epubs for validity
const pandoc = require('node-pandoc') // for converting files, e.g. html to word
const which = require('which') // finds installed executables
const childProcess = require('child_process') // creates child processes
const JSZip = require('jszip') // epub-friendly zip utility
const buildReferenceIndex = require('./reindex/build-reference-index.js')
const buildSearchIndex = require('./reindex/build-search-index.js')
const options = require('./options.js').options

// Output spawned-process data to console
function logProcess (process, processName) {
  'use strict'

  return new Promise(function (resolve, reject) {
    processName = processName || 'Process: '

    // Listen to stdout
    process.stdout.on('data', function (data) {
      console.log(processName + ': ' + data)
    })

    // Listen to stderr
    process.stderr.on('data', function (data) {
      console.log(processName + ': ' + data)
    })

    // Listen for an error event:
    process.on('error', function (error) {
      // console.log(processName + ' errored with: ' + error.message)
      reject(error.message)
    })

    // Listen for an exit event:
    process.on('close', function (exitCode) {
      // console.log(processName + ' exited with: ' + exitCode)
      if (exitCode !== 0) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

// Returns a filename for the output file
function outputFilename (argv) {
  'use strict'

  let filename
  let fileExtension = '.pdf'
  if (argv.format === 'epub') {
    fileExtension = '.epub'
  }

  if (argv.language) {
    filename = argv.book + '-' + argv.language + '-' + argv.format + fileExtension
  } else {
    filename = argv.book + '-' + argv.format + fileExtension
  }

  return filename
}

// Check if a user passed an explicit option in argv
// (i.e. yargs is not just using the default in options.js)
function explicitOption (option) {
  'use strict'

  // Default is that option was not passed explicitly
  let optionWasExplicit = false

  // Get all the aliases for this option
  const aliases = options[option].alias

  // Add the default option to that array
  aliases.push(option)

  // Check if any of those aliases were in the args
  aliases.forEach(function (alias) {
    // process.argv includes various strings in an array,
    // including the options we want to examine.
    // Those options have the original leading hyphens
    // as they were passed at the command line.
    // So we create a new array containing only the strings
    // in process.argv that start with hyphens,
    // and then we strip those hyphens.
    const optionsInProcessArgv = []
    process.argv.forEach(function (argument) {
      if (argument.match(/^-+/)) {
        const argumentWithoutHyphens = argument.replace(/^-+/, '')
        optionsInProcessArgv.push(argumentWithoutHyphens)
      }
    })

    // Now, is this alias among the options
    // that were explicitly passed at the command line?
    if (optionsInProcessArgv.includes(alias)) {
      optionWasExplicit = true
    }
  })

  return optionWasExplicit
}

// Checks if a file or folder exists
function pathExists (path) {
  'use strict'

  try {
    if (fs.existsSync(fsPath.normalize(path))) {
      return true
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

// Opens the output file. Accepts argv or a filepath.
function openOutputFile (argvOrFilePath) {
  'use strict'

  // If no filepath is provided, assume we're opening
  // the book file we've just generated.
  let filePath
  if (argvOrFilePath.book) {
    filePath = fsPath.normalize(process.cwd() +
                '/_output/' +
                outputFilename(argvOrFilePath))
    console.log('Your ' + argvOrFilePath.format + ' is at ' + filePath)
  } else {
    filePath = argvOrFilePath
  }
  console.log('Opening ' + filePath)
  open(fsPath.normalize(filePath))
}

// Return a string of Jekyll config files.
// The filenames passed must be of files
// already saved in the _configs directory.
// They will be added after the default _config.yml.
function configString (argv) {
  'use strict'

  // Start with default config
  let string = '_config.yml'

  // Add format config, if any
  if (argv.format) {
    string += ',_configs/_config.' + argv.format + '.yml'
  }

  // Add any configs passed as argv's
  if (argv.configs) {
    console.log('Adding ' + argv.configs + ' to configs...')
    // Strip quotes that might have been added around arguments by user
    string += ',_configs/' + argv.configs.replace(/'/g, '').replace(/"/g, '')
  }

  // Add MathJax config if --mathjax=true
  if (argv.mathjax) {
    string += ',_configs/_config.mathjax-enabled.yml'
  }

  // Turn Mathjax off if we're exporting to Word.
  // We want raw editable TeX in Word docs.
  if (argv._[0] === 'export' && argv['export-format'] === 'word') {
    string += ',_configs/_config.math-disabled.yml'
  }

  // Add docx config if we're exporting to Word.
  if (argv._[0] === 'export' && argv['export-format'] === 'word') {
    string += ',_configs/_config.docx.yml'
  }

  return string
}

// Return array of switches for Jekyll
function jekyllSwitches (argv) {
  'use strict'

  const switchesArray = []

  // Add incremental switch if --incremental=true
  if (argv.incremental) {
    switchesArray.push('--incremental')
  }

  // Add switches passed as a --switches="" argv
  if (argv.switches) {
    let switchesString = ''

    // Strip quotes that might have been added around arguments by user
    switchesString = argv.switches.replace(/'/g, '').replace(/"/g, '')

    // Replace spaces with commans, then split the string into an array,
    // and loop through the array adding each string to switchesArray.
    const switchesStringAsArray = switchesString.replace(/\s/g, ',').split(',')
    switchesStringAsArray.forEach(function (switchString) {
      switchesArray.push(switchString)
    })
  }

  return switchesArray
}

// Run Jekyll
async function jekyll (argv) {
  'use strict'

  // Use 'build' unless we're starting a webserver
  let command = 'build'
  if (argv.format === 'web' && argv._[0] === 'output') {
    command = 'serve'
  }

  // Get the baseurl from Jekyll config, unless
  // it's been overridden by one set in
  // a --baseurl command-line argument
  let baseurl = ''
  if (configsObject(argv).baseurl) {
    baseurl = configsObject(argv).baseurl
  }
  if (argv.baseurl) {
    baseurl = argv.baseurl
  }

  // Ensure baseurl string starts with a slash
  if (baseurl !== '' && baseurl.indexOf('/') !== 0) {
    baseurl = '/' + baseurl
  }

  // Build the string of config files.
  // We need the configs string passed to argv
  // plus any auto-generated excludes config
  let configs = configString(argv)
  const extraConfigs = await extraExcludesConfig(argv)
  if (extraConfigs) {
    configs += ',' + extraConfigs
  }

  try {
    console.log('Running Jekyll with command: ' +
              'bundle exec jekyll ' + command +
              ' --config="' + configString(argv) + '"' +
              ' --baseurl="' + baseurl + '"' +
              ' ' + jekyllSwitches(argv).join(' '))

    // Create an array of arguments to pass to spawn()
    const jekyllSpawnArgs = ['exec', 'jekyll', command,
      '--config', configs,
      '--baseurl', baseurl]

    // Add each of the switches to the args array
    jekyllSwitches(argv).forEach(function (switchString) {
      jekyllSpawnArgs.push(switchString)
    })

    // Create a child process
    const jekyllProcess = spawn('bundle', jekyllSpawnArgs)
    const result = await logProcess(jekyllProcess, 'Jekyll')

    // If Jekyll fails (i.e. exit code 1), kill this process.
    // We don't want to try to render a PDF if Jekyll didn't build.
    if (result === 1) {
      console.log('Jekyll could not complete its build. Exiting.')
      process.exit()
    }
    return result
  } catch (error) {
    console.log(error)
  }
}

// Jekyll configs as JS object. Note:
// This includes duplicate keys where concatenated
// config files have the same keys. That's not
// valid YAML, but it's okay in JSON, where
// the last value overrides earlier ones.
function configsObject (argv) {
  'use strict'

  // Create an array of paths to the config files
  const configFiles = configString(argv).split(',')
  configFiles.map(function (file) {
    return fsPath.normalize(file)
  })

  // Combine them and load them as a JSON array
  const concatenated = concatenate.sync(configFiles)
  const json = yaml.loadAll(concatenated, { json: true })

  // Return the first object of the first object of the array
  return json[0]
}

// Config to exclude unnecessary books from Jekyll build
async function extraExcludesConfig (argv) {
  'use strict'

  // Default is an empty config file, for no excludes.
  // Create it and/or make it an empty file.
  const pathToTempExcludesConfig = '_output/.temp/_config.excludes.yml'
  await fsPromises.mkdir('_output/.temp', { recursive: true })
  await fsPromises.writeFile(pathToTempExcludesConfig, '')

  // If we're outputting a particular book/work,
  // and the user explicitly asked for that book
  // (as opposed to omitting --book and using defaults),
  // exclude any other works in this project
  // by adding them to a Jekyll `exclude` config.
  if (argv.book && explicitOption('book')) {
    // Get all the works but leave out the argv.book we want
    const worksToExclude = works().filter(function (work) {
      return work !== argv.book
    })

    // Get the current excludes list
    const excludes = configsObject(argv).exclude

    // Add the works we're not outputting to it
    const newExcludes = excludes.concat(worksToExclude)

    // That's only the list of values. To create a valid
    // key:value property, we need the `excludes:` key.
    const excludesProperty = {
      exclude: newExcludes
    }

    // Write the new excludes config as a YAML file
    const excludesYAML = yaml.dump(excludesProperty)
    await fsPromises.writeFile(pathToTempExcludesConfig, excludesYAML)
  }

  // Return the path to the new excludes config
  return pathToTempExcludesConfig
}

// Run Cordova with args.
// - args is an array of arguments
// - cordovaWorkingDirectory is the directory in which
//   cordova must run, e.g. _site/app
async function cordova (args, cordovaWorkingDirectory) {
  'use strict'

  // Create a default/fallback working directory
  if (!cordovaWorkingDirectory) {
    cordovaWorkingDirectory = fsPath.normalize(process.cwd() + '/_site/app')
  }

  try {
    console.log('Running Cordova with ' + JSON.stringify(args) +
      ' from\n' + cordovaWorkingDirectory)

    const cordovaProcess = spawn('cordova', args, { cwd: cordovaWorkingDirectory })
    const result = await logProcess(cordovaProcess, 'Cordova')
    return result
  } catch (error) {
    console.log(error)
  }
}

// Assemble app files
async function assembleApp () {
  'use strict'

  // Move everything in the _site folder to _site/app
  // except, of course, _site/app itself.

  const source = fsPath.normalize(process.cwd() + '/_site')
  const destination = fsPath.normalize(process.cwd() + '/_site/app/www')

  const pathsInSource = await fsPromises.readdir(source, { withFileTypes: true })

  pathsInSource.forEach(function (entry) {
    if (entry.name !== 'app') {
      fs.moveSync(source + fsPath.sep + entry.name, destination + fsPath.sep + entry.name)
    }
  })
}

// Check if MathJax is enabled in config or CLI arguments
function mathjaxEnabled (argv) {
  'use strict'

  // Check if Mathjax is enabled in Jekyll config
  const mathjaxConfig = configsObject(argv)['mathjax-enabled']

  // Is mathjax on either in config
  // or activated by argv option?
  let mathJaxOn = false
  if (argv.mathjax || mathjaxConfig === true) {
    mathJaxOn = true
  }

  return mathJaxOn
}

// Processes mathjax in output HTML
async function renderMathjax (argv) {
  'use strict'

  try {
    if (mathjaxEnabled(argv) || argv.mathjax) {
      console.log('Rendering MathJax...')

      // Get the HTML file(s) to render. If we are merging
      // input files, we only pass the merged file,
      // Unless `--merged false` was passed at the command line.
      let inputFiles = [fsPath.dirname(htmlFilePaths(argv)[0]) + '/merged.html']
      if (argv.merged === false || ['web', 'epub', 'app'].includes(argv.format)) {
        inputFiles = htmlFilePaths(argv)
      }

      // Get the MathJax script
      const mathJaxScript = process.cwd() +
      '/_tools/run/helpers/mathjax/tex2mml-page.js'

      // Process MathJax
      let mathJaxProcess
      inputFiles.forEach(function (path) {
        mathJaxProcess = spawn(
          'node',
          ['-r', 'esm', mathJaxScript, path, path, argv.format]
        )
      })
      await logProcess(mathJaxProcess, 'Rendering MathJax')
      return true
    } else {
      return true
    }
  } catch (error) {
    console.log(error)
  }
}

// Processes index comments as targets in output HTML
async function renderIndexComments (argv) {
  'use strict'

  if (projectSettings()['dynamic-indexing'] !== false) {
    console.log('Processing indexing comments ...')

    try {
      let indexCommentsProcess
      if (argv.language) {
        indexCommentsProcess = spawn(
          'gulp',
          ['renderIndexCommentsAsTargets',
            '--book', argv.book,
            '--language', argv.language]
        )
      } else {
        indexCommentsProcess = spawn(
          'gulp',
          ['renderIndexCommentsAsTargets', '--book', argv.book]
        )
      }
      await logProcess(indexCommentsProcess, 'Index comments')
      return true
    } catch (error) {
      console.log(error)
    }
  }
}

// Processes index-list items as linked references in output HTML
async function renderIndexLinks (argv) {
  'use strict'

  if (projectSettings()['dynamic-indexing'] !== false) {
    console.log('Adding links to reference indexes ...')

    try {
      let indexLinksProcess
      if (argv.language) {
        indexLinksProcess = spawn(
          'gulp',
          ['renderIndexListReferences',
            '--book', argv.book,
            '--language', argv.language,
            '--format', argv.format]
        )
      } else {
        indexLinksProcess = spawn(
          'gulp',
          ['renderIndexListReferences',
            '--book', argv.book,
            '--format', argv.format]
        )
      }
      await logProcess(indexLinksProcess, 'Index links')
      return true
    } catch (error) {
      console.log(error)
    }
  }
}

// Converts paths in links from *.html to *.xhtml
async function convertXHTMLLinks (argv) {
  'use strict'
  console.log('Converting links from .html to .xhtml ...')

  try {
    let convertXHTMLLinksProcess
    if (argv.language) {
      convertXHTMLLinksProcess = spawn(
        'gulp',
        ['epubXhtmlLinks',
          '--book', argv.book,
          '--language', argv.language]
      )
    } else {
      convertXHTMLLinksProcess = spawn(
        'gulp',
        ['epubXhtmlLinks', '--book', argv.book]
      )
    }
    await logProcess(convertXHTMLLinksProcess, 'XHTML links')
    return true
  } catch (error) {
    console.log(error)
  }
}

// Run HTML transformations on elements in epubs
async function epubHTMLTransformations (argv) {
  'use strict'
  console.log('Adding ARIA roles ...')

  try {
    let epubHTMLTransformationsProcess
    if (argv.language) {
      epubHTMLTransformationsProcess = spawn(
        'gulp',
        ['runEpubTransformations',
          '--book', argv.book,
          '--language', argv.language]
      )
    } else {
      epubHTMLTransformationsProcess = spawn(
        'gulp',
        ['runEpubTransformations', '--book', argv.book]
      )
    }
    await logProcess(epubHTMLTransformationsProcess, 'Sidenotes ARIA role')
    return true
  } catch (error) {
    console.log(error)
  }
}

// Converts .html files to .xhtml, e.g. for epub output
async function convertXHTMLFiles (argv) {
  'use strict'
  console.log('Renaming files from .html to .xhtml ...')

  try {
    let convertXHTMLFilesProcess
    if (argv.language) {
      convertXHTMLFilesProcess = spawn(
        'gulp',
        ['epubXhtmlFiles',
          '--book', argv.book,
          '--language', argv.language]
      )
    } else {
      convertXHTMLFilesProcess = spawn(
        'gulp',
        ['epubXhtmlFiles', '--book', argv.book]
      )
    }
    await logProcess(convertXHTMLFilesProcess, 'XHTML files')
    return true
  } catch (error) {
    console.log(error)
  }
}

// Get project settings from settings.yml
function projectSettings () {
  'use strict'
  let settings
  try {
    settings = yaml.load(fs.readFileSync('./_data/settings.yml', 'utf8'))
  } catch (error) {
    console.log(error)
  }
  return settings
}

// Get variant settings
function variantSettings (argv) {
  // Create an object for default settings
  const settings = {
    active: false,
    stylesheet: argv.format + '.css'
  }

  // Check the project settings for an active variant.
  if (projectSettings() &&
      projectSettings()['active-variant'] &&
      projectSettings()['active-variant'] !== '') {
    settings.active = projectSettings()['active-variant']
  }

  // Check for the variant-specific stylesheet we should use.
  if (settings.active && projectSettings().variants) {
    // Loop through the variants in project settings
    // to find the active variant. Then return
    // the format-specific stylesheet name there.
    projectSettings().variants.forEach(function (variantEntry) {
      if (variantEntry.variant === projectSettings()['active-variant'] &&
          variantEntry[argv.format + '-stylesheet'] &&
          variantEntry[argv.format + '-stylesheet'] !== '') {
        settings.stylesheet = variantEntry[argv.format + '-stylesheet']
      }
    })
  }

  return settings
}

// Get the filelist for a format
function fileList (argv) {
  'use strict'

  let format
  if (argv.format) {
    format = argv.format
  } else {
    format = 'print-pdf' // fallback
  }

  // Check for variant-edition output
  const variant = variantSettings(argv).active

  let book = 'book' // default
  if (argv.book) {
    book = argv.book
  }

  // Build path to YAML data for this book
  const pathToYAMLFolder = process.cwd() +
            '/_data/works/' +
            book + '/'

  // Build path to default-edition YAML
  const pathToDefaultYAML = fsPath.normalize(pathToYAMLFolder + 'default.yml')

  // Get the files list
  const metadata = yaml.load(fs.readFileSync(pathToDefaultYAML, 'utf8'))

  let files
  if (metadata.products[format] && metadata.products[format].files) {
    files = metadata.products[format].files
  } else {
    files = metadata.products['print-pdf'].files
  }

  // If there was no files list, oops!
  if (!files) {
    console.log('No files list in book data. Using raw files in ' + book + '.')

    // Let's just use all the markdown files for this book
    const bookDirectory = fsPath.normalize(process.cwd() + '/' + book + '/')
    files = []

    // Read the contents of the book directory.
    // For each file in there, if it ends with .md,
    // add its name, without the .md, to the files array.
    if (fs.lstatSync(bookDirectory).isDirectory()) {
      fs.readdirSync(bookDirectory)
        .forEach(function (file) {
          if (file.match(/\.md$/g)) {
            const fileBasename = file.replace(/\.md$/g, '')
            files.push(fileBasename)
          }
        })

      // If there is an index.md, move it to the front
      // (https://stackoverflow.com/a/48456512/1781075),
      // unless there is a cover file, in which case omit index.md.

      // Determine if there is a cover file.
      // This depends on the only word in the filename being 'cover',
      // e.g. 0-0-cover.html, cover.html. But not 'my-cover.html',
      // 'cover-page.html' or 'cover-versions-of-songs.html'.
      let coverFile = false
      files.forEach(function (filename) {
        // Remove all non-alphabetical-characters
        const filenameWordsOnly = filename.replace(/[^a-zA-Z]/g, '')

        // Is what remains the word 'cover'?
        if (filenameWordsOnly === 'cover') {
          coverFile = filename
          const indexOfCoverFile = files.findIndex(function (filename) {
            return filename === coverFile
          })

          // Move it to the front of the array:
          // remove it first...
          files.splice(indexOfCoverFile, 1)

          // ... then insert it unless this is a print PDF
          if (argv.format !== 'print-pdf') {
            files.unshift(coverFile)
          }
        }
      })

      if (files.includes('index')) {
        const indexOfIndexFile = files.findIndex(function (filename) {
          return filename === 'index'
        })

        // Remove 'index' from array
        files.splice(indexOfIndexFile, 1)

        // If no cover file, insert 'index' at start of array
        // unless this is a print PDF
        if (coverFile === false && argv.format !== 'print-pdf') {
          files.unshift('index')
        }
      }
    } else {
      // Otherwise, return an empty array
      console.log('Sorry, couldn\'t find files or a files list in book data.')
      return []
    }
  }

  // Build path to translation's default YAML,
  // if a language has been specified.
  let pathToTranslationYAMLFolder,
    pathToDefaultTranslationYAML
  if (argv.language) {
    pathToTranslationYAMLFolder = pathToYAMLFolder + argv.language + '/'
    pathToDefaultTranslationYAML = pathToTranslationYAMLFolder + 'default.yml'

    // If the translation has this format among its products,
    // and that format has a files list, use that list.
    if (pathToDefaultTranslationYAML &&
                pathExists(pathToDefaultTranslationYAML)) {
      const translationMetadata = yaml.load(fs.readFileSync(pathToDefaultTranslationYAML, 'utf8'))
      if (translationMetadata &&
                    translationMetadata.products &&
                    translationMetadata.products[format] &&
                    translationMetadata.products[format].files) {
        files = translationMetadata.products[format].files
      }
    }
  }

  // Build path to variant-edition YAML,
  // if there is an active variant in settings.
  let pathToVariantYAML = false

  // If there's a variant and this is a translation ...
  if (argv.language && variant) {
    pathToVariantYAML = pathToTranslationYAMLFolder + variant + '.yml'

    // ... otherwise just get the parent language variant path
  } else if (variant) {
    pathToVariantYAML = pathToYAMLFolder + variant + '.yml'
  }

  // If we have a path, and there's a files list there,
  // use that as the files list.
  if (pathToVariantYAML &&
            pathExists(pathToVariantYAML)) {
    const variantMetadata = yaml.load(fs.readFileSync(pathToVariantYAML, 'utf8'))
    if (variantMetadata &&
                variantMetadata.products &&
                variantMetadata.products[format] &&
                variantMetadata.products[format].files) {
      files = variantMetadata.products[format].files
    }
  }
  // Note that files may be objects, not strings,
  // e.g. { "01": "Chapter 1"}
  return files
}

// Get array of HTML-file paths for this output
function htmlFilePaths (argv, extension) {
  'use strict'

  const fileNames = fileList(argv)

  if (!extension) {
    extension = '.html'
  }

  // Provide fallback book
  let book
  if (argv.book) {
    book = argv.book
  } else {
    book = 'book'
  }

  let pathToFiles
  if (argv.language) {
    pathToFiles = process.cwd() + '/' +
                '_site/' +
                book + '/' +
                argv.language
  } else {
    pathToFiles = process.cwd() + '/' +
                '_site/' +
                book
  }
  pathToFiles = fsPath.normalize(pathToFiles)

  console.log('Using files in ' + pathToFiles)

  // Extract filenames from file objects,
  // and prepend path to each filename.
  const paths = fileNames.map(function (filename) {
    if (typeof filename === 'object') {
      return fsPath.normalize(pathToFiles + '/' +
                    Object.keys(filename)[0] + extension)
    } else {
      return fsPath.normalize(pathToFiles + '/' +
                    filename + extension)
    }
  })

  return paths
}

// Cleans out old .html files after .xhtml conversions
async function cleanHTMLFiles (argv) {
  'use strict'
  console.log('Cleaning out old .html files ...')

  try {
    let cleanHTMLFilesProcess
    if (argv.language) {
      cleanHTMLFilesProcess = spawn(
        'gulp',
        ['epubCleanHtmlFiles',
          '--book', argv.book,
          '--language', argv.language]
      )
    } else {
      cleanHTMLFilesProcess = spawn(
        'gulp',
        ['epubCleanHtmlFiles', '--book', argv.book]
      )
    }
    await logProcess(cleanHTMLFilesProcess, 'Clean HTML files')
    return true
  } catch (error) {
    console.log(error)
  }
}

// Check Prince version
function checkPrinceVersion () {
  'use strict'

  return new Promise(function (resolve, reject) {
    // Get globally installed Prince version, if any
    const installedPrince = function () {
      return new Promise(function (resolve, reject) {
        // Check local node_modules for Prince binary ...
        if (prince().config.binary.includes('node_modules')) {
          childProcess.execFile(prince().config.binary, ['--version'], function (error, stdout, stderr) {
            if (error !== null) {
              console.log('Could not get Prince version:\n')
              reject(error)
              return
            }
            const m = stdout.match(/^Prince\s+(\d+(?:\.\d+)?)(\s*\w*\s*Books)*/)
            if (!(m !== null && typeof m[1] !== 'undefined')) {
              error = 'Prince version check returned unexpected output:\n' + stdout + stderr
              reject(error)
              return
            }
            let version
            if (m[2] && m[2].includes('Books')) {
              version = 'books-' + m[1]
            } else {
              version = m[1]
            }
            resolve(version)
          })
        } else {
          // ... or else check the global PATH
          const binaries = ['prince', 'prince-books']
          binaries.forEach(function (binary) {
            which(binary, function (error, filename) {
              if (error) {
                console.log('Prince not found in PATH:\n')
                reject(error)
                return
              }
              childProcess.execFile(filename, ['--version'], function (error, stdout, stderr) {
                if (error !== null) {
                  console.log('Could not get Prince version:\n')
                  reject(error)
                  return
                }
                const m = stdout.match(/^Prince\s+(\d+(?:\.\d+)?)/)
                if (!(m !== null && typeof m[1] !== 'undefined')) {
                  error = 'Prince version check returned unexpected output:\n' + stdout + stderr
                  reject(error)
                  return
                }
                resolve(m[1])
              })
            })
          })
        }
      })
    }

    // Check global Prince version vs version defined in package.json,
    // and return the relevant version string.
    installedPrince().then(function (installedVersion) {
      const packageJSON = require(process.cwd() + '/package.json')

      let preferredPrinceVersion

      if (packageJSON.prince && packageJSON.prince.version) {
        preferredPrinceVersion = packageJSON.prince.version

        if (installedVersion !== preferredPrinceVersion) {
          console.log('\nWARNING: your installed Prince version is ' + installedVersion +
                          ' but your project requires ' + preferredPrinceVersion + '\n' +
                          'You should delete node_modules/prince and run: npm install\n')
        } else {
          console.log('Prince version matches preferred version in package.json.')
        }
      }

      // Return the preferred Prince version if there is one,
      // otherwise return the installed version
      let result
      if (preferredPrinceVersion) {
        result = preferredPrinceVersion
      } else if (installedVersion) {
        result = installedVersion
      } else {
        result = undefined
      }
      resolve(result)
    }, function (error) {
      reject(error)
    })
  })
}

// Run Prince
async function runPrince (argv) {
  'use strict'

  // Check if we're using the correct Prince version
  await checkPrinceVersion()

  return new Promise(function (resolve, reject) {
    console.log('Rendering HTML to PDF with PrinceXML...')

    // Get Prince license file, if any
    // (and allow for 'correct' spelling, licence).
    let princeLicenseFile = ''
    let princeLicensePath
    const princeConfig = require(process.cwd() + '/package.json').prince
    if (princeConfig && princeConfig.license) {
      princeLicensePath = princeConfig.license
    } else if (princeConfig && princeConfig.licence) {
      princeLicensePath = fsPath.normalize(princeConfig.licence)
    }
    if (fs.existsSync(princeLicensePath)) {
      princeLicenseFile = princeLicensePath
      console.log('Using PrinceXML licence found at ' + princeLicenseFile)
    }

    // Get the HTML file to render. If we are merging
    // input files, we only pass the merged file to Prince.
    // Unless `--merged false` was passed at the command line.
    let inputFiles = [fsPath.dirname(htmlFilePaths(argv)[0]) + '/merged.html']
    if (argv.merged === false) {
      inputFiles = htmlFilePaths(argv)
    }

    // Get the book's stylesheet, so we can pass it
    // to Prince as a user stylesheet.
    // By passing a user style sheet, we give SVGs
    // that are referenced as `img src=""`
    // access to the stylesheet, including its font-faces.

    // Default CSS filename
    let styleSheetFilename = argv.format + '.css'

    // Check the project settings for an active variant,
    // and any variant-specific stylesheets we should use.
    if (variantSettings(argv).active && variantSettings(argv).stylesheet) {
      styleSheetFilename = variantSettings(argv).stylesheet
    }

    // Apply the stylesheet with that name
    // that we find in the styles folder beside
    // the first HTML document we're rendering.
    const stylesheet = fsPath.dirname(htmlFilePaths(argv)[0]) +
      '/styles/' + styleSheetFilename

    // Currently, node-prince does not seem to
    // log its progress to stdout. Possible WIP:
    // https://github.com/rse/node-prince/pull/7
    prince()
      .license('./' + princeLicenseFile)
      .inputs(inputFiles)
      .output(process.cwd() + '/_output/' + outputFilename(argv))
      .option('style', stylesheet)
      .option('javascript')

      // If your project uses an old version of Prince,
      // you will need to uncomment unsupported options:
      // tagged-pdf, max-passes, fail-dropped-content,
      // fail-missing-glyphs
      .option('tagged-pdf')

      // These options add too much logging
      // to be useful, but are available if needed.
      // .option('verbose')
      // .option('debug')

      // We use set forced to true for these
      // (the third parameter passed for an option)
      // because they are new and not necessarily
      // supported by the installed version
      // of node-prince.
      .option('max-passes', 3, true)
      .option('fail-dropped-content', true, true)

      // The following options are very strict,
      // and can cause an unnecessary number of failures
      // especially when working on maths books.
      // .option('fail-missing-glyphs', true, true)
      // .option('no-system-fonts', true, true)

      .timeout(100 * 1000) // required for larger books
      .on('stderr', function (line) { console.log(line) })
      .on('stdout', function (line) { console.log(line) })
      .execute()
      .then(function () {
        resolve()
      }, function (error) {
        console.log(error)
        reject(error)
      })
  })
}

// Zip an epub folder
async function epubZip () {
  'use strict'

  return new Promise(function (resolve, reject) {
    // Check if the directory exists
    const uncompressedEpubDirectory = fsPath.normalize(process.cwd() +
      '/_site/epub')
    if (!pathExists(uncompressedEpubDirectory)) {
      throw new Error('Sorry, could not find ' + uncompressedEpubDirectory + '.')
    }

    // Thanks https://github.com/lostandfound/epub-zip
    // for the initial idea for this.
    // Note that we use path.posix (not just path) because
    // EPUBCheck needs forward slashes in paths, otherwise
    // it cannot find META-INF/container.xml in epubs
    // generated on Windows machines.
    function getFiles (root, files, base) {
      'use strict'

      base = base || ''
      files = files || []
      const directory = fsPath.posix.join(root, base)

      // Files and folders to skip. For instance,
      // don't add the mimetype file, we'll create that
      // when we zip, so that we can add it specially.
      const skipFiles = /^(mimetype)$/

      if (fs.lstatSync(directory).isDirectory()) {
        fs.readdirSync(directory)
          .forEach(function (file) {
            if (!file.match(skipFiles)) {
              getFiles(root, files, fsPath.posix.join(base, file))
            }
          })
      } else {
        files.push(base)
      }
      return files
    }

    try {
      // Get the files to zip
      const files = getFiles(uncompressedEpubDirectory)

      // Create a new instance of JSZip
      const zip = new JSZip()

      // Add an uncompressed mimetype file first
      zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })

      // Add all the files
      files.forEach(function (file) {
        console.log('Adding ' + file + ' to zip.')
        zip.file(file,
          fs.readFileSync(fsPath.posix.join(uncompressedEpubDirectory, file)), { compression: 'DEFLATE' })
      })

      // Write the zip file to disk
      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(fs.createWriteStream(uncompressedEpubDirectory + '.zip'))
        .on('finish', function () {
          // JSZip generates a readable stream with a "end" event,
          // but is piped here in a writable stream which emits a "finish" event.
          console.log(uncompressedEpubDirectory + '.zip created.')

          resolve()
        })
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

// Move epub.zip to _output
async function epubZipRename (argv) {
  'use strict'

  return new Promise(function (resolve, reject) {
    const pathToZip = fsPath.normalize(process.cwd() +
              '/_site/epub.zip')

    let epubFilename = argv.book + '.epub'
    if (argv.language) {
      epubFilename = argv.book + '-' +
        argv.language +
        '.epub'
    }

    const pathToEpub = process.cwd() +
              '/_output/' +
              epubFilename

    console.log('Moving zipped epub to _output/' + epubFilename)

    if (pathExists(pathToZip)) {
      fs.move(pathToZip, pathToEpub,
        { overwrite: true })
        .then(function () {
          resolve()
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
        })
    } else {
      const error = 'Epub zip folder not found at ' +
        pathToZip
      console.log(error)
      reject(error)
    }
  })
}

// Check epub.
// Done as async so that we can await epubchecker
// and output its report to the console.
async function epubValidate (pathToEpubOrArgv) {
  'use strict'

  // Get path to epub from argument
  let pathToEpub
  if (pathToEpubOrArgv.book) {
    pathToEpub = process.cwd() +
      '/_output/' +
      pathToEpubOrArgv.book + '.epub'
  } else {
    pathToEpub = pathToEpubOrArgv
  }

  pathToEpub = fsPath.normalize(pathToEpub)
  const epubFilename = fsPath.basename(pathToEpub)
  const epubcheckReportFilePath = fsPath.normalize(process.cwd() +
            '/_output/' +
            epubFilename +
            '--epubcheck.json')

  console.log('Validating ' + epubFilename + '...')

  const report = await epubchecker(pathToEpub, {
    includeWarnings: true,
    includeNotices: true,
    output: epubcheckReportFilePath
  })

  console.log('Fatal errors: ' + report.checker.nError + '\n' +
            'Epub errors: ' + report.checker.nError + '\n' +
            'Epub warnings: ' + report.checker.nWarning + '\n')
  if (report.messages.length > 0) {
    console.log(report.messages)
    console.log('Your epub has issues. Opening report...')
    openOutputFile(epubcheckReportFilePath)
    return true
  } else {
    console.log('Epub is valid :-)')
    return true
  }
}

// Add files to the epub folder.
// The destinationFolder assumes, and is
// relative to, the destination epub folder,
// e.g. it might be `book/images/epub`.
// If you include a directory in the arrayOfPaths,
// its contents will be copied to the destination.
async function addToEpub (arrayOfPaths, destinationFolder) {
  'use strict'

  try {
    // Ensure the destinationFolder ends with a slash
    if (!destinationFolder.endsWith('/')) {
      destinationFolder += '/'
    }

    // Build the full destination path
    const destinationFolderPath = fsPath.normalize(process.cwd() +
              '/_site/epub/' + destinationFolder)

    // Create the destination directory
    fs.mkdirSync(destinationFolderPath, { recursive: true })

    // Track how many files we have to copy
    const totalFiles = arrayOfPaths.length
    let totalCopied = 0

    // Add each file in the array to the destination
    arrayOfPaths.forEach(function (path) {
      path = fsPath.normalize(path)

      if (fs.existsSync(path)) {
        try {
          // Destination depends on whether we are
          // copying a directory or a file
          if (fs.lstatSync(path).isDirectory()) {
            fs.copySync(path, destinationFolderPath)
          } else {
            fs.copySync(path, destinationFolderPath +
                              fsPath.basename(path))
          }

          console.log('Copied ' + path + ' to epub folder.')
          totalCopied += 1

          // Check if we're done
          if (totalCopied === totalFiles) {
            return true
          }
        } catch (error) {
          console.log('Could not copy ' + path + ' to epub folder: \n' +
                          error)
        }
      }
    })
  } catch (error) {
    console.log(error)
  }
}

// Get array of book-asset file paths for this output.
// assetType can be images or styles.
function bookAssetPaths (argv, assetType, folder) {
  'use strict'

  // Provide fallback book folder, which lets us
  // specify the 'assets' folder.
  let book
  if (folder) {
    book = folder
  } else if (argv.book) {
    book = argv.book
  } else {
    book = 'book'
  }

  // Image assets are in a subdirectory
  let formatSubdirectory = ''
  if (assetType === 'images') {
    formatSubdirectory = argv.format
  }

  const pathToTranslatedAssets = fsPath.normalize(process.cwd() +
        '/_site/' +
        book + '/' +
        argv.language + '/' +
        assetType + '/' +
        formatSubdirectory)

  const pathToParentAssets = fsPath.normalize(process.cwd() +
        '/_site/' +
        book + '/' +
        assetType + '/' +
        formatSubdirectory)

  // If translated assets exist, use that path,
  // otherwise use the parent assets.
  let pathToAssets
  if (argv.language &&
            fs.existsSync(pathToTranslatedAssets) &&
            fs.readdirSync(pathToTranslatedAssets).length > 0) {
    pathToAssets = pathToTranslatedAssets
  } else {
    pathToAssets = pathToParentAssets
  }

  console.log('Using files in ' + pathToAssets)

  // For styles, we only return a single path
  // to the stylesheet in the paths array.
  // Otherwise, we create one or more paths.
  let paths
  if (assetType === 'styles') {
    // Set the default stylesheet filename
    let styleSheetFilename = argv.format + '.css'

    // Get any active variant stylesheet
    if (variantSettings(argv).active) {
      styleSheetFilename = variantSettings(argv).stylesheet
    }

    // Add the stylesheet's path to the paths array
    const stylesheetPath = fsPath.normalize(pathToAssets +
      styleSheetFilename)
    paths = [stylesheetPath]
  } else {
    // Create an array of files
    const files = fs.readdirSync(pathToAssets)

    // Extract filenames from file objects,
    // and prepend path to each filename.
    paths = files.map(function (filename) {
      if (typeof filename === 'object') {
        return fsPath.normalize(pathToAssets + '/' +
                      Object.keys(filename)[0])
      } else {
        return fsPath.normalize(pathToAssets + '/' +
                      filename)
      }
    })
  }

  return paths
}

// Get a list of works (aka books) in this project
function works () {
  'use strict'

  // Get the works data directory
  const worksDirectory = fsPath.normalize(process.cwd() +
            '/_data/works')

  // Get the folder names in the works directory
  const arrayOfWorks = fs.readdirSync(worksDirectory, { withFileTypes: true })

  // These only work with arrow functions?
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  return arrayOfWorks
}

// Check that the --book value is valid
function bookIsValid (argv) {
  'use strict'

  let validity = true

  // If the --book value is not among works
  // in this project, and it was explicitly passed,
  // it's not a valid choice
  if (argv.book && explicitOption('book')) {
    // Allow any work, plus the `assets` folder
    const validWorks = works()
    validWorks.push('assets')

    if (!validWorks.includes(argv.book)) {
      validity = false

      if (argv.book === options.book.default) {
        console.error('Sorry, this project does not include a default %s.', argv.book)
      } else {
        console.error('Sorry, %s is not a work in this project.', argv.book)
      }
      process.exit()
    }
  }

  return validity
}

// Install Node dependencies
function installNodeModules () {
  'use strict'

  console.log(
    'Running npm to install Node modules...\n' +
        'If you get errors, check that Node.js is installed \n' +
        'and up to date (https://nodejs.org). \n'
  )
  const npmProcess = spawn(
    'npm',
    ['install']
  )
  logProcess(npmProcess, 'Installing Node modules')
}

// Install Ruby dependencies
function installGems () {
  'use strict'

  console.log(
    'Running Bundler to install Ruby gem dependencies...\n' +
        'If you get errors, check that Bundler is installed \n' +
        'and up to date (https://bundler.io). \n'
  )
  const bundleProcess = spawn(
    'bundle',
    ['install']
  )
  logProcess(bundleProcess, 'Installing Ruby gems')
}

// Processes images with gulp if -t images
async function processImages (argv) {
  'use strict'

  try {
    const gulpProcess = spawn(
      'gulp',
      ['--book', argv.book, '--language', argv.language]
    )
    await logProcess(gulpProcess, 'Processing images')
    return
  } catch (error) {
    console.log(error)
  }
}

// Convert HTML files to another format
async function convertHTMLtoWord (argv) {
  'use strict'

  console.log('Converting HTML to Word...')

  // Get file list for this format
  const filePaths = htmlFilePaths(argv)

  // Initialise a counter
  let totalConverted = 0

  // Determine the output location
  const outputLocation = fsPath.normalize(process.cwd() +
    '/_output/' +
    argv.book +
    '--' + argv.format +
    '--word')

  // Clear the previous output folder if it exists,
  // or create the output directory first if it doesn't.
  if (pathExists(outputLocation)) {
    await fs.emptyDir(outputLocation)
  } else {
    await fs.mkdir(outputLocation, { recursive: true })
  }

  return new Promise(function (resolve, reject) {
    // Loop through files and convert with Pandoc
    filePaths.forEach(function (filePath) {
      // Build path to output file
      const fileBasename = fsPath.basename(filePath, '.html')
      const outputFilePath = fsPath.normalize(outputLocation + '/' +
                    fileBasename + '.docx')

      // Passing an array is safer than a string because
      // is handles potential spaces in the source filename.
      // We must provide --resource-path or pandoc will look
      // for images in the working directory.
      const args = ['--resource-path=' + fsPath.dirname(filePath),
        '-f', 'html', '-t', 'docx', '-s', '-o',
        outputFilePath]

      function pandocCallback (error) {
        if (error) {
          // Filter out errors that tell users
          // to install rsvg-convert, because this
          // isn't necessary for simple Word output.
          if (!error.message.includes('check that rsvg-convert is in path')) {
            console.log('Potential problem converting HTML to Word: ', error)
          }
        } else {
          totalConverted += 1

          if (totalConverted === filePaths.length) {
            console.log('Conversion to Word complete. Files in ' +
              outputLocation)
            resolve()
          }
        }
      }

      pandoc(filePath, args, pandocCallback)
    })
  })
}

// Word export
async function exportWord (argv) {
  'use strict'

  try {
    await fs.emptyDir(process.cwd() + '/_site')
    await jekyll(argv)

    // Word export does not yet support index comments
    // and index links. We need to extend the gulp tasks
    // that process comments to make them visible in Word.
    // await renderIndexComments(argv)
    // await renderIndexLinks(argv)

    await convertHTMLtoWord(argv)
  } catch (error) {
    console.log(error)
  }
}

// Refresh indexes
async function refreshIndexes (argv) {
  'use strict'

  try {
    await fs.emptyDir(process.cwd() + '/_site')
    await jekyll(argv)

    if (argv.format === 'print-pdf' ||
      argv.format === 'screen-pdf' ||
      argv.format === 'epub') {
      await renderMathjax(argv)
      await renderIndexComments(argv)
    }

    if (projectSettings()['dynamic-indexing'] !== false) {
      buildReferenceIndex(argv.format)
    }

    if (argv.format === 'web' ||
      argv.format === 'app') {
      buildSearchIndex(argv.format)
    }
  } catch (error) {
    console.log(error)
  }
}

// Copy a book to create a new one
function newBook (argv) {
  'use strict'

  let sourceName = 'book'
  if (argv.book) {
    sourceName = argv.book
  }

  let destinationName = 'new'
  if (argv.name) {
    destinationName = argv.name
  }

  const contentSource = fsPath.normalize(process.cwd() + '/' + sourceName)
  const dataSource = fsPath.normalize(process.cwd() + '/_data/works/' + sourceName)
  const contentDestination = fsPath.normalize(process.cwd() + '/' + destinationName)
  const dataDestination = fsPath.normalize(process.cwd() + '/_data/works/' + destinationName)

  // Copy content folder
  try {
    fs.copySync(contentSource, contentDestination)
  } catch (error) {
    console.log(error)
  }

  // Copy _data/works folder
  try {
    fs.copySync(dataSource, dataDestination)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  epubHTMLTransformations,
  addToEpub,
  assembleApp,
  bookAssetPaths,
  bookIsValid,
  cleanHTMLFiles,
  convertXHTMLFiles,
  convertXHTMLLinks,
  cordova,
  epubValidate,
  epubZip,
  epubZipRename,
  exportWord,
  htmlFilePaths,
  installGems,
  installNodeModules,
  jekyll,
  logProcess,
  mathjaxEnabled,
  newBook,
  openOutputFile,
  pathExists,
  processImages,
  refreshIndexes,
  renderIndexComments,
  renderIndexLinks,
  renderMathjax,
  runPrince,
  variantSettings,
  works
}
