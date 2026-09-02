# PDF visual regression tests

## Initial project brief

In EBT-based projects like this one, we might make changes to CSS, JS, HTML or content that affects multiple books. We need to test the effect of our changes on those books.

When changes affect, say, text reflow on web output, that's usually fine. But when text reflows in a PDF output, that can be bad. We painstakingly refine page layouts in PDF, and need to be able to send them to printers with confidence, knowing we didn't break the layout of book A when we were working in book B.

At the moment, we have to manually check, visually, whether a PDF has changed after making changes.

We need to be able to run automated tests that compare PDF outputs and report on what has changed.

I want to store a canonical version of each book's PDF output, and then compare any new PDF output against that. We would need to store the print-PDF output and the screen-PDF output, and each would have its own test process. (In future, we could do something similar for EPUB.) This process should return a report for the user that explains what has changed, if anything.

While we might store canonical PDFs in the repo in version control, they are often so big that they would bloat the repo. So it may be better to store the canonical PDF remotely, and in the repo we store the location of the PDF. At first, this could be, say, a Dropbox link that is accessible on the web. In future, we might store these PDFs more securely, using some kind of authentication.

I imagine this testing should be part of a suite of tests that we need to develop for the EBT, which might include Cypress tests for web output, unit tests for the code, and tests for whether open-graph image links or other links in content resolve correctly. So we should structure testing code accordingly.

Test commands should be integrated with the existing `npm run eb` Node CLI.

---

## Implementation status

Phase 1 (PDF visual regression testing) is implemented. The build deviates from the original plan below in a few ways:

- **Canonical storage is in-repo.** Canonical PDFs are committed under `_tests/pdf/canonical/` as `<book>[-<language>]-<format>.pdf`. Remote storage (GitHub Releases, Phase 3) is not implemented; `_data/tests.yml` entries use a local `canonical-path` (an optional `canonical-url` is still supported for future remote use).
- **CLI options live in the command's `builder`.** `--update` and `--threshold`/`-g` are defined in `_tools-custom/run/commands/test.js`, not in a shared `options.js` — a custom `options.js` would overwrite the stock one during the `_tools-custom` → `_tools` merge.
- **Threshold is a percentage of pixels per page (0–100), default `0.1`.**
- **Language support.** `--language`/`-l` scopes tests to a translation; test filenames match the build output via the existing `outputFilename` helper, and per-language canonicals are nested under a `languages:` key in `_data/tests.yml`.
- **Missing output is built automatically.** If the current `_output/` PDF doesn't exist, it is built first (webpack → Jekyll → Prince) without opening the result in a viewer.
- **No CLI wiring changes.** The `test` command and `test/` framework are added purely in `_tools-custom/`; the stock `.commandDir('./commands/')` discovers the command after the merge.

The sections below are the original development plan; Phases 2 and 4–8 remain future work.

---

## Development plan

### Migration note

In this repo, `_tools/` is version-controlled locally. In the latest EBT, most JS has been abstracted to the `electric-book-modules` repo for central updates across many projects. We build and test these tools here first, then migrate them to `electric-book-modules` later. Once migrated, we can use these very tests to verify that switching this repo to the remote modules doesn't break PDF layouts.

### Design overview

The test suite is structured as a new `test` command in the `npm run eb` CLI, with a modular architecture that starts with PDF visual regression testing and expands to cover web output, EPUB validation, link checking, and unit tests.

```
_tools-custom/
  run/
    commands/
      test.js                     ← yargs command: `npm run eb -- test`
  test/
    index.js                      ← test orchestrator (loads built-in + custom tests)
    pdf/
      index.js                    ← PDF test runner (orchestrates all PDF tests)
      manifest.js                 ← read/write test config from _data/tests.yml
      fetch.js                    ← resolve in-repo canonical PDFs (optional URL download/cache)
      render.js                   ← PDF → page images (via pdf-to-img)
      report.js                   ← HTML/console report generation
      tests/                      ← individual PDF test modules
        page/
          pixel-match.js          ← page-by-page pixel comparison
          count.js                ← page-count regression check
        file/                     ← (future) structural checks
          size.js                 ← (future) file-size change detection
          metadata.js             ← (future) PDF metadata validation
    web/                          ← (future) Playwright web tests
    epub/                         ← (future) EPUB regression tests
    links/                        ← (future) link-resolution tests
    unit/                         ← (future) unit tests for EBT code
_tools-custom/
  test/                           ← repo-specific custom tests (optional)
    pdf/
      tests/                      ← custom PDF tests loaded via require-all
        grayscale-images.js       ← example: check all images are grayscale
    question-count.js             ← example: non-format-specific custom test
    ...
_data/
  tests.yml                       ← test config: canonical paths, thresholds, languages
_tests/
  pdf/
    canonical/                    ← committed canonical PDFs (<book>[-<language>]-<format>.pdf)
    reports/                      ← generated diff reports (gitignored)
      <book>[-<language>]-<format>/  ← per-target diff images
  .cache/                         ← downloaded canonical cache (gitignored)
  .gitignore
```

