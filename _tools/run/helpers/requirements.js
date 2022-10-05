const helpers = require('./helpers.js')
const fsExtra = require('fs-extra')
const fsPath = require('path')
const chalk = require('chalk')
const spawn = require('cross-spawn')
const yaml = require('js-yaml')

// Check that YAML is valid
async function checkYAML () {
  'use strict'

  console.log('Checking whether YAML files are valid ...' + '\n')

  try {
    const gulpProcess = spawn(
      'gulp',
      ['yaml', '--silent']
    )
    let outcome = await helpers.logProcess(gulpProcess, 'Checking YAML')
    if (outcome === true) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}

// Checks project for critical files and folders
async function checkRequiredPaths () {
  'use strict'

  // Initialise this for checking later.
  let errors = false
  let requiredPaths = true
  let projectLogo = 'logo.jpg'
  let projectImage = 'cover.jpg'

  // Get the names of the project images for checking
  try {
    const projectYAMLPath = fsPath.normalize(process.cwd() + '/_data/project.yml')
    const projectYAML = await yaml.load(fsExtra.readFileSync(projectYAMLPath), 'utf8');
    projectLogo = projectYAML.logo
    projectImage = projectYAML.image
  } catch (e) {
    console.log(e);
  }

  const globalRequirements = [
    {
      path: '_app',
      type: 'required',
      description: "Template files required for app output. You shouldn't ever have to change these."
    },
    {
      path: '_configs',
      type: 'required',
      description: "A folder of configuration settings for different outputs. You'll rarely have to change these, though you might occasionally need to customise outputs here."
    },
    {
      path: '_data',
      type: 'required',
      description: 'A folder of data to use in your books (including project metadata).'
    },
    {
      path: '_data/project.yml',
      type: 'required',
      description: "Your project's metadata."
    },
    {
      path: '_data/locales.yml',
      type: 'required',
      description: 'Text for phrases, per language.'
    },
    {
      path: '_data/settings.yml',
      type: 'required',
      description: 'Project settings.'
    },
    {
      path: '_docs',
      type: 'recommended',
      description: 'Documentation on how to use the template.'
    },
    {
      path: '_epub',
      type: 'required',
      description: "Template files required for epub output. You shouldn't ever have to change these."
    },
    {
      path: '_includes',
      type: 'required',
      description: 'HTML templates that Jekyll uses to build your books. You will rarely change anything here. You may need to add new templates here for custom book features.'
    },
    {
      path: '_layouts',
      type: 'required',
      description: "Templates that Jekyll uses to structure pages. You shouldn't ever have to change these."
    },
    {
      path: '_output',
      type: 'required',
      description: 'The folder where output scripts will save your PDFs and epubs.'
    },
    {
      path: '_sass',
      type: 'required',
      description: "A folder that stores the default styles for your books. You shouldn't ever have to change these unless you're heavily modifying designs for a series."
    },
    {
      path: '_site',
      type: 'automatic',
      description: 'Jekyll will automatically generate this folder for the web and app versions of your books.'
    },
    {
      path: '_tools',
      type: 'required',
      description: "Utilities required for output. For instance, colour profiles for PDFs and image conversions and the Zip utility for creating epubs. You shouldn't have to change these. You might add your own colour profiles to `_tools/profiles` for specialised projects."
    },
    {
      path: 'assets',
      type: 'required',
      description: 'A folder of Javascript, font files and images that your whole project might use.'
    },
    {
      path: 'assets/images/_source/' + projectImage,
      type: 'recommended',
      description: 'An image used as the default for the project as a whole.'
    },
    {
      path: 'assets/images/_source/' + projectLogo,
      type: 'optional',
      description: "A logo for the project and website as a whole."
    },
    {
      path: 'assets/fonts',
      type: 'optional',
      description: 'A place to store fonts that all books in a project might use. The template includes several open-licensed fonts here already.'
    },
    {
      path: 'assets/js',
      type: 'required',
      description: "Javascript used in the template. Advanced users might add their own scripts here and manage which scripts are included on pages in `bundle.js`. See the ['Using Javascript'](../advanced/javascript.html) section for more detail."
    },
    {
      path: '_config.yml',
      type: 'required',
      description: 'A file for setting configuration options for Jekyll, which will compile your book for output.'
    },
    {
      path: '_prose.yml',
      type: 'recommended',
      description: "Configuration settings for using [prose.io](http://prose.io) for online book editing (generally, you won't have to edit this file) and for excluding files from view in the [Electric Book Manager](https://electricbookworks.github.io/electric-book-gui/)."
    },
    {
      path: 'gulpfile.js',
      type: 'required',
      description: 'Handles various automated file conversations, including processing images from `_source` into various output formats. Most users can ignore this. Advanced users may want to adjust it.'
    },
    {
      path: 'index.md',
      type: 'required',
      description: 'the home page of your project when served as a website.'
    },
    {
      path: 'search.md',
      type: 'required',
      description: 'the search page of your project when served as a website.'
    },
    {
      path: 'README.md',
      type: 'recommended',
      description: 'The starting place for your collaborators. It should tell them how to use the project.'
    },
    {
      path: '.gitignore',
      type: 'recommended',
      description: "The .gitignore file tells Git what files not to track. You shouldn't need to edit it."
    },
    {
      path: 'Gemfile',
      type: 'required',
      description: "Determines which versions of Ruby gems your project uses. You'll rarely have to chance this unless you know exactly why you're changing it."
    },
    {
      path: 'Gemfile.lock',
      type: 'automatic',
      description: 'Defines which gems were installed when Ruby ran the Gemfile.'
    },
    {
      path: 'LICENSE',
      type: 'recommended',
      description: 'The license terms under which this project is published.'
    },
    {
      path: 'node_modules',
      type: 'automatic',
      description: "If this is missing, you need to install dependencies. Once you install Gulp and its dependencies for a project, you'll also see this folder in your project. You can ignore this, but don't delete it. It should not be tracked by Git."
    },
    {
      path: 'package.json',
      type: 'required',
      description: 'Determines which Node modules your projects needs for things like image processing and building apps. Most users can ignore this file. Advanced users will need to edit it to use new Node modules.'
    },
    {
      path: 'package-lock.json',
      type: 'automatic',
      description: 'Defines which packages were installed when Node ran package.json.'
    }
  ]

  console.log('Checking project requirements ...')

  // Check global requirements
  globalRequirements.forEach(function (item) {
    const path = fsPath.normalize(process.cwd() + '/' + item.path)

    if (!helpers.pathExists(path)) {
      console.log(chalk.red('Warning: ') + 'file not found:')
      if (item.type === 'required') {
        console.log(path + ' ' + chalk.red(item.type))
        errors = true
      } else {
        console.log(path + ' ' + chalk.yellow(item.type))
      }
      console.log(item.description + '\n')
    }
  })

  // Check book-specific requirements
  const works = helpers.works()
  works.forEach(function (work) {
    // console.log('Checking files for ' + chalk.blue(work) + ' ... \n')

    const bookRequirements = [
      {
        path: '_data/works/' + work + '/default.yml',
        type: 'required',
        description: "Your book's default metadata."
      },
      {
        path: work,
        type: 'optional',
        description: "The folder for your book's content, stored in markdown files. Duplicate and rename this folder for each book you add to your project."
      },
      {
        path: work + '/index.md',
        type: 'required',
        description: "A landing page for a book. You can leave this file as is. It's useful in web and app versions. If you create a new book, you should copy this file as is into the same place in the new book's folder."
      },
      {
        path: work + '/package.opf',
        type: 'required',
        description: "Required for epub output. Jekyll fills out this file and it's built into the epub. If you create a new book, you should copy this file as is into the same place in the new book's folder."
      },
      {
        path: work + '/toc.ncx',
        type: 'optional',
        description: 'A navigation file for backwards-compatibility in older ereaders. You only need this file in a book if that backwards-compatibility is important to you.'
      },
      {
        path: work + '/images',
        type: 'recommended',
        description: 'This is where you store images for a book.'
      },
      {
        path: work + '/styles',
        type: 'required',
        description: "Contains the stylesheets for designing your book's various outputs."
      }
    ]

    bookRequirements.forEach(function (item) {
      const path = fsPath.normalize(process.cwd() + '/' + item.path)

      if (!helpers.pathExists(path)) {
        console.log(chalk.red('Warning: ') + 'file not found:')
        if (item.type === 'required') {
          console.log(path + ' ' + chalk.red(item.type))
          errors = true
        } else {
          console.log(path + ' ' + chalk.yellow(item.type))
        }
        console.log(item.description + '\n')
      }
    })
  })

  console.log('\nProject-requirements check complete.\n')

  if (errors) {
    console.log('Required files or folders are missing.')
    requiredPaths = false
  } else {
    console.log('Required files or folders are present.')
  }
  return requiredPaths
}

// Checks whether the API content files are up to date
// by checking that one exists for every file listed
// in the search store. If not, this outputs a warning.
// Note that we are really testing whether the files listed
// in the built _site/api/metadata/index.json are all
// included in _api/content. The _site/api/metadata/index.json
// file includes a JSON representation of _data/works. That
// file is complex to parse, but the files listed are the same as
// the `store` in search-engine.js, which uses _includes/files-listed.html,
// which itself parses _data/works for its files lists.
async function checkAPIContent() {

  console.log('Checking content API...')

  const pathToSearchStore = fsPath.normalize(process.cwd() +
          '/_site/assets/js/search-engine.js')
  const searchStoreExists = await fsExtra.pathExists(pathToSearchStore)

  if (searchStoreExists) {

    const searchStore = await require(pathToSearchStore).store
    let missingFiles = false
    let i
    for (i = 0; i < searchStore.length; i += 1) {

      const apiContentPath = process.cwd() + '/_api/content/'
          + searchStore[i].url.replace(/\.html$/, '') + '/index.json'

      const apiContentFileExists = await fsExtra.pathExists(fsPath.normalize(apiContentPath))

      if (!apiContentFileExists) {
        missingFiles = true
        console.log(chalk.red('Warning') + ': API content is missing ' + searchStore[i].url)
      }
    }

    console.log('Content-API check complete.')

    if (missingFiles) {
      console.log(chalk.red('\nPlease update the project web index to refresh API content.\n'))
      return false
    } else {
      console.log('Content API includes all built files. '
          + 'You may still want to run the index update.\n')
      return true
    }
  } else {
    return false
  }
}

exports.checkRequiredPaths = checkRequiredPaths
exports.checkYAML = checkYAML
exports.checkAPIContent = checkAPIContent
