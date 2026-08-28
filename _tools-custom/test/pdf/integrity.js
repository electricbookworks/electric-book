// Pre-flight integrity check for canonical PDFs.
//
// Before running any (slow) builds, verify that every canonical PDF on disk
// still matches the sha256 recorded for it in _data/tests.yml. This catches
// canonicals that were changed or added by hand instead of via `--update`,
// which would otherwise cause confusing failures or silently skewed
// comparisons. Remote (canonical-url) canonicals are downloaded and
// hash-verified by fetch.js, so they are not re-checked here.

const fs = require('fs')
const fsPath = require('path')

const manifest = require('./manifest.js')
const fetch = require('./fetch.js')
const render = require('./render.js')

// Resolve the local canonical path for a target's manifest entry, or null
// when the canonical is remote-only (verified by fetch.js at fetch time).
function localCanonicalPath (entry, filename) {
  if (entry['canonical-path']) {
    return fsPath.isAbsolute(entry['canonical-path'])
      ? entry['canonical-path']
      : fsPath.join(process.cwd(), entry['canonical-path'])
  }
  if (entry['canonical-url']) {
    return null
  }
  return fetch.defaultCanonicalPath(filename)
}

// Check every target's on-disk canonical against the metadata recorded for it
// in _data/tests.yml. `filenameFor` maps a target to its expected PDF
// filename. Returns an array of problem objects (empty when every canonical is
// consistent):
//   { target, path, kind: 'missing-hash', actualHash }
//   { target, path, kind: 'hash-mismatch', expectedHash, actualHash }
//   { target, path, kind: 'page-count-mismatch', expectedPages, actualPages }
//   { target, path, kind: 'unreadable', message }
async function checkCanonicalIntegrity (targets, filenameFor) {
  const problems = []

  for (const target of targets) {
    const entry = manifest.getCanonicalEntry(target.book, target.format, target.language) || {}
    const localPath = localCanonicalPath(entry, filenameFor(target))

    // Remote-only canonicals are handled by fetch.js, not here.
    if (!localPath) {
      continue
    }

    // A missing canonical file is already reported clearly by fetch.js during
    // the run, so only check canonicals that actually exist on disk.
    if (!fs.existsSync(localPath)) {
      continue
    }

    const relativePath = fsPath.relative(process.cwd(), localPath)
    const actualHash = fetch.sha256File(localPath)

    // Coerce the recorded hash to a string: a digits-only hash would be parsed
    // from YAML as a number, which would never equal the hex string otherwise.
    const recordedHash = entry.sha256 == null ? null : String(entry.sha256)

    if (!recordedHash) {
      problems.push({ target, path: relativePath, kind: 'missing-hash', actualHash })
      continue
    }

    if (recordedHash !== actualHash) {
      // The file has changed; `--update` re-registers both hash and pages, so
      // one message per file is enough — don't also flag the page count.
      problems.push({ target, path: relativePath, kind: 'hash-mismatch', expectedHash: recordedHash, actualHash })
      continue
    }

    // The hash matches, so also confirm the recorded page count. `pages` is
    // stored separately from the PDF and can drift on its own (e.g. a canonical
    // swapped by hand with the field left stale).
    if (typeof entry.pages === 'number') {
      let actualPages
      try {
        const info = await render.readInfo(localPath)
        actualPages = info.length
      } catch (error) {
        problems.push({ target, path: relativePath, kind: 'unreadable', message: error.message })
        continue
      }
      if (actualPages !== entry.pages) {
        problems.push({ target, path: relativePath, kind: 'page-count-mismatch', expectedPages: entry.pages, actualPages })
      }
    }
  }

  return problems
}

module.exports = { checkCanonicalIntegrity }
