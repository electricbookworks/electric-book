// GitHub Releases storage backend for canonical PDFs.
//
// Canonical PDFs can be large, so instead of committing them to the project
// repo we store them as assets on a GitHub Release in a dedicated repo
// (default electricbookworks/electric-book-canonicals). One release per
// project, identified by a tag (settings.canonical-release in _data/tests.yml).
//
//   - Downloading uses the GitHub REST API with $GITHUB_TOKEN, so it works for
//     private repos in Codespaces and CI. No gh CLI is needed to download.
//   - Uploading (via `--update`) uses the gh CLI (`gh release upload --clobber`),
//     which is available in Codespaces and CI and handles auth and large files.

const fs = require('fs')
const fsPath = require('path')
const { execFileSync, spawnSync } = require('child_process')

// Raised when a canonical repo/release cannot be reached because the user has
// no access (or it does not exist). Callers turn this into a friendly message
// and let the rest of the test suite continue.
class NoAccessError extends Error {}

// The GitHub token available in Codespaces and CI, if any.
function githubToken () {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || null
}

// Split "owner/repo" into parts, or return null if malformed.
function parseRepo (repo) {
  if (!repo || typeof repo !== 'string') {
    return null
  }
  const match = repo.trim().match(/^([^/\s]+)\/([^/\s]+)$/)
  if (!match) {
    return null
  }
  return { owner: match[1], repo: match[2] }
}

// The public browser download URL for an asset. Recorded in _data/tests.yml
// for reference; actual downloads go through the REST API so private repos
// work.
function assetUrl (repo, tag, filename) {
  return 'https://github.com/' + repo + '/releases/download/' +
    encodeURIComponent(tag) + '/' + encodeURIComponent(filename)
}

// If a URL is a GitHub release download URL, pull out { repo, tag, filename };
// otherwise return null (e.g. a Dropbox link, handled by a plain download).
function parseAssetUrl (url) {
  if (typeof url !== 'string') {
    return null
  }
  const match = url.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+)\/releases\/download\/([^/]+)\/(.+)$/)
  if (!match) {
    return null
  }
  return {
    repo: match[1],
    tag: decodeURIComponent(match[2]),
    filename: decodeURIComponent(match[3])
  }
}

// Standard REST API headers, authenticated when a token is available.
function apiHeaders (token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'electric-book-tests',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  if (token) {
    headers.Authorization = 'Bearer ' + token
  }
  return headers
}

// Download a named asset from a release (by tag) via the REST API to destPath.
// Works for private repos when a token grants read access. Throws NoAccessError
// when the repo/release is unreachable, so tests can fail gracefully.
async function downloadAsset (repo, tag, filename, destPath, token) {
  if (!parseRepo(repo)) {
    throw new Error('Invalid canonical repo "' + repo + '" (expected owner/repo).')
  }
  token = token || githubToken()

  const relApi = 'https://api.github.com/repos/' + repo + '/releases/tags/' +
    encodeURIComponent(tag)
  const relRes = await fetch(relApi, { headers: apiHeaders(token) })

  if (relRes.status === 401 || relRes.status === 403) {
    throw new NoAccessError('No access to canonical repo ' + repo +
      ' (HTTP ' + relRes.status + '). A GitHub token with read access is needed.')
  }
  if (relRes.status === 404) {
    throw new NoAccessError('Canonical release "' + tag + '" not found in ' + repo +
      ' (or you have no access to it).')
  }
  if (!relRes.ok) {
    throw new Error('Failed to read release "' + tag + '" from ' + repo +
      ' (HTTP ' + relRes.status + ').')
  }

  const release = await relRes.json()
  const asset = (release.assets || []).find(function (a) { return a.name === filename })
  if (!asset) {
    throw new Error('Canonical asset "' + filename + '" not found on release "' +
      tag + '" in ' + repo + '. Run `--update` for this book+format to publish it.')
  }

  // The asset API URL streams the binary when asked for octet-stream. Node's
  // fetch strips the Authorization header on the cross-origin redirect to the
  // signed storage URL, so the download succeeds for private assets too.
  const assetRes = await fetch(asset.url, {
    headers: Object.assign(apiHeaders(token), { Accept: 'application/octet-stream' })
  })
  if (!assetRes.ok) {
    throw new Error('Failed to download asset "' + filename + '" from ' + repo +
      ' (HTTP ' + assetRes.status + ').')
  }

  const arrayBuffer = await assetRes.arrayBuffer()
  fs.mkdirSync(fsPath.dirname(destPath), { recursive: true })
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer))
  return destPath
}

// Is the gh CLI available? Uploading needs it.
function hasGh () {
  const result = spawnSync('gh', ['--version'], { stdio: 'ignore' })
  return !result.error && result.status === 0
}

// Does a release with this tag already exist in the repo?
function releaseExists (repo, tag) {
  const result = spawnSync('gh', ['release', 'view', tag, '--repo', repo], { stdio: 'ignore' })
  return !result.error && result.status === 0
}

// Create an empty release with this tag.
function createRelease (repo, tag, title) {
  execFileSync('gh', ['release', 'create', tag,
    '--repo', repo,
    '--title', title || tag,
    '--notes', 'Canonical PDF references for regression testing.'
  ], { stdio: 'inherit' })
}

// Upload (or overwrite) an asset on a release, creating the release if needed.
// Throws if gh fails (e.g. no write access); callers catch and fall back.
function uploadAsset (repo, tag, filePath, title) {
  if (!releaseExists(repo, tag)) {
    createRelease(repo, tag, title)
  }
  execFileSync('gh', ['release', 'upload', tag, filePath,
    '--repo', repo,
    '--clobber'
  ], { stdio: 'inherit' })
}

module.exports = {
  NoAccessError,
  githubToken,
  parseRepo,
  assetUrl,
  parseAssetUrl,
  downloadAsset,
  hasGh,
  releaseExists,
  uploadAsset
}