### Test configuration in `_data/tests.yml`

Test settings live in `_data/tests.yml`, alongside the existing book metadata in `_data/works/`. This keeps test config where users expect to manage book data, but in a separate file so that canonical paths and thresholds are never exposed in web output metadata. The file is user-editable, but the `--update` command writes canonical entries automatically (`canonical-path`, SHA-256 hash, page count and date). Note that `--update` rewrites the file with js-yaml, so any comments in it are not preserved.

```yaml
# _data/tests.yml
settings:
  threshold: 0.1            # default diff sensitivity: % of pixels per page (0–100)
  dpi: 150                  # rendering resolution for comparison
  formats:                  # default formats to test for all books in this project
    - print-pdf
    - screen-pdf

# Reserved for future custom tests. Leave empty to skip.
custom: {}

books:
  book:
    print-pdf:
      canonical-path: _tests/pdf/canonical/book-print-pdf.pdf
      sha256: "…"
      pages: 7
      updated: "2026-08-21"
    screen-pdf:
      canonical-path: _tests/pdf/canonical/book-screen-pdf.pdf
  samples:
    threshold: 0.05          # optional per-book override (stricter)
    print-pdf:
      canonical-path: _tests/pdf/canonical/samples-print-pdf.pdf
      languages:             # per-language canonicals, named to match build output
        fr:
          canonical-path: _tests/pdf/canonical/samples-fr-print-pdf.pdf
```

### Custom tests in `_tools-custom/test/`

Repo-specific or book-specific tests live in `_tools-custom/test/`, mirroring the EBT modules pattern where `_tools-custom/` is merged into `_tools/` when modules are installed. This means custom tests can add new tests and also replace default test modules. This directory is optional — projects that don't need custom tests simply don't create it.

Custom tests are organised by format (e.g. `_tools-custom/test/pdf/tests/`) to mirror the built-in structure at `_tools-custom/test/pdf/tests/`. Non-format-specific custom tests live directly in `_tools-custom/test/`.

#### How it works

Test modules are auto-discovered at runtime using `require-all` (the same pattern used for transformations in the existing codebase). The PDF runner (`_tools-custom/test/pdf/index.js`) loads every module under `_tools-custom/test/pdf/tests/` (recursively) and runs each one; results are included in the same console/HTML report. Dropping a new module in that folder adds a test, and once `_tools-custom` is merged into `_tools`, a custom module of the same name overrides the built-in one.

> **Status:** module auto-discovery is implemented. The `custom:` config in `_data/tests.yml` (per-book scoping and config passthrough, described below) is planned but not yet wired.

#### Module contract

Each custom test module exports:

```js
// _tools-custom/test/pdf/tests/grayscale-images.js

module.exports = {
  // Human-readable name for reports
  name: 'Grayscale image check',

  // The test function. Receives context and returns results.
  run: async function (context) {
    // context.book    — book slug (string), or null if running for all books
    // context.format  — format string (e.g. 'print-pdf'), or null
    // context.config  — this test's config from _data/tests.yml custom section
    // context.works   — array of all work slugs in the project
    // context.argv    — full CLI argv for access to any option

    const results = []

    // ... test logic here ...

    return {
      passed: results.every(r => r.passed),
      results: results
      // Each result: { passed: bool, message: string }
    }
  }
}
```

#### Scoping to specific books

In `_data/tests.yml`, each custom test entry can include a `books:` array to restrict which books it applies to. If `books:` is omitted, the test runs for all books. The orchestrator handles this filtering — the test module receives only the books it should check.

#### Custom config

