---
title: Testing PDFs
categories: testing
order: 2
---

# Testing PDFs
{:.no_toc}

* Page contents
{:toc}

We put a lot of care into PDF page layout. A small change to a stylesheet can quietly shift text onto the next page in a book you weren't even working on. A PDF test catches that for you: it compares your latest PDF against a copy you've already approved, and shows you what's different.

## How it works

For each book and format you want to watch, you keep one approved PDF as the reference. This is called the *canonical* PDF, and it lives in the `_tests/pdf/canonical` folder. When you run a test, the template builds (or reuses) your latest PDF and compares it to the reference, page by page. If nothing has moved, the test passes. If something has shifted, the test fails and points you to the pages that changed.

The list of books, formats, and reference PDFs lives in a settings file at `_data/tests.yml`. You can read it, but you don't usually edit it by hand – the update command does that for you.

## Running a test

To test everything that's set up, run:

```
npm run eb -- test
```

You can narrow it down the same way you narrow an output command, with `--book` and `--format`:

```
npm run eb -- test --book samples --format print-pdf
```

For a translation, add `--language` and the language code:

```
npm run eb -- test --book samples --format print-pdf --language fr
```

You only need `--language` for translations. For a book's main language, leave it off.

If there's no current PDF to compare against, the template builds one for you first, so a test can take a few minutes on a big book. That's normal.

## Reading the results

When the test finishes, you get a short summary in the terminal, something like this:

```
PDF Regression Test Results
═══════════════════════════
✓ samples — fr (print-pdf)            47 pages, 0 diffs
✗ samples (print-pdf)                 153 pages, 3 diffs (pp. 63, 64, 65)
─────────────────────────────────────
1 passed, 1 failed
Report: _tests/pdf/reports/2026-08-28T14-30-00/index.html
```

A tick means the PDF matches its reference. A cross means something changed, and the line tells you how many pages differ and which ones.

For a closer look, open the report file listed at the end in your browser. It shows each changed page three ways, side by side: the reference, your new version, and a highlighted view of the difference. You can tick a box to hide the pages that didn't change, so you only see what matters.

## When a test fails

A failed test isn't always bad news. It just means the PDF changed, and your job is to decide whether you meant it to.

Two things can make a test fail. The page count might have changed, which almost always means text has reflowed somewhere and is worth a careful look. Or the pages might look different, and the report shows you exactly where.

If the change is one you intended – say you reworked a chapter on purpose – then the new PDF is correct, and you'll want to save it as the new reference. If the change is a surprise, that's the test doing its job: find out what caused it before you carry on.

## Saving a new reference PDF

When you're sure a new PDF is correct, save it as the reference with `--update`:

```
npm run eb -- test --update --book samples --format print-pdf
```

This **copies your latest PDF** into the `canonical` folder and records its details in the settings file. From then on, tests compare against this new version.

Only do this when you're sure the new PDF is the one you want to test against. Updating tells the template 'this is now correct'. If you update by mistake, you make the wrong PDF the reference, and later tests will trust it. When in doubt, open the PDF and check it first.

## 'Canonical PDF check failed'

Before it runs any tests, the template checks that the reference PDFs in the `canonical` folder still match what's recorded in the settings file. If they don't, you'll see a message that starts with 'Canonical PDF check failed', naming the book and PDF involved.

This usually means a reference PDF was changed or added by hand instead of through the update command. The message tells you how to put it right:

- If the PDF now in the `canonical` folder is the correct one to test against, run the update command it suggests, so its details are recorded properly.
- If it isn't – for example, it was copied there by mistake – put the correct PDF back instead. Don't run the update command, or you'll lock in the wrong reference.

## Where things live

- `_tests/pdf/canonical` – the approved reference PDFs. These are kept in the project, so the whole team shares the same references.
- `_tests/pdf/reports` – the reports from each test run. These are just for you, and aren't saved to the project.
- `_data/tests.yml` – the settings: which books and formats to test, and the details of each reference PDF.

## Fine-tuning sensitivity

Tiny differences can creep in between computers, so a page is allowed to differ by a small amount before it counts as changed. The default is a tenth of a per cent of the pixels on a page. To be stricter or more forgiving for a single run, use `--threshold` with a percentage:

```
npm run eb -- test --book samples --format print-pdf --threshold 0.05
```

You can also set a default threshold for a book in `_data/tests.yml`.
