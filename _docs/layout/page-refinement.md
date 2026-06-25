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

When a book is laid out into print pages, the text inevitably falls in awkward ways: a paragraph's first line stranded alone at the foot of a page, its last line stranded at the top of the next, or a final line so short it leaves an ugly gap. Traditionally a typesetter fixes these by hand, nudging the letter-spacing of individual paragraphs until the lines reflow neatly. This process is called page refinement.

Our `refine` command does much of this work automatically: it finds these problems in your PDF and writes the small adjustments back into your book's markdown files, so your pages read more cleanly with almost no manual work.

The sections below start with how to run it and review its changes — all you need for everyday work on a book. The later 'Background' and 'Architecture' sections explain how it works internally, and are aimed at developers debugging or extending the template.

## Usage

### Basic usage

```sh
# Detect and fix issues, writing classes to markdown
npm run eb -- refine --book mybook

# Preview issues without modifying files
npm run eb -- refine --book mybook --dry-run

# Apply fixes and produce a highlighted PDF showing the changes
npm run eb -- refine --book mybook --highlight

# Use the PDF.js fallback instead of Prince
npm run eb -- refine --book mybook --refine-method=pdfjs

# Refine a translation
npm run eb -- refine --book mybook --language fr
```

> **Note:** Auto-refinement requires merged HTML, which Prince renders in a single pass over the whole book. Projects that use `--merged false` to pass separate HTML files to Prince are not supported.

### Typical workflow

1. Generate the print PDF as usual:

   ```sh
   npm run eb -- output --format print-pdf --book mybook
   ```

2. Run the refine command in dry-run mode to review detected issues:

   ```sh
   npm run eb -- refine --book mybook --dry-run
   ```

   A dry run doesn't make any changes to your markdown. This process generates a PDF with `-detection` at the end of the filename.