Any keys in the test's `_data/tests.yml` entry (other than `books:`) are passed through as `context.config`. This lets users configure test-specific parameters (e.g. `min-answers: 4`) without changing code.

#### Examples of custom tests

- **Grayscale images**: verify all images in `print-pdf` image sets have a grayscale colour profile (using `sharp` or `gm` which is already a dependency).
- **Question count**: check that all `{% include question %}` blocks have exactly N answer options.
- **Required sections**: verify that certain frontmatter `style:` values appear in every book (e.g. every book must have a `copyright-page`).
- **Word count bounds**: flag chapters that exceed a target word count.
- **Translation completeness**: check that a translation has the same number of content files as the source language.

### Phase 1 — PDF visual regression testing

This is the core deliverable. Build in four milestones:

#### Milestone 1.1: CLI scaffolding and test config

**New files:**

- `_tools-custom/run/commands/test.js` — yargs command module (`npm run eb -- test`) using the existing `--format`, `--book` and `--language` options to scope tests:
  ```
  npm run eb -- test                                  # test all configured books/formats
  npm run eb -- test -f print-pdf                     # only print-pdf
  npm run eb -- test -b mybook -f print-pdf           # single book + format
  npm run eb -- test -b mybook -f print-pdf -l fr     # a translation
  npm run eb -- test --update -b mybook -f print-pdf  # update a canonical
  ```
  The `--format`, `--book` and `--language` options already exist and scope tests the same way they scope `output`. When no format is given explicitly, all configured PDF formats run.

- `_data/tests.yml` — user-editable YAML file with test config per book (see structure above). The `--update` command writes canonical entries (`canonical-path`, hash, page count, date) automatically. Stored alongside other `_data/` files where users expect to manage book metadata, but separate from `default.yml` to avoid exposing test data in web output. Supports per-book threshold overrides.

