// Resolve and, if necessary, download the canonical PDF for a book+format.
//
// For now canonical PDFs are stored in the repo under _tests/pdf/canonical/,
// named to match the build output (e.g. samples-fr-print-pdf.pdf).
// A book+format(+language) entry in _data/tests.yml may specify:
//   canonical-path: <repo-relative path>   (preferred, in-repo storage)
//   canonical-url:  <http(s) URL>          (optional, downloaded and cached)
//   sha256:         <hash>                  (optional, verified when present)

const fsPath = require('path')
const fs = require('fs')
const crypto = require('crypto')

const canonicalDir = fsPath.join(process.cwd(), '_tests', 'pdf', 'canonical')
const cacheDir = fsPath.join(process.cwd(), '_tests', '.cache')

// Compute the SHA-256 hash of a file.
function sha256File (filePath) {
  const buffer = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

// The default in-repo canonical path for a given PDF filename.
function defaultCanonicalPath (filename) {
  return fsPath.join(canonicalDir, filename)
}

// Download a URL to a destination path.
async function downloadTo (url, destPath) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to download ' + url + ' (HTTP ' + response.status + ')')
  }
  const arrayBuffer = await response.arrayBuffer()
  fs.mkdirSync(fsPath.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer))
}

// Resolve a local path to the canonical PDF, downloading it if the entry
// points to a URL. Returns an absolute path, or throws if unavailable.
// `filename` is the expected PDF filename; `label` and `updateHint` are used
// only for human-readable error messages.
async function getCachedOrFetch (filename, entry, label, updateHint) {
  entry = entry || {}

  // 1. Explicit in-repo path.
  if (entry['canonical-path']) {
    const localPath = fsPath.isAbsolute(entry['canonical-path'])
      ? entry['canonical-path']
      : fsPath.join(process.cwd(), entry['canonical-path'])
    if (fs.existsSync(localPath)) {
      return localPath
    }
    throw new Error('Canonical PDF not found at ' + entry['canonical-path'] +
      '. Run `' + updateHint + '` to create it.')
  }

  // 2. Remote URL, cached locally and hash-verified when a hash is given.
  if (entry['canonical-url'] && /^https?:\/\//.test(entry['canonical-url'])) {
    const cachePath = fsPath.join(cacheDir, filename)
    const cacheValid = fs.existsSync(cachePath) &&
      (!entry.sha256 || sha256File(cachePath) === entry.sha256)
    if (!cacheValid) {
      await downloadTo(entry['canonical-url'], cachePath)
      if (entry.sha256 && sha256File(cachePath) !== entry.sha256) {
        throw new Error('Downloaded canonical PDF hash does not match the expected sha256 for ' +
          label + '.')
      }
    }
    return cachePath
  }

  // 3. Fall back to the default in-repo location.
  const fallback = defaultCanonicalPath(filename)
  if (fs.existsSync(fallback)) {
    return fallback
  }

  throw new Error('No canonical PDF configured for ' + label + '. ' +
    'Run `' + updateHint + '` to create one.')
}

module.exports = {
  canonicalDir,
  cacheDir,
  sha256File,
  defaultCanonicalPath,
  getCachedOrFetch
}
