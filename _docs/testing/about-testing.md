---
title: About testing
categories: testing
order: 1
---

# About testing

When you change a book's design, its styles, or code that several books share, it's easy to fix one book and accidentally break another. Testing helps you catch those surprises before they reach a printer or a reader.

The Electric Book template is growing a set of tests you can run from the command line, alongside the usual output commands. The first one checks your PDFs, and more will follow.

## What you can test today

For now, there's one kind of test:

- [Testing PDFs](pdf-tests.html) compares a new PDF against a saved reference copy, page by page, and tells you what changed.

## What's coming

We're adding testing in stages. In time we plan to add checks for web output, EPUBs, and whether the links in your books still work. Each one will be documented here as it arrives.

If you make print or screen PDFs, the PDF tests are the place to start.