**New CLI options** (defined in the `test` command's `builder` in `_tools-custom/run/commands/test.js`, so they travel with the command through the `_tools-custom` → `_tools` merge without overwriting the shared `options.js`):
- `--update`: flag to update the canonical reference instead of comparing
- `--threshold` / `-g`: diff sensitivity as a % of pixels per page (0–100, default `0.1`); overrides the global and per-book threshold in `_data/tests.yml`

**Tasks:**
1. Create `_tools-custom/run/commands/test.js` as a yargs command module following the existing pattern (exports `command`, `desc`, `builder`, `handler`).
2. Create `_data/tests.yml` with initial structure (empty `books:` section, default `settings:`).
3. Create `_tests/pdf/reports/.gitignore` (ignore everything except `.gitignore`).
4. Define `--update` and `--threshold`/`-g` in the `test` command's `builder`.
5. Create `_tools-custom/test/index.js` that dispatches to a suite based on `--format` (PDF for now); the PDF runner discovers test modules with `require-all`.
6. Create `_tools-custom/test/pdf/manifest.js`:
   - `readTestConfig()` / `writeTestConfig(data)` — parse/write `_data/tests.yml`
   - `getCanonicalEntry(book, format, language)` — look up a specific entry (language optional)
   - `setCanonicalEntry(book, format, language, entry)` — set/update an entry
   - `getThreshold(book)` — per-book threshold, falling back to global
   - `getDpi()`, `getFormats(book)`, `getLanguages(book, format)`

#### Milestone 1.2: PDF rendering and canonical fetching

**Dependencies to add to `package.json`:**
- `pdf-to-img` — renders PDF pages to PNG images (uses pdfjs-dist under the hood, no native deps)
- `pixelmatch` — fast pixel-level image comparison
- `pngjs` — PNG encode/decode (required by pixelmatch)
- `require-all` — auto-discover and load test modules from a directory (already used for transformations in the existing codebase)

Note: `pdf-to-img` (v6) is ESM-only, so it is loaded via a dynamic `import()`; `pixelmatch` is pinned to v5 (CommonJS). `puppeteer` is already a dependency and could render PDFs as an alternative, but `pdf-to-img` is lighter and purpose-built.

**New files:**

- `_tools-custom/test/pdf/render.js`:
  - `renderPages(pdfPath, { dpi })` — returns `{ pages, metadata, length }`, where `pages` is an array of PNG buffers, one per page
  - `readInfo(pdfPath)` — page count and metadata without rendering every page
  - Loads `pdf-to-img` (ESM-only) via dynamic `import()`; scale = dpi / 72 (150 DPI default)

- `_tools-custom/test/pdf/fetch.js`:
  - `getCachedOrFetch(filename, entry, label, updateHint)` — resolves the canonical PDF: a local `canonical-path`, else an optional `canonical-url` (downloaded to `_tests/.cache/<filename>` and SHA-256-verified), else the default in-repo `_tests/pdf/canonical/<filename>`
  - `defaultCanonicalPath(filename)` and `sha256File(path)` helpers
  - Cache location: `_tests/.cache/` (gitignored)

**Tasks:**
1. Add `pdf-to-img`, `pixelmatch`, `pngjs`, `require-all` to `devDependencies`.
2. Create `render.js` with `renderPages()`.
3. Create `fetch.js` with canonical resolution and caching logic.
4. Create `_tests/.cache/.gitignore`.
5. Write a smoke test: render a small PDF and verify page count matches.

#### Milestone 1.3: Page-by-page comparison engine

**New file: `_tools-custom/test/pdf/tests/page/pixel-match.js`**

Core comparison logic:

```
comparePDFs(canonicalPath, currentPath, options)
  → render both PDFs to page images
  → for each page pair:
      if page counts differ → flag added/removed pages
      run pixelmatch with threshold
      compute diff percentage per page
      generate diff image (highlights changes in red)
  → return results object:
      { passed, summary, pages: [{ page, diffPercent, diffPixels, diffImage }] }
```

**Design decisions:**
- **Threshold**: configurable via `--threshold`. A page passes if its diff percentage is below the threshold. Default 0.1% tolerates sub-pixel rendering differences across environments.
- **Page-count changes**: always flagged as a failure. A change in page count likely means text has reflowed.
- **Diff images**: saved as PNGs to `_tests/pdf/reports/<book>-<format>/` for visual inspection.
- **Performance**: pages are compared in sequence (memory-bounded), but multiple books can be tested in parallel at the orchestrator level.

**Tasks:**
1. Create `pixel-match.js` with `comparePDFs()`.
2. Handle edge cases: page count mismatch, missing files, corrupt PDFs.
3. Test with two identical PDFs (should pass) and two different PDFs (should catch differences).

#### Milestone 1.4: Report generation and orchestrator

**New file: `_tools-custom/test/pdf/report.js`**

Two report formats:
- **Console report**: summary table printed to stdout
  ```
  PDF Regression Test Results
  ═══════════════════════════
  ✓ die-rooi-angelier (print-pdf)     248 pages, 0 diffs
  ✗ die-vyf-susters (print-pdf)       192 pages, 3 diffs (pp. 14, 87, 191)
  ✓ die-rooi-angelier (screen-pdf)    248 pages, 0 diffs
  ─────────────────────────────────────
  2 passed, 1 failed
  Report: _tests/pdf/reports/2026-04-09T14-30-00/index.html
  ```
- **HTML report**: visual diff viewer at `_tests/pdf/reports/<timestamp>/index.html`
  - Side-by-side: canonical page | current page | diff overlay
  - Filterable: show only changed pages
  - Self-contained (inline CSS/JS, base64 images) so it can be shared

**New file: `_tools-custom/test/pdf/index.js`**

Orchestrates a full PDF regression run:
```
run(argv)
  → read test config from _data/tests.yml
  → determine which books/formats to test (from argv or all configured)
  → resolve per-book threshold (CLI override > per-book > global default)
  → for each book+format:
      fetch/cache canonical PDF
      locate current PDF in _output/ (builds a new one if missing)
      run comparison
      collect results
  → generate reports
  → exit 0 if all pass, exit 1 if any fail
```

**Update command: `npm run eb -- test --update`**

When `--update` is passed:
- Takes the current PDF in `_output/` for the specified book+format(+language) (builds a new one if missing)
- Computes SHA-256 hash and page count
- Copies the PDF to `_tests/pdf/canonical/<book>[-<language>]-<format>.pdf` and records `canonical-path`, `sha256`, `pages` and `updated` in the book's entry in `_data/tests.yml`
- (Future) When remote storage is enabled (Phase 3), uploads the PDF as a release asset and records a `canonical-url` instead

**Tasks:**
1. Create `report.js` with `consoleReport()` and `htmlReport()`.
2. Create `pdf/index.js` orchestrator.
3. Wire everything into `_tools-custom/test/index.js`.
4. Wire into `_tools-custom/run/commands/test.js`.
5. Add `.gitignore` files so `_tests/pdf/reports/` and `_tests/.cache/` are ignored while `_tests/pdf/canonical/` is committed.
6. End-to-end test with this project's books.

### Phase 2 — Structural PDF checks (quick, no canonical needed)

Lighter checks that don't require a canonical PDF. Run as part of `test -f print-pdf` or standalone:

- **Page count check**: compare page count against the value stored in `_data/tests.yml`. Fast — doesn't need to download the canonical PDF.
- **File size check**: flag if the PDF size changed by more than a configurable percentage (default 10%). Large changes suggest missing fonts, images, or major reflow.
- **Metadata check**: verify PDF title, author, and page dimensions match expected values from `_data/works/` metadata.

These can use `pdf-lib` (lightweight PDF parser, no rendering needed).

### Phase 3 — GitHub Releases for canonical storage

> **Status: not implemented.** Canonicals are currently committed in-repo under `_tests/pdf/canonical/`. The remote-storage design below is retained as future work; `_data/tests.yml` already accepts an optional `canonical-url` for when it lands.

Use GitHub Releases on a dedicated repo (e.g. `electricbookworks/canonical-editions`) as the storage backend for canonical PDFs. Release assets don't count against git repo size, support files up to 2GB, and can be overwritten without history bloat — unlike git-tracked files, which would compound over time (7 books × 2 formats × 30MB = ~420MB per generation).

#### Release structure

One release per project, tagged by project name:

```
canonical-editions repo
  └─ Release: baker-series
       Assets:
         die-rooi-angelier-print-pdf.pdf
         die-rooi-angelier-screen-pdf.pdf
         die-vyf-susters-print-pdf.pdf
         ...
  └─ Release: another-project
       Assets:
         ...
```

Download URLs follow the pattern: `https://github.com/electricbookworks/canonical-editions/releases/download/<tag>/<asset-filename>`

The test runner downloads assets using `$GITHUB_TOKEN` (available in Codespaces and CI) via the GitHub REST API. Anyone with read access to the `canonical-editions` repo can run tests.

#### Codespace integration

The test runner and `--update` command read the repo name from `settings.canonical-repo` in `_data/tests.yml`, defaulting to `electricbookworks/canonical-editions`. Client projects that need separate IP isolation can point to a different repo (e.g. `electricbookworks/client-name-editions`) by changing this setting and the matching `devcontainer.json` entry.

In `.devcontainer/devcontainer.json`, request access to the canonical-editions repo so that Codespaces can download and upload release assets:

```json
{
  "customizations": {
    "codespaces": {
      "repositories": {
        "electricbookworks/canonical-editions": {
          "permissions": {
            "contents": "write"
          }
        }
      }
    }
  }
}
```

The `--update` command detects this environment, uploads the PDF as a release asset using `gh release upload --clobber` (replacing any existing asset of the same name), and writes the download URL back into `_data/tests.yml`.

#### Security note for public repos

It is safe to include the `canonical-editions` repository permission in `devcontainer.json` even in public repos like `electric-book`. The `repositories` block in `devcontainer.json` is a *request*, not a grant. When someone creates a Codespace, GitHub checks whether *that user* already has the requested access on their own GitHub account. If they don't (e.g. an external contributor who forked the repo), the Codespace simply doesn't get a token for that repo. Only users who already have write access to `canonical-editions` on GitHub can upload or overwrite assets — the `devcontainer.json` just saves them from manually configuring a token.

Since `canonical-editions` is a private repo, users without access cannot download release assets either — there are no public URLs to guess. PDF regression tests will fail gracefully for these users with a clear "no access" message, while all other tests (structural checks, web tests, link validation, etc.) continue to work. The `--update` command should handle the "no write access" case gracefully, telling the user to ask a maintainer to update the canonical PDF or to paste the URL into `_data/tests.yml` manually.

### Phase 4 — Web output tests

Add Playwright (preferred over Cypress for headless CI) tests for web output:

```
_tools-custom/test/web/
  index.js           ← start Jekyll server, run tests, shut down
  navigation.js      ← test that all nav links resolve
  content.js         ← test that book pages render expected content
  responsive.js      ← test key pages at multiple viewports
  accessibility.js   ← basic a11y checks (headings, alt text, contrast)
```

Integrate as `npm run eb -- test -f web`.

### Phase 5 — Link and asset validation

```
_tools-custom/test/links/
  index.js
  internal.js        ← verify all internal links in built HTML resolve
  images.js          ← verify all image src paths resolve
  opengraph.js       ← verify og:image URLs are reachable
  external.js        ← (optional) check external URLs aren't 404
```

These tests operate on the built `_site/` output. They can run after any format build.

### Phase 6 — EPUB regression testing

Similar approach to PDF regression, but comparing EPUB contents:

```
_tools-custom/test/epub/
  index.js           ← orchestrator
  extract.js         ← unzip EPUB to temp directory
  compare.js         ← diff XHTML content, CSS, OPF manifest
  report.js          ← report generation
```

EPUB comparison is structural rather than visual:
- Diff the OPF manifest (spine order, metadata changes)
- Diff each XHTML file (content changes, added/removed elements)
- Diff stylesheets
- Flag added/removed files
- Optionally render key pages via Puppeteer for visual comparison

Integrate as `npm run eb -- test -f epub`.

### Phase 7 — Unit tests for EBT code

Add a lightweight test runner (likely `node --test` built-in, or `vitest` for its speed) for unit-testing EBT's own code:

```
_tools-custom/test/unit/
  index.js
  helpers.test.js        ← test utility functions in helpers.js
  merge.test.js          ← test HTML merge logic
  manifest.test.js       ← test manifest read/write
  file-list.test.js      ← test file-list resolution from metadata
```

### Phase 8 — GitHub Actions CI workflow

A reusable workflow (`.github/workflows/test.yml`) that:
1. Checks out the project
2. Installs dependencies (`npm run setup`)
3. Builds outputs for all configured formats
4. Runs `npm run eb -- test`
5. Uploads the HTML report as a workflow artefact
6. Fails the workflow if any test fails

Triggered on push to main/master, or on pull requests that touch book content, styles, or `_includes/`/`_layouts/`. Individual projects can customise triggers.

### Implementation sequence

| Order | Milestone | Effort | Depends on |
|-------|-----------|--------|------------|
| 1     | 1.1 CLI scaffolding + test config | Small | Nothing |
| 2     | 1.2 PDF rendering + fetching | Medium | 1.1 |
| 3     | 1.3 Comparison engine | Medium | 1.2 |
| 4     | 1.4 Reports + orchestrator | Medium | 1.3 |
| 5     | 2 Structural PDF checks | Small | 1.1 |
| 6     | 3 GitHub Releases storage | Medium | 1.4 |
| 7     | 4 Web tests | Large | Working web output |
| 8     | 5 Link validation | Medium | Any build |
| 9     | 6 EPUB regression | Medium | 1.4 pattern |
| 10    | 7 Unit tests | Small | 1.1 |
| 11    | 8 GitHub Actions CI | Medium | All phases |

### Key design principles

1. **Template-first**: for now all new code lives in `_tools-custom/`; it will later be refactored into the consumed modules that install `_tools/`, so it ships with the EBT and rolls out to every project that updates. Designed for later migration to `electric-book-modules`.
2. **Canonical storage**: for now canonical PDFs are committed in-repo under `_tests/pdf/canonical/`. Storing them as GitHub Release assets to avoid repo bloat is planned (Phase 3). Only `_data/tests.yml` and the test code are otherwise needed in the project repo.
3. **User-editable config**: test settings live in `_data/tests.yml`, where users already manage book data. Per-book thresholds let demanding titles use stricter sensitivity.
4. **Reuses existing options**: `--format`, `--book` and `--language` scope tests the same way they scope output. No new option needed for test type.
5. **Progressive**: each phase is independently useful. Phase 1 alone solves the immediate PDF regression problem.
6. **CI-friendly**: all commands return appropriate exit codes. Reports are generated as artefacts. No GUI required.
7. **Standard JS**: all code follows Standard JS syntax (no semicolons), matching the project convention.
8. **Minimal dependencies**: prefer small, focused packages (`pdf-to-img`, `pixelmatch`, `pngjs`) over heavy frameworks.
9. **Extensible via `_tools-custom/test/`**: repo-specific or book-specific tests live in `_tools-custom/test/`, which is merged into `_tools/test/` when modules are installed. Custom modules can add new tests or replace built-in ones. Tests are auto-discovered via `require-all`.