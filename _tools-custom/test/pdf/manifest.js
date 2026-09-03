// Read and write test configuration from _data/tests.yml.

const fsPath = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

const configPath = fsPath.join(process.cwd(), '_data', 'tests.yml')

// Parse _data/tests.yml. Returns a config object with sensible defaults
// if the file is missing or empty.
function readTestConfig () {
  let data = {}
  if (fs.existsSync(configPath)) {
    data = yaml.load(fs.readFileSync(configPath, 'utf8')) || {}
  }

  if (!data.settings) {
    data.settings = {}
  }
  if (!data.books) {
    data.books = {}
  }
  if (!data.custom) {
    data.custom = {}
  }

  return data
}

// Write the config object back to _data/tests.yml.
function writeTestConfig (data) {
  const output = yaml.dump(data, { lineWidth: -1, noRefs: true })
  fs.writeFileSync(configPath, output, 'utf8')
}

// Look up a specific book+format(+language) entry, or null if not configured.
// Language entries are nested under the format entry's `languages` map.
function getCanonicalEntry (book, format, language) {
  const data = readTestConfig()
  const formatEntry = data.books[book] && data.books[book][format]
  if (!formatEntry) {
    return null
  }
  if (language) {
    if (formatEntry.languages && formatEntry.languages[language]) {
      return formatEntry.languages[language]
    }
    return null
  }
  return formatEntry
}

// Set or update a book+format(+language) entry, persisting to disk.
function setCanonicalEntry (book, format, language, entry) {
  const data = readTestConfig()
  if (!data.books[book]) {
    data.books[book] = {}
  }
  if (!data.books[book][format]) {
    data.books[book][format] = {}
  }
  if (language) {
    if (!data.books[book][format].languages) {
      data.books[book][format].languages = {}
    }
    data.books[book][format].languages[language] = stripNull(Object.assign(
      {}, data.books[book][format].languages[language], entry
    ))
    writeTestConfig(data)
    return data.books[book][format].languages[language]
  }
  data.books[book][format] = stripNull(Object.assign({}, data.books[book][format], entry))
  writeTestConfig(data)
  return data.books[book][format]
}

// Remove keys whose value is null, so callers can unset a field (e.g. clear
// canonical-path when switching a target to remote canonical-url storage).
function stripNull (object) {
  Object.keys(object).forEach(function (key) {
    if (object[key] === null) {
      delete object[key]
    }
  })
  return object
}

// Return the languages configured for a book+format, as an array of codes.
function getLanguages (book, format) {
  const data = readTestConfig()
  const formatEntry = data.books[book] && data.books[book][format]
  if (formatEntry && formatEntry.languages) {
    return Object.keys(formatEntry.languages)
  }
  return []
}

// Return the per-book threshold, falling back to the global default.
function getThreshold (book) {
  const data = readTestConfig()
  if (data.books[book] && typeof data.books[book].threshold === 'number') {
    return data.books[book].threshold
  }
  if (typeof data.settings.threshold === 'number') {
    return data.settings.threshold
  }
  return 0.1
}

// Return the GitHub repo used to store canonical PDFs as release assets, or
// null if not configured. There is no default: remote storage is only used
// when settings.canonical-repo is set in _data/tests.yml.
function getCanonicalRepo () {
  const data = readTestConfig()
  return data.settings['canonical-repo'] || null
}

// Return the release tag (one per project) under which canonical PDFs are
// stored, or null if not configured (in which case remote storage is off).
function getCanonicalRelease () {
  const data = readTestConfig()
  return data.settings['canonical-release'] || null
}

// Return the render DPI from settings, defaulting to 150.
function getDpi () {
  const data = readTestConfig()
  if (typeof data.settings.dpi === 'number') {
    return data.settings.dpi
  }
  return 150
}

// Return the list of formats to test for a given book. Per-book `formats:`
// overrides the project default in settings.
function getFormats (book) {
  const data = readTestConfig()
  if (data.books[book] && Array.isArray(data.books[book].formats)) {
    return data.books[book].formats
  }
  if (Array.isArray(data.settings.formats)) {
    return data.settings.formats
  }
  return ['print-pdf', 'screen-pdf']
}

module.exports = {
  configPath,
  readTestConfig,
  writeTestConfig,
  getCanonicalEntry,
  setCanonicalEntry,
  getLanguages,
  getThreshold,
  getDpi,
  getFormats,
  getCanonicalRepo,
  getCanonicalRelease
}
