// Top-level test orchestrator. Dispatches to a test suite based on the
// requested --format. New suites (web, epub, links, unit) can be added
// here as they are built.

const pdf = require('./pdf')
const explicitOption = require('../../_tools/run/helpers/lib/explicitOption.js')

// Run tests. Returns a Promise resolving to { passed }.
async function run (argv) {
  if (argv.update) {
    return pdf.update(argv)
  }

  // --format defaults to 'web', so only treat it as a filter when the
  // user passed it explicitly. With no explicit format, run all suites
  // (currently just PDF regression across all configured formats).
  const format = explicitOption('format') ? argv.format : null

  if (!format || format === 'print-pdf' || format === 'screen-pdf') {
    return pdf.run(argv)
  }

  console.log('No tests implemented for format "' + format + '" yet.')
  return { passed: true, results: [] }
}

module.exports = { run }
