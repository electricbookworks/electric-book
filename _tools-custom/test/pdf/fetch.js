// Resolve and, if necessary, download the canonical PDF for a book+format.
//
// A book+format(+language) entry in _data/tests.yml may specify:
//   canonical-path: <repo-relative path>   (in-repo storage)
//   canonical-url:  <http(s) URL>          (downloaded and cached; a GitHub
//                                           release URL is fetched via the API
//                                           so private repos work)
//   sha256:         <hash>                  (optional, verified when present)
//
// When neither is set but a canonical repo + release are configured in
// settings, the canonical is resolved implicitly from that release by
// filename. Downloaded canonicals are cached under _tests/.cache/.

const fsPath = require('path')
const fs = require('fs')
const crypto = require('crypto')

const release = require('./release.js')
const manifest = require('./manifest.js')

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

  // 2. Remote canonical: an explicit URL, or an implicit lookup by filename
  //    from the configured canonical repo + release.
  const url = entry['canonical-url']
  const hasExplicitUrl = url && /^https?:\/\//.test(url)
  const repo = manifest.getCanonicalRepo()
  const tag = manifest.getCanonicalRelease()
  const canImplicit = repo && tag

  if (hasExplicitUrl || canImplicit) {
    const cachePath = fsPath.join(cacheDir, filename)
    const expectedHash = entry.sha256 == null ? null : String(entry.sha256)
    const cacheValid = fs.existsSync(cachePath) &&
      (!expectedHash || sha256File(cachePath) === expectedHash)

    if (!cacheValid) {
      const asset = hasExplicitUrl ? release.parseAssetUrl(url) : null
      try {
        if (hasExplicitUrl && !asset) {
          // A non-release URL (e.g. a Dropbox link): plain download.
          await downloadTo(url, cachePath)
        } else {
          // A GitHub release URL, or an implicit repo+release lookup.
          const source = asset || { repo, tag, filename }
          await release.downloadAsset(source.repo, source.tag, source.filename,
            cachePath, release.githubToken())
        }
      } catch (error) {
        if (error instanceof release.NoAccessError) {
          throw new Error('Cannot fetch canonical PDF for ' + label + ': ' +
            error.message + '\n  PDF regression tests need read access to the ' +
            'canonical repository; other tests are unaffected.')
        }
        throw error
      }
      if (expectedHash && sha256File(cachePath) !== expectedHash) {
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
