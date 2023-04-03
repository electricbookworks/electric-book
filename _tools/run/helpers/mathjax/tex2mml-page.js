#! /usr/bin/env -S node -r esm

// This script is adapted from
// https://github.com/mathjax/MathJax-demos-node/blob/master/component/tex2mml-page
// The main adaptation is that it accepts an extra argument
// path for path of the converted file

const fs = require('fs')

/*************************************************************************
 *
 *  component/tex2mml-page
 *
 *  Uses MathJax v3 to convert all TeX in an HTML document to MathML.
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
const PACKAGES = 'base, autoload, ams, newcommand, require'

//  Get the command-line arguments
const argv = require('yargs')
  .demand(0).strict()
  .usage('$0 [options] "math"')
  .options({
    em: {
      default: 16,
      describe: 'em-size in pixels'
    },
    packages: {
      default: PACKAGES,
      describe: 'the packages to use, e.g. "base, ams"; use "*" to represent the default packages, e.g, "*, bbox"'
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

//  A renderAction to take the place of typesetting.
//  It renders the output to MathML instead.
function actionMML (math, doc) {
  const adaptor = doc.adaptor
  const mml = MathJax.startup.toMML(math.root)
  math.typesetRoot = adaptor.firstChild(adaptor.body(adaptor.parse(mml, 'text/html')))
}

//  Configure MathJax
MathJax = {
  loader: {
    paths: { mathjax: 'mathjax-full/es5' },
    source: (argv.dist ? {} : require('mathjax-full/components/src/source.js').source),
    require,
    load: ['input/tex-full', 'adaptors/liteDOM']
  },
  options: {
    renderActions: {
      typeset: [150, (doc) => { for (const math of doc.math) actionMML(math, doc) }, actionMML]
    }
  },
  tex: {
    packages: argv.packages.replace('*', PACKAGES).split(/\s*,\s*/)
  },
  'adaptors/liteDOM': {
    fontSize: argv.em
  },
  startup: {
    document: htmlfile
  }
}

//  Load the MathJax startup module
require('mathjax-full/' + (argv.dist ? 'es5' : 'components/src/startup') + '/startup.js')

//  Wait for MathJax to start up, and then render the math.
//  Then output the resulting HTML file.
MathJax.startup.promise.then(() => {
  const adaptor = MathJax.startup.adaptor
  const html = MathJax.startup.document
  html.render()

  // Log the convert doc to the console
  // console.log(adaptor.doctype(html.document))
  // console.log(adaptor.outerHTML(adaptor.root(html.document)))

  // Write the converted HTML file
  const outputFileContents = adaptor.outerHTML(adaptor.root(html.document))
  fs.writeFile(outputFilePath, outputFileContents, (err) => {
    if (err) throw err
  })
}).catch(err => console.log(err))
