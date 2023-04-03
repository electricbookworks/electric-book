#! /usr/bin/env -S node -r esm

// --------------------------------------------------
// This script is not currently being used by default.
// _tools/run/helpers/helpers.js uses tex2mml-page.js instead.
// This is here is case a project needs SVG math output,
// in which case helpers.js can be modified to use it.
// --------------------------------------------------

// This script is adapted from
// https://github.com/mathjax/MathJax-demos-node/blob/master/component/tex2svg-page
// The main adaptation is that it accepts an extra argument
// path for path of the converted file

const fs = require('fs')

/*************************************************************************
 *
 *  component/tex2svg-page
 *
 *  Uses MathJax v3 to convert all TeX in an SVG document.
 *
 * ----------------------------------------------------------------------
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

//  The default TeX packages to use
const PACKAGES = 'base, autoload, require, ams, newcommand'

//  Get the command-line arguments
const argv = require('yargs')
  .demand(0).strict()
  .usage('$0 [options] file.html converted.html argv')
  .options({
    em: {
      default: 16,
      describe: 'em-size in pixels'
    },
    ex: {
      default: 8,
      describe: 'ex-size in pixels'
    },
    packages: {
      default: PACKAGES,
      describe: 'the packages to use, e.g. "base, ams"; use "*" to represent the default packages, e.g, "*, bbox"'
    },
    fontCache: {
      default: 'global',
      describe: 'cache type: local, global, or none'
    },
    dist: {
      boolean: true,
      default: false,
      describe: 'true to use webpacked version, false to use MathJax source files'
    }
  })
  .argv

//  Read the HTML file
const htmlfile = require('fs').readFileSync(argv._[0], 'utf8')

// Get the path for the output file
const outputFilePath = argv._[1]

// Configure MathJax.
// Disable enableAssistiveMml unless output format is web, app, epub
MathJax = {
  loader: {
    paths: { mathjax: 'mathjax-full/es5' },
    source: (argv.dist ? {} : require('mathjax-full/components/src/source.js').source),
    require,
    load: ['adaptors/liteDOM']
  },
  tex: {
    packages: argv.packages.replace('*', PACKAGES).split(/\s*,\s*/)
  },
  svg: {
    fontCache: argv.fontCache,
    exFactor: argv.ex / argv.em
  },
  'adaptors/liteDOM': {
    fontSize: argv.em
  },
  startup: {
    document: htmlfile
  }
}

//  Load the MathJax startup module
const mathjaxComponent = 'tex-svg'
require('mathjax-full/' + (argv.dist ? 'es5' : `components/src/${mathjaxComponent}`) +
  `/${mathjaxComponent}.js`)

//  Wait for MathJax to start up, and then typeset the math
MathJax.startup.promise.then(() => {
  const adaptor = MathJax.startup.adaptor
  const html = MathJax.startup.document
  if (Array.from(html.math).length === 0) {
    adaptor.remove(html.outputJax.svgStyles)
    const cache = adaptor.elementById(adaptor.body(html.document), 'MJX-SVG-global-cache')
    if (cache) adaptor.remove(cache)
  }

  // Log the converted doc to the console
  // console.log(adaptor.doctype(html.document))
  // console.log(adaptor.outerHTML(adaptor.root(html.document)))

  // Write the converted HTML file
  const outputFileContents = adaptor.outerHTML(adaptor.root(html.document))
  fs.writeFile(outputFilePath, outputFileContents, (err) => {
    if (err) throw err
  })
}).catch(err => console.log(err))