3. Produce a highlighted PDF to see exactly which paragraphs would be changed (see [Reviewing changes with highlighting](#reviewing-changes-with-highlighting) below):

   ```sh
   npm run eb -- refine --book mybook --highlight
   ```

   Without `--dry-run` in the command, this applies classes to your markdown. It generates a PDF with `-refined` at the end of the filename, and the affected elements highlighted.

4. If the report and highlighted PDF look reasonable, run without `--dry-run` to apply changes:

   ```sh
   npm run eb -- refine --book mybook
   ```

   This also generates a PDF with `-refined` in the filename, but with no highlighting.

5. Review the changes in your markdown source files (use `git diff`).

6. Re-render the PDF as usual to verify the fixes in a normally named PDF:

   ```sh
   npm run eb -- output --format print-pdf --book mybook
   ```

7. Repeat as needed — some fixes may introduce new issues elsewhere.

### Reviewing changes with highlighting

The `--highlight` option applies fixes as usual **and** produces a PDF with colour-coded backgrounds on the affected paragraphs, so you can see at a glance where the refiner has acted:

```sh
npm run eb -- refine --book mybook --highlight
```

The colours are:

- **Pale blue** (`#d6eaff`): paragraphs where a tighten class was applied
- **Pale orange** (`#ffedcc`): paragraphs where a loosen class was applied
- **Pale green** (`#d8f0d8`): openers where space was added to fix a lone-line-bottom or lone-line-top (an `add-n` class)
- **Pale pink** (`#ffd6d6`): detected issues that could not be fixed

Like a normal refine run, highlighting writes the tighten/loosen and `add-n` classes into your markdown — it is *not* a read-only preview. It additionally injects the highlight styles into the merged HTML so the affected paragraphs are colour-coded in the `-refined` PDF. To preview the refiner's decisions *without* changing any files, use `--dry-run`, which produces a `-detection` PDF and the report but no highlighting. Open the highlighted PDF alongside the dry-run report to confirm the changes are sensible, then `git diff` your markdown to review what was applied.

### Reading the output

The refine command prints a numbered list of detected issues, sorted by severity. Each line shows:

```
N. [sev S LABEL] p.PAGE | FILE.md:LINE | tighten-N | STATUS [method]
   "text preview..."
```

Where:

- **sev S**: severity score (1–7)
- **LABEL**: human-readable issue type (e.g. `LONE-LINE-TOP narrow (verso)`)
- **p.PAGE**: the PDF page number
- **FILE.md:LINE**: the source markdown file and line number (if mapped)
- **tighten-N** or **loosen-N**: the applied class
- **STATUS**: `APPLIED`, `READY` (mapped but not yet applied in dry-run), or `UNMAPPED`
- **method**: `fingerprint` or `text` (the matching method used)

Unmapped issues are typically in content that doesn't correspond to a source markdown paragraph (e.g. auto-generated tables of contents, frontmatter, or index entries generated from data files).

The output may also include `REFINE_SPACING` lines reporting paragraphs with wide word spacing, for manual review.

## Background

When producing print PDFs, page layout inevitably introduces *lone lines* and *short last lines* — typographic problems that arise when text is flowed into fixed-size pages. A lone line is a paragraph's first line stranded alone at the bottom of a page (a *lone-line-bottom*), or its last line stranded alone at the top of the next (a *lone-line-top*). Traditionally, a human typesetter fixes these by adjusting letter-spacing on individual paragraphs (tightening or loosening) until the problem resolves. In the Electric Book workflow, this is done by adding kramdown inline-attribute-list (IAL) classes like `{:.tighten-5}` or `{:.loosen-2}` to paragraphs in the source markdown.

For books with hundreds of pages, this manual process is tedious and error-prone. The `eb refine` command automates it: it detects layout problems during PDF rendering and writes the appropriate tighten/loosen classes back to the source markdown files.

### Definitions

These typographic terms have specific meanings in this context:

- **Lone-line-bottom**: a paragraph whose first line appears alone at the bottom of a page, with the rest of the paragraph continuing on the next page.
- **Lone-line-top**: a paragraph whose last line appears alone at the top of a page. It may be *wide* (more than half the measure) or *narrow* (half the measure or less). Narrow lone-line-tops are worse.
- **Short last line**: a paragraph whose final line contains very few characters (roughly five or fewer), creating an awkward visual gap.
- **Recto/verso**: right-hand (odd-numbered) and left-hand (even-numbered) pages. Problems on verso pages are generally considered more severe because readers see them first when turning pages.

> **A note on terminology.** These problems are traditionally called *widows* and *orphans*, but people disagree about which is which — some use the terms the opposite way round, and many can't remember whether an orphan is a lone line at the top or the bottom of a page. To avoid that ambiguity, these docs and the refine code use *lone-line-top* and *lone-line-bottom* throughout. (A lone-line-bottom is the traditional 'widow'; a lone-line-top is the traditional 'orphan'. See [electric-book#162](https://github.com/electricbookworks/electric-book/issues/162) for the conventions this follows.)

### Severity scoring

Issues are scored on a 1–7 scale, following the heuristics proposed in [electric-book#162](https://github.com/electricbookworks/electric-book/issues/162):

| Score | Issue |
|---|---|
| 1 | Short last line |
| 2 | Lone-line-bottom on a verso (left) page |
| 3 | Lone-line-bottom on a recto (right) page |
| 4 | Wide lone-line-top on a recto page |
| 5 | Wide lone-line-top on a verso page |
| 6 | Narrow lone-line-top on a recto page |
| 7 | Narrow lone-line-top on a verso page |

### How tighten and loosen classes work

The Electric Book template's CSS defines classes `.tighten-1` through `.tighten-100` and `.loosen-1` through `.loosen-100`. Each class adjusts `letter-spacing` by N × 0.001em. For example, `{:.tighten-5}` reduces letter-spacing by 0.005em. Values above about 10 (0.01em) are generally noticeable to careful readers.

## Architecture

The refine command uses a hybrid approach:

1. **Prince-side detection** (default): a JavaScript file is injected into the merged HTML before Prince renders the PDF. This script uses Prince's [Box Tracking API](https://www.princexml.com/doc/javascript/#the-box-tracking-api) and [`registerPostLayoutFunc`](https://www.princexml.com/doc/javascript/#multi-pass-formatting) to inspect the layout after each pass, detect problems, and apply tighten or loosen classes directly to the DOM. Prince then re-layouts the document with the modifications applied. The script also logs a structured manifest of every change to stdout. The refine command calls the same `runPrince` helper used by `eb output`, so the PDF rendered during refinement matches the real output exactly (same Prince options, stylesheet resolution, variant support, and error handling). The `max-passes` is raised from 3 to 45 to give the detection script room to iterate.

2. **Node-side persistence**: after Prince completes, the Node.js orchestrator parses the manifest, matches each changed element back to its source markdown paragraph using text fingerprints, and writes the corresponding `{:.tighten-N}` or `{:.loosen-N}` IAL classes into the markdown files.

This approach has two key advantages over external PDF analysis:

- **Accuracy**: Prince has direct access to the layout model — exact line counts, box positions, and page assignments for each element.
- **Immediate verification**: because Prince re-layouts after each modification, the script can verify that its changes actually resolve the issues. It runs up to 45 passes (configurable via `--max-passes`), with up to 40 fix passes, a verification sweep, and settle passes.

### Source mapping with fingerprints

To map Prince's DOM changes back to markdown paragraphs, the system computes a *fingerprint* for each element: a string combining the element's parent tag, sibling index, tag name, and slugified opening/closing text. For example, a paragraph might have the fingerprint `DIV-3-P-2-itwasthebestoftimes-greeofcomparisononly`.

On the Node side, the same slugification is applied to each markdown paragraph's text, and the opening/closing slugs are compared. This is more reliable than full-text fuzzy matching because it uses short, position-anchored strings that survive the markdown→HTML transformation.

### One-fix-per-pass and verification

The Prince-side script applies one fix per wrapper chain per layout pass, then triggers a new pass. A *wrapper chain* is a run of continuous content that reflows together: a sequence of `div.wrapper` elements connected by the `.continued` class, typically corresponding to a single chapter or section. Because each chain reflows independently of the others, a tighten or loosen in one chain cannot disturb another, so multiple fixes can be applied simultaneously in the same pass as long as they are in different chains. Re-laying out after each pass ensures each fix is evaluated against fresh layout data, since fixing one issue can resolve or create others within the same chain. After each pass, the script verifies the previous fix:

- **Resolved**: the issue is gone. The script checks for regression (see below) and proceeds to the next issue.
- **Escalated**: the issue persists. The script jumps to a higher tighten/loosen value (two-step escalation: preferred value → maximum value) and re-verifies on the next pass.
- **Gave up**: the maximum value was reached and the issue still persists. The fix is undone and the element is skipped for that issue type.

### Catalogue and cascade analysis

Before applying a fix, the script builds a *catalogue* of all paragraphs in the document. For each, it records:

- Whether it has a layout issue (lone line at top or bottom of a page).
- Whether it is *fragile* — two lines on its first or last page, meaning one line shift could create a new issue.
- Whether a nearby fix candidate exists for each fragile element.

The `shouldFix()` function checks downstream fragile elements within the same *wrapper chain* (the run of continuous content defined under [One-fix-per-pass and verification](#one-fix-per-pass-and-verification) above). Tightening a paragraph can only cascade reflow within its own wrapper chain, so the script scopes cascade analysis to those boundaries. It compares the severity of the current issue against the risk of creating a new one. A fix proceeds only if the issue's severity outweighs the cascade risk.

Because wrapper chains are independent, the script can apply one fix per chain per pass. This is much more efficient than one fix per pass globally — a book with many short chapters can fix several issues in parallel.

### Fix sequencing by severity

Lone-line-bottoms (severity 2–3) are the least severe lone-line issue, ranking below every lone-line-top (severity 4–7). Within a wrapper chain, the script will not attempt to fix a lone-line-bottom while any strictly-more-severe issue in that chain is still *actionable* (detected and not yet given up). The lone-line-bottom is *deferred*, not skipped: once the chain's higher-severity issues are resolved or abandoned, it is reconsidered on a later pass. This mirrors how a human typesetter works — settle the lone-line-tops first, since fixing them often reflows the page enough to resolve a lone-line-bottom for free, and avoids spending a fix that a later, higher-priority fix would only disturb.

### Regression detection

After a fix is verified as resolved, the script checks whether it caused a same-or-worse problem on the *issue paragraph itself*, comparing on the canonical 1–7 severity scale:

- **Same element**: if the fix turned the issue paragraph itself into a lone-line issue of the other kind whose severity equals or exceeds the original, the fix is undone and the element is skipped for the original issue type only (so other issue types on the same element can still be addressed).

Fixes that *relocate* a problem elsewhere in the same wrapper chain (rather than onto the issue paragraph itself) are caught later by the verification sweep, once the layout has fully settled — see below.

### Verification sweep

After all fix passes complete (or the pass budget of 40 is exhausted), the script runs a verification sweep against the final, settled layout. It iterates a de-duplicated snapshot of all tracked fixes and applies two do-no-harm checks to each:

- **Issue returned**: if the target issue the fix was meant to resolve is present again (because a later fix reflowed the page), the fix is undone. The element is then skipped for that issue type, so the resume pass does not simply re-apply the same fix and re-trigger the same undo on the next sweep.
- **Problem relocated**: each fix records a snapshot of the lone-line issues present in its wrapper chain *before* it was applied. If the settled layout now shows a new lone-line issue anywhere in that chain — one absent from the pre-fix snapshot, on an element other than the resolved target, and not one the script deliberately gave up on — the fix merely moved the blemish elsewhere in the chapter. Because the sweep runs only once fixing has stalled, the layout is final: there are no transient mid-run issues to misjudge, so genuine relocations are handled without sacrificing good fixes. The script then tries to *salvage* the original fix rather than discard it: if the relocated problem is a lone-line-top, it adds a downward shift (`add-n` on the chapter opener) to absorb that lone-line-top while keeping the line the original fix saved. This shift is itself recorded and re-verified on the next sweep, so an `add-n` that merely cancels out the `tighten` it was meant to complement (re-creating the original issue) is undone in turn. If no shift resolves it — or the relocated problem is a lone-line-bottom — the relocating fix is undone instead.

Whenever a sweep removes a fix or adds a salvage shift, the layout has changed, so fixing resumes (budget permitting) and the sweep runs again against the new layout. This repeats until a sweep makes no changes at all, ensuring late-applied fixes — including ones added after the pass budget was reached — are themselves verified. Because each undone fix is skipped on subsequent passes, the sweep always converges rather than oscillating between undoing and re-applying the same fix.

### Word-spacing detection

The script also detects lines with unusually wide word spacing, which can occur when justified text has few words on a line. It uses a character-density ratio: for each line, it compares the character count per unit width to the paragraph average. Lines below a threshold ratio (currently 0.90) are flagged. These are reported as `REFINE_SPACING` lines in the output but are not automatically fixed.

### Highlight mode

The `--highlight` option applies fixes exactly as a normal refine run does — writing tighten/loosen and `add-n` classes to the source markdown — and additionally produces a `-refined` PDF with colour-coded backgrounds on the affected paragraphs. After the classes are applied and the PDF rebuilt, the orchestrator injects CSS highlight styles plus a highlight-only detection script into the merged HTML, renders the highlighted PDF, then removes them. It is not a read-only mode; use `--dry-run` for a preview that changes no files. See [Reviewing changes with highlighting](#reviewing-changes-with-highlighting) above for the colour key and usage.

```sh
npm run eb -- refine --book mybook --highlight
```

### Fallback: PDF.js analysis

An alternative approach uses [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) to parse an existing PDF and detect issues heuristically from text positions. This is less accurate than the Prince-native approach (it cannot count exact lines per element) but works when Prince's JavaScript support is unavailable. Use `--refine-method=pdfjs` to select it.

## Files

All refine code lives in `_tools/run/` within the electric-book-modules package:

| File | Purpose |
|---|---|
| `commands/refine.js` | Yargs command entry point |
| `helpers/refine/index.js` | Orchestrator — coordinates the Prince and PDF.js pipelines |
| `helpers/lib/runPrince.js` | Shared Prince runner (used by both `eb output` and `eb refine`) |
| `helpers/lib/pdfPipeline.js` | Shared post-Jekyll PDF build pipeline |
| `helpers/refine/prince-refine.prince` | Prince-side detection script (ES5 JavaScript) |
| `helpers/refine/injectScript.js` | Injects/removes the Prince script from merged HTML |
| `helpers/refine/parseManifest.js` | Parses the structured manifest from Prince's stdout |
| `helpers/refine/mapToSource.js` | Fingerprint and fuzzy-text matching to source markdown |
| `helpers/refine/applyClasses.js` | Writes `{:.tighten-N}` IALs into markdown files |
| `helpers/refine/parsePdf.js` | PDF.js parser (fallback method) |
| `helpers/refine/detectIssues.js` | Heuristic issue detection from PDF text positions (fallback) |

The Prince script file uses a `.prince` extension (not `.js`) to prevent Node's `require-all` from attempting to load it as a Node module.

## Current limitations

- **Unmapped elements**: content generated during the build process (auto-generated TOC, dynamic indexes, footnote numbering) cannot be mapped back to a single source paragraph. These appear as UNMAPPED in the report and must be handled manually.
- **False positives**: very short paragraphs (e.g. figure captions, list items with few words) may be flagged as short-line issues when they are in fact acceptable.
- **Single-pass tighten estimation**: the tighten value is estimated from line count (short paragraphs get more tightening). A more sophisticated approach would calculate the exact amount needed based on the overflow.
- **Word-spacing detection is advisory only**: wide word-spacing is detected and reported, but not automatically fixed.
- **Non-justified text**: short-line detection for non-justified (e.g. ragged-right) text is not yet implemented.

## Future development

Potential improvements, roughly in priority order:

1. **Saving vertical space at openers**: the `add-n` strategy — adding whole lines of space at a chapter opening to shift the page break and resolve a lone-line-bottom or lone-line-top — is already used for both. The complementary `save-n` strategy — *removing* space to pull content back — is deliberately not applied, because the chapter-opener design has no slack to remove between the heading and the first paragraph. Revisiting this would require a layout that reserves removable space at openers, and is project-specific since it depends on the book's chapter-opener design.
2. **Smarter tighten/loosen values**: calculate the exact letter-spacing adjustment needed to gain or lose one line, rather than estimating from paragraph length.
3. **Configurable thresholds**: let users set minimum severity, maximum tighten value, and which issue types to fix via project settings or command-line options.
4. **Report-only mode**: generate a standalone report (e.g. JSON or CSV) of all issues without applying any changes, for editorial review.
5. **Undo support**: a command to remove all machine-applied tighten/loosen classes from source files, restoring them to their original state.
6. **Re-refinement**: when text has been edited after refinement causing reflow, the system should detect stale tighten/loosen classes and replace or remove them rather than skipping elements that already have a refinement class. This would allow `eb refine` to be re-run safely after editorial changes.
7. **Integration with `eb output`**: optionally run refinement as part of the PDF output pipeline, rather than as a separate command.
8. **Better page-number awareness**: account for front-matter page-numbering schemes (roman numerals, unnumbered pages) when determining recto/verso.
9. **Improved false-positive filtering**: skip elements that are inherently short (captions, list items, headings) or that are inside figures, tables, or other block-level containers where tightening would be inappropriate.
10. **Non-justified short-line detection**: detect lines ending well short of the measure in ragged-right text.
11. **Per-language word-spacing thresholds**: languages with long compound words (e.g. German) may need different density-ratio thresholds, configurable in `settings.yml` or `locales.yml`.
12. **Automatic word-spacing fixes**: apply tighten/loosen classes to reduce wide word-spacing, rather than only reporting it.
