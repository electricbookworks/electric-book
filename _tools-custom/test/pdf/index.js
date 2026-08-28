// PDF regression test runner. Orchestrates a full run across the
// configured books and formats, and handles updating canonicals.

const fsPath = require('path')
const fs = require('fs')
const requireAll = require('require-all')

const manifest = require('./manifest.js')
const render = require('./render.js')
const fetch = require('./fetch.js')
const report = require('./report.js')
const explicitOption = require('../../../_tools/run/helpers/lib/explicitOption.js')
const outputFilename = require('../../../_tools/run/helpers/lib/outputFilename.js')
const languagePathSegment = require('../../../_tools/run/helpers/paths/languagePathSegment.js')
const buildHelpers = require('../../../_tools/run/helpers/helpers.js')
const mergeHtml = require('../../../_tools/run/helpers/merge')
const fsExtra = require('fs-extra')

const outputDir = fsPath.join(process.cwd(), '_output')
const reportsRoot = fsPath.join(process.cwd(), '_tests', 'pdf', 'reports')

// The PDF filename for a target, matching the build output naming
// (e.g. samples-fr-print-pdf.pdf), including any active variant.
function pdfFilename (target) {
  return outputFilename({ book: target.book, format: target.format, language: target.language })
}

// Treat a book's default/parent language as the base target: its output
// is the book-root PDF, identical to a no-language build. Only a real
// translation keeps its language code (mirrors languagePathSegment, which
// the build helpers use to resolve output paths and filenames).
function normaliseLanguage (book, language) {
  if (language && languagePathSegment({ book, language })) {
    return language
  }
  return null
}

// A slug (filename without extension) used for report subfolders.
function targetSlug (target) {
  return pdfFilename(target).replace(/\.pdf$/, '')
}

// A human-readable label for reports.
function targetLabel (target) {
  const lang = target.language ? ' — ' + target.language : ''
  return target.book + lang + ' (' + target.format + ')'
}

// The command a user would run to build this target's current PDF.
function buildHint (target) {
  const lang = target.language ? ' -l ' + target.language : ''
  return 'npm run eb -- output -b ' + target.book + ' -f ' + target.format + lang
}

// The command a user would run to update this target's canonical PDF.
function updateHint (target) {
  const lang = target.language ? ' -l ' + target.language : ''
  return 'npm run eb -- test --update -b ' + target.book + ' -f ' + target.format + lang
}

// Build a PDF to _output/. This mirrors the stock `output` command's pdf()
// pipeline but deliberately omits opening the result in a viewer, which is
// unwanted during a test run.
async function buildPdf (argv) {
  if (!argv.skipbuild) {
    await fsExtra.emptyDir(fsPath.join(process.cwd(), '_site'))
    if (!argv.skipwebpack) {
      await buildHelpers.webpack(argv)
    }
    await buildHelpers.jekyll(argv)
  }
  await buildHelpers.processContent(argv)
  await buildHelpers.renderIndexComments(argv)
  await buildHelpers.renderIndexLinks(argv)
  await mergeHtml(argv)
  await buildHelpers.renderMathjax(argv)
  await buildHelpers.pdfHTMLTransformations(argv)
  await buildHelpers.runPrince(argv)
}

// Return the current output PDF path, building it first if it is missing.
// Throws if the build does not produce the expected file.
async function ensureCurrentPdf (target, argv) {
  const currentPath = currentPdfPath(target)
  if (fs.existsSync(currentPath)) {
    return currentPath
  }

  console.log('No current PDF at _output/' + pdfFilename(target) + '; building it first…')
  const buildArgv = Object.assign({}, argv, {
    book: target.book,
    format: target.format,
    language: target.language || ''
  })
  await buildPdf(buildArgv)

  if (!fs.existsSync(currentPath)) {
    throw new Error('Build did not produce _output/' + pdfFilename(target) +
      '. Try building manually with `' + buildHint(target) + '`.')
  }
  return currentPath
}

// Recursively flatten a require-all result into an array of test modules.
function flattenTests (tree) {
  const modules = []
  Object.keys(tree).forEach(function (key) {
    const value = tree[key]
    if (value && typeof value.run === 'function') {
      modules.push(value)
    } else if (value && typeof value === 'object') {
      modules.push.apply(modules, flattenTests(value))
    }
  })
  return modules
}

// Load all page/structural test modules from ./tests.
function loadTests () {
  const tree = requireAll({
    dirname: fsPath.join(__dirname, 'tests'),
    filter: /(.+)\.js$/,
    recursive: true
  })
  return flattenTests(tree)
}

// The current output PDF path for a target.
function currentPdfPath (target) {
  return fsPath.join(outputDir, pdfFilename(target))
}

