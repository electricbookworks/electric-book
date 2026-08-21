// Generate console and HTML reports from PDF regression results.

const fsPath = require('path')
const fs = require('fs')

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'
const RESET = '\x1b[0m'

// Read an image file and return a base64 data URI, or null if missing.
function dataUri (imagePath) {
  if (!imagePath || !fs.existsSync(imagePath)) {
    return null
  }
  const base64 = fs.readFileSync(imagePath).toString('base64')
  return 'data:image/png;base64,' + base64
}

// Escape text for safe inclusion in HTML.
function escapeHtml (text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Print a summary table to the console.
function consoleReport (results, reportPath) {
  console.log('')
  console.log(BOLD + 'PDF Regression Test Results' + RESET)
  console.log('═══════════════════════════')

  let passedCount = 0
  let failedCount = 0

  results.forEach(function (entry) {
    const label = entry.label || (entry.book + ' (' + entry.format + ')')

    if (entry.error) {
      failedCount++
      console.log(RED + '✗ ' + RESET + label.padEnd(36) + RED + entry.error + RESET)
      return
    }

    const changedPages = collectChangedPages(entry)
    const pageTest = entry.tests.find(function (t) { return Array.isArray(t.pages) })
    const pageCount = pageTest ? pageTest.pages.length : '?'

    if (entry.passed) {
      passedCount++
      console.log(GREEN + '✓ ' + RESET + label.padEnd(36) +
        DIM + pageCount + ' pages, 0 diffs' + RESET)
    } else {
      failedCount++
      let detail = pageCount + ' pages'
      if (changedPages.length) {
        detail += ', ' + changedPages.length + ' diffs (pp. ' + formatPageList(changedPages) + ')'
      } else {
        const failedTests = entry.tests
          .filter(function (t) { return !t.passed })
          .map(function (t) { return t.name })
        detail += ' — ' + failedTests.join('; ')
      }
      console.log(RED + '✗ ' + RESET + label.padEnd(36) + RED + detail + RESET)
    }
  })

  console.log('─────────────────────────────────────')
  console.log(passedCount + ' passed, ' + failedCount + ' failed')
  if (reportPath) {
    console.log('Report: ' + reportPath)
  }
  console.log('')
}

// Gather the changed page numbers across an entry's tests.
function collectChangedPages (entry) {
  const pages = []
  entry.tests.forEach(function (test) {
    if (Array.isArray(test.pages)) {
      test.pages.forEach(function (p) {
        if (p.changed) {
          pages.push(p.page)
        }
      })
    }
  })
  return pages
}

// Format a list of page numbers for the console, truncating long lists.
function formatPageList (pages) {
  const max = 12
  if (pages.length <= max) {
    return pages.join(', ')
  }
  return pages.slice(0, max).join(', ') + ', … (+' + (pages.length - max) + ' more)'
}

// Build a self-contained HTML report and write it to reportDir/index.html.
// Returns the path to the written file.
function htmlReport (results, reportDir) {
  fs.mkdirSync(reportDir, { recursive: true })

  const sections = results.map(function (entry) {
    return renderSection(entry)
  }).join('\n')

  const totalPassed = results.filter(function (e) { return e.passed }).length
  const totalFailed = results.length - totalPassed

  const html = '<!DOCTYPE html>\n' +
    '<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>PDF Regression Report</title>\n' +
    '<style>' + styles() + '</style>\n' +
    '</head>\n<body>\n' +
    '<header>\n<h1>PDF Regression Report</h1>\n' +
    '<p class="meta">' + escapeHtml(new Date().toISOString()) + ' — ' +
    totalPassed + ' passed, ' + totalFailed + ' failed</p>\n' +
    '<label class="filter"><input type="checkbox" id="only-changed" checked> ' +
    'Show only changed pages</label>\n' +
    '</header>\n<main>\n' + sections + '</main>\n' +
    '<script>' + script() + '</script>\n' +
    '</body>\n</html>\n'

  const reportPath = fsPath.join(reportDir, 'index.html')
  fs.writeFileSync(reportPath, html, 'utf8')
  return reportPath
}

// Render one book+format section of the HTML report.
function renderSection (entry) {
  const label = escapeHtml(entry.label || (entry.book + ' (' + entry.format + ')'))
  const statusClass = entry.passed ? 'pass' : 'fail'
  const statusText = entry.passed ? 'PASS' : 'FAIL'

  let body = ''

  if (entry.error) {
    body = '<p class="error">' + escapeHtml(entry.error) + '</p>'
  } else {
    const testList = entry.tests.map(function (test) {
      const cls = test.passed ? 'pass' : 'fail'
      const summary = test.summary ? ' — ' + escapeHtml(test.summary) : ''
      return '<li class="' + cls + '"><strong>' + escapeHtml(test.name) + '</strong>' +
        summary + '</li>'
    }).join('\n')

    body += '<ul class="tests">' + testList + '</ul>'

    const pageTest = entry.tests.find(function (t) { return Array.isArray(t.pages) })
    if (pageTest) {
      body += renderPages(pageTest.pages)
    }
  }

  return '<section class="' + statusClass + '">\n' +
    '<h2><span class="badge ' + statusClass + '">' + statusText + '</span> ' + label + '</h2>\n' +
    body + '\n</section>'
}

// Render the page-by-page visual comparison grid.
function renderPages (pages) {
  const rows = pages.map(function (p) {
    const changedClass = p.changed ? 'changed' : 'unchanged'
    const canonicalUri = dataUri(p.canonicalImage)
    const currentUri = dataUri(p.currentImage)
    const diffUri = dataUri(p.diffImage)

    let note = ''
    if (p.note) {
      note = '<span class="note">' + escapeHtml(p.note) + '</span>'
    } else if (typeof p.diffPercent === 'number') {
      note = '<span class="note">' + p.diffPercent.toFixed(3) + '% differ</span>'
    }

    const cells = [
      imageCell('Canonical', canonicalUri),
      imageCell('Current', currentUri),
      imageCell('Diff', diffUri)
    ].join('')

    return '<div class="page ' + changedClass + '" data-changed="' + p.changed + '">\n' +
      '<h3>Page ' + p.page + ' ' + note + '</h3>\n' +
      '<div class="cells">' + cells + '</div>\n</div>'
  }).join('\n')

  return '<div class="pages">' + rows + '</div>'
}

function imageCell (label, uri) {
  const content = uri
    ? '<img loading="lazy" src="' + uri + '" alt="' + label + '">'
    : '<div class="placeholder">—</div>'
  return '<figure><figcaption>' + label + '</figcaption>' + content + '</figure>'
}

function styles () {
  return 'body{font-family:system-ui,sans-serif;margin:0;color:#1a1a1a;background:#f5f5f5}' +
    'header{padding:1rem 1.5rem;background:#fff;border-bottom:1px solid #ddd;position:sticky;top:0}' +
    'h1{margin:0 0 .25rem;font-size:1.4rem}.meta{margin:.25rem 0;color:#666}' +
    '.filter{display:inline-block;margin-top:.5rem;font-size:.9rem}' +
    'main{padding:1.5rem}section{background:#fff;border:1px solid #ddd;border-radius:6px;' +
    'margin-bottom:1.5rem;padding:1rem 1.5rem}h2{font-size:1.15rem;display:flex;align-items:center;gap:.5rem}' +
    '.badge{font-size:.7rem;padding:.15rem .5rem;border-radius:4px;color:#fff}' +
    '.badge.pass{background:#2e7d32}.badge.fail{background:#c62828}' +
    '.tests{list-style:none;padding:0;margin:.5rem 0}.tests li{padding:.25rem 0}' +
    '.tests li.pass::before{content:"✓ ";color:#2e7d32}.tests li.fail::before{content:"✗ ";color:#c62828}' +
    '.error{color:#c62828;font-weight:bold}' +
    '.pages{margin-top:1rem}.page{border-top:1px solid #eee;padding:1rem 0}' +
    '.page h3{font-size:1rem;margin:0 0 .5rem}.note{color:#666;font-weight:normal;font-size:.85rem}' +
    '.cells{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem}' +
    'figure{margin:0}figcaption{font-size:.75rem;color:#666;margin-bottom:.25rem}' +
    'figure img{max-width:100%;border:1px solid #ccc;background:#fff}' +
    '.placeholder{aspect-ratio:1/1.4;display:flex;align-items:center;justify-content:center;' +
    'border:1px dashed #ccc;color:#aaa}'
}

function script () {
  return "(function(){var cb=document.getElementById('only-changed');" +
    'function apply(){var only=cb.checked;' +
    "document.querySelectorAll('.page').forEach(function(p){" +
    "p.style.display=(only&&p.dataset.changed!=='true')?'none':'';});}" +
    'cb.addEventListener("change",apply);apply();})();'
}

module.exports = { consoleReport, htmlReport }
