---
title: Page refinement
categories:
  - layout
order: 8
---

# Automatic page refinement
{:.no_toc}

* Page contents
{:toc}

## Background

When producing print PDFs, page layout inevitably introduces *widows*, *orphans*, and *short last lines* — typographic problems that arise when text is flowed into fixed-size pages. Traditionally, a human typesetter fixes these by adjusting letter-spacing on individual paragraphs (tightening or loosening) until the problem resolves. In the Electric Book workflow, this is done by adding kramdown inline-attribute-list (IAL) classes like `{:.tighten-5}` or `{:.loosen-2}` to paragraphs in the source markdown.

For books with hundreds of pages, this manual process is tedious and error-prone. The `eb refine` command automates it: it detects layout problems during PDF rendering and writes the appropriate tighten/loosen classes back to the source markdown files.

### Definitions

These typographic terms have specific meanings in this context:

- **Widow**: a paragraph whose first line appears alone at the bottom of a page, with the rest of the paragraph continuing on the next page. (Some sources define this differently; we follow the convention in [electric-book#162](https://github.com/electricbookworks/electric-book/issues/162).)
- **Orphan**: a paragraph whose last line appears alone at the top of a page. An orphan may be *wide* (more than half the measure) or *narrow* (half the measure or less). Narrow orphans are worse.
- **Short last line**: a paragraph whose final line contains very few characters (roughly five or fewer), creating an awkward visual gap.
- **Recto/verso**: right-hand (odd-numbered) and left-hand (even-numbered) pages. Problems on verso pages are generally considered more severe because readers see them first when turning pages.

### Severity scoring

Issues are scored on a 1–7 scale, following the heuristics proposed in [electric-book#162](https://github.com/electricbookworks/electric-book/issues/162):

| Score | Issue |
|---|---|
| 1 | Short last line |
| 2 | Widow on a verso (left) page |
| 3 | Widow on a recto (right) page |
| 4 | Wide orphan on a recto page |
| 5 | Wide orphan on a verso page |
| 6 | Narrow orphan on a recto page |
| 7 | Narrow orphan on a verso page |

### How tighten and loosen classes work

The Electric Book template's CSS defines classes `.tighten-1` through `.tighten-100` and `.loosen-1` through `.loosen-100`. Each class adjusts `letter-spacing` by N × 0.001em. For example, `{:.tighten-5}` reduces letter-spacing by 0.005em. Values above about 10 (0.01em) are generally noticeable to careful readers.

## Architecture

The refine command uses a hybrid approach:

1. **Prince-side detection** (default): a JavaScript file is injected into the merged HTML before Prince renders the PDF. This script uses Prince's [Box Tracking API](https://www.princexml.com/doc/javascript/#the-box-tracking-api) and [`registerPostLayoutFunc`](https://www.princexml.com/doc/javascript/#multi-pass-formatting) to inspect the layout after each pass, detect problems, and add tighten classes directly to the DOM. Prince then re-layouts the document with the modifications applied. The script also logs a structured manifest of every change to stdout. The refine command calls the same `runPrince` helper used by `eb output`, so the PDF rendered during refinement matches the real output exactly (same Prince options, stylesheet resolution, variant support, and error handling). The only difference is that `max-passes` is raised from 3 to 5 to give the detection script room to iterate.

2. **Node-side persistence**: after Prince completes, the Node.js orchestrator parses the manifest, matches each changed element back to its source markdown paragraph using text fingerprints, and writes the corresponding `{:.tighten-N}` IAL classes into the markdown files.

This approach has two key advantages over external PDF analysis:

- **Accuracy**: Prince has direct access to the layout model — exact line counts, box positions, and page assignments for each element.
- **Immediate verification**: because Prince re-layouts after each modification, the script can verify that its changes actually resolve the issues. It runs up to five passes (configurable via `--max-passes`).

### Source mapping with fingerprints

To map Prince's DOM changes back to markdown paragraphs, the system computes a *fingerprint* for each element: a string combining the element's parent tag, sibling index, tag name, and slugified opening/closing text. For example, a paragraph might have the fingerprint `DIV-3-P-2-itwasthebestoftimes-greeofcomparisononly`.

On the Node side, the same slugification is applied to each markdown paragraph's text, and the opening/closing slugs are compared. This is more reliable than full-text fuzzy matching because it uses short, position-anchored strings that survive the markdown→HTML transformation.

### Fallback: PDF.js analysis

An alternative approach uses [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) to parse an existing PDF and detect issues heuristically from text positions. This is less accurate than the Prince-native approach (it cannot count exact lines per element) but works when Prince's JavaScript support is unavailable. Use `--refine-method=pdfjs` to select it.

## Usage

### Prerequisites

- A project with a working print-pdf output pipeline
- Prince XML installed (version 14 or later recommended)
- The merged HTML must exist in `_site/<book>/merged.html` (generated by `eb output`). Projects that use `--merged false` to pass separate HTML files to Prince are not supported by auto-refinement.

### Basic usage

```sh
# Detect and fix issues, writing classes to markdown
npm run eb -- refine --book mybook

# Preview issues without modifying files
npm run eb -- refine --book mybook --dry-run

# Use the PDF.js fallback instead of Prince
npm run eb -- refine --book mybook --refine-method=pdfjs

# Refine a translation
npm run eb -- refine --book mybook --language fr
```

### Typical workflow

1. Generate the print PDF as usual:

   ```sh
   npm run eb -- output --format print-pdf --book mybook
   ```

2. Run the refine command in dry-run mode to review detected issues:

   ```sh
   npm run eb -- refine --book mybook --dry-run
   ```

3. If the report looks reasonable, run without `--dry-run` to apply changes:

   ```sh
   npm run eb -- refine --book mybook
   ```

4. Review the changes in your markdown source files (use `git diff`).

5. Re-render the PDF to verify the fixes:

   ```sh
   npm run eb -- output --format print-pdf --book mybook
   ```

6. Repeat as needed — some fixes may introduce new issues elsewhere.

### Reading the output

The refine command prints a numbered list of detected issues, sorted by severity. Each line shows:

```
N. [sev S LABEL] p.PAGE | FILE.md:LINE | tighten-N | STATUS [method]
   "text preview..."
```

Where:

- **sev S**: severity score (1–7)
- **LABEL**: human-readable issue type (e.g. `ORPHAN narrow (verso)`)
- **p.PAGE**: the PDF page number
- **FILE.md:LINE**: the source markdown file and line number (if mapped)
- **tighten-N**: the suggested class
- **STATUS**: `APPLIED`, `READY` (mapped but not yet applied in dry-run), or `UNMAPPED`
- **method**: `fingerprint` or `text` (the matching method used)

Unmapped issues are typically in content that doesn't correspond to a source markdown paragraph (e.g. auto-generated tables of contents, frontmatter, or index entries generated from data files).

## Files

All refine code lives in `_tools/run/` within the electric-book-modules package:

| File | Purpose |
|---|---|
| `commands/refine.js` | Yargs command entry point |
| `helpers/lib/refine/index.js` | Orchestrator — coordinates the Prince and PDF.js pipelines |
| `helpers/lib/runPrince.js` | Shared Prince runner (used by both `eb output` and `eb refine`) |
| `helpers/lib/refine/prince-refine.prince` | Prince-side detection script (ES5 JavaScript) |
| `helpers/lib/refine/injectScript.js` | Injects/removes the Prince script from merged HTML |
| `helpers/lib/refine/parseManifest.js` | Parses the structured manifest from Prince's stdout |
| `helpers/lib/refine/mapToSource.js` | Fingerprint and fuzzy-text matching to source markdown |
| `helpers/lib/refine/applyClasses.js` | Writes `{:.tighten-N}` IALs into markdown files |
| `helpers/lib/refine/parsePdf.js` | PDF.js parser (fallback method) |
| `helpers/lib/refine/detectIssues.js` | Heuristic issue detection from PDF text positions (fallback) |

The Prince script file uses a `.prince` extension (not `.js`) to prevent Node's `require-all` from attempting to load it as a Node module.

## Current limitations

These are known limitations as of the initial implementation:

- **Tighten only**: the system currently only applies tighten classes. Some issues may be better resolved by loosening the preceding paragraph instead. This is a planned improvement.
- **No iterative loop**: the command must be run manually after each render. A future version could automate the render→refine→render cycle until the layout stabilises.
- **Unmapped elements**: content generated during the build process (auto-generated TOC, dynamic indexes, footnote numbering) cannot be mapped back to a single source paragraph. These appear as UNMAPPED in the report and must be handled manually.
- **False positives**: very short paragraphs (e.g. figure captions, list items with few words) may be flagged as short-line issues when they are in fact acceptable.
- **Single-pass tighten estimation**: the tighten value is estimated from line count (short paragraphs get more tightening). A more sophisticated approach would calculate the exact amount needed based on the overflow.
- **No support for loosen classes**: currently, if tightening a paragraph doesn't resolve the issue, the system cannot try loosening a nearby paragraph as an alternative strategy.

## Future development

Potential improvements, roughly in priority order:

1. **Loosen support**: when tightening the problem paragraph doesn't help, loosen the paragraph above or below it.
2. **Iterative refinement loop**: automatically re-render and re-detect until no new issues appear or a maximum iteration count is reached.
3. **Smarter tighten/loosen values**: calculate the exact letter-spacing adjustment needed to gain or lose one line, rather than estimating from paragraph length.
4. **Configurable thresholds**: let users set minimum severity, maximum tighten value, and which issue types to fix via project settings or command-line options.
5. **Report-only mode**: generate a standalone report (e.g. JSON or CSV) of all issues without applying any changes, for editorial review.
6. **Undo support**: a command to remove all machine-applied tighten/loosen classes from source files, restoring them to their original state.
7. **Re-refinement**: when text has been edited after refinement causing reflow, the system should detect stale tighten/loosen classes and replace or remove them rather than skipping elements that already have a refinement class. This would allow `eb refine` to be re-run safely after editorial changes.
8. **Integration with `eb output`**: optionally run refinement as part of the PDF output pipeline, rather than as a separate command.
8. **Better page-number awareness**: account for front-matter page-numbering schemes (roman numerals, unnumbered pages) when determining recto/verso.
9. **Improved false-positive filtering**: skip elements that are inherently short (captions, list items, headings) or that are inside figures, tables, or other block-level containers where tightening would be inappropriate.