// Work out which book+format(+language) targets to test, honouring
// --book, --format and --language.
function resolveTargets (argv) {
  const data = manifest.readTestConfig()
  const books = Object.keys(data.books)

  const bookFilter = explicitOption('book') ? argv.book : null
  const formatFilter = explicitOption('format') ? argv.format : null
  const languageFilter = explicitOption('language') && argv.language ? argv.language : null

  const targets = []
  books.forEach(function (book) {
    if (bookFilter && book !== bookFilter) {
      return
    }
    manifest.getFormats(book).forEach(function (format) {
      if (formatFilter && format !== formatFilter) {
        return
      }
      // Only PDF formats are handled by this runner.
      if (format !== 'print-pdf' && format !== 'screen-pdf') {
        return
      }

      // An explicit --language narrows to that single language. The book's
      // default language normalises to the base (no-language) target.
      if (languageFilter) {
        targets.push({ book, format, language: normaliseLanguage(book, languageFilter) })
        return
      }

      // Otherwise test the base (no-language) entry, if configured, plus
      // every translation configured under this format.
      const formatEntry = manifest.getCanonicalEntry(book, format) || {}
      const languages = manifest.getLanguages(book, format)
      const hasBase = !!(formatEntry['canonical-path'] || formatEntry['canonical-url'])

      // Dedupe by normalised language, so a configured entry that is really
      // the book's default language doesn't produce a second base target.
      const seen = new Set()
      const pushTarget = function (language) {
        const key = language || ''
        if (seen.has(key)) {
          return
        }
        seen.add(key)
        targets.push({ book, format, language })
      }

      if (hasBase || languages.length === 0) {
        pushTarget(null)
      }
      languages.forEach(function (language) {
        pushTarget(normaliseLanguage(book, language))
      })
    })
  })
  return targets
}

// Run the full PDF regression suite.
async function run (argv) {
  const targets = resolveTargets(argv)

  if (targets.length === 0) {
    console.log('No PDF books/formats configured in _data/tests.yml.')
    return { passed: true, results: [] }
  }

  const tests = loadTests()
  const dpi = manifest.getDpi()
  const runReportDir = fsPath.join(reportsRoot, timestamp())
  const results = []

  for (const target of targets) {
    const entry = await runTarget(target, argv, tests, dpi, runReportDir)
    results.push(entry)
  }

  const reportPath = report.htmlReport(results, runReportDir)
  report.consoleReport(results, reportPath)

  const passed = results.every(function (r) { return r.passed })
  return { passed, results }
}

// Run all tests for a single target (book+format+optional language).
async function runTarget (target, argv, tests, dpi, runReportDir) {
  const { book, format, language } = target
  const label = targetLabel(target)
  const filename = pdfFilename(target)
  const entry = { book, format, language, label, passed: false, tests: [] }

  let currentPath
  try {
    currentPath = await ensureCurrentPdf(target, argv)
  } catch (error) {
    entry.error = error.message
    return entry
  }

  const canonicalEntry = manifest.getCanonicalEntry(book, format, language) || {}
  let canonicalPath
  try {
    canonicalPath = await fetch.getCachedOrFetch(filename, canonicalEntry, label, updateHint(target))
  } catch (error) {
    entry.error = error.message
    return entry
  }

  let canonicalRender, currentRender
  try {
    canonicalRender = await render.renderPages(canonicalPath, { dpi })
    currentRender = await render.renderPages(currentPath, { dpi })
  } catch (error) {
    entry.error = 'Failed to render PDF: ' + error.message
    return entry
  }

  const threshold = (argv.threshold !== undefined && argv.threshold !== null)
    ? Number(argv.threshold)
    : manifest.getThreshold(book)

  const context = {
    book,
    format,
    language,
    label,
    slug: targetSlug(target),
    argv,
    threshold,
    dpi,
    entry: canonicalEntry,
    canonicalPath,
    currentPath,
    reportDir: runReportDir,
    rendered: {
      canonical: { pages: canonicalRender.pages, length: canonicalRender.length, metadata: canonicalRender.metadata },
      current: { pages: currentRender.pages, length: currentRender.length, metadata: currentRender.metadata }
    }
  }

  for (const test of tests) {
    try {
      const result = await test.run(context)
      entry.tests.push(Object.assign({ name: test.name }, result))
    } catch (error) {
      entry.tests.push({ name: test.name, passed: false, summary: error.message, results: [{ passed: false, message: error.message }] })
    }
  }

  entry.passed = entry.tests.every(function (t) { return t.passed })
  return entry
}

// Update the canonical PDF for a target from the current _output/ PDF.
async function update (argv) {
  const bookExplicit = explicitOption('book')
  const formatExplicit = explicitOption('format')

  if (!bookExplicit || !formatExplicit) {
    console.error('To update a canonical, specify both --book and --format, ' +
      'e.g. `npm run eb -- test --update -b book -f print-pdf`.')
    return { passed: false, results: [] }
  }

  const languageArg = explicitOption('language') && argv.language ? argv.language : null
  const language = normaliseLanguage(argv.book, languageArg)
  const target = { book: argv.book, format: argv.format, language }
  const filename = pdfFilename(target)
  let currentPath
  try {
    currentPath = await ensureCurrentPdf(target, argv)
  } catch (error) {
    console.error(error.message)
    return { passed: false, results: [] }
  }

  fs.mkdirSync(fetch.canonicalDir, { recursive: true })
  const canonicalPath = fetch.defaultCanonicalPath(filename)
  fs.copyFileSync(currentPath, canonicalPath)

  const info = await render.readInfo(canonicalPath)
  const sha256 = fetch.sha256File(canonicalPath)
  const relativePath = fsPath.relative(process.cwd(), canonicalPath)

  manifest.setCanonicalEntry(target.book, target.format, language, {
    'canonical-path': relativePath,
    sha256,
    pages: info.length,
    updated: new Date().toISOString().slice(0, 10)
  })

  console.log('Updated canonical for ' + targetLabel(target) + ':')
  console.log('  ' + relativePath + ' — ' + info.length + ' pages')
  console.log('  sha256: ' + sha256)
  return { passed: true, results: [] }
}

// A filesystem-safe timestamp for report directory names.
function timestamp () {
  return new Date().toISOString().replace(/:/g, '-').replace(/\..+$/, '')
}

module.exports = { run, update }
