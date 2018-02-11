---
title: Upgrading a project
categories: setup
order: 6
---

# Upgrading a project

The Electric Book template is developing all the time, hopefully for the better. Sometimes you'll want to add features from later versions into a project built on an earlier version.

This is rarely a simple exercise. Especially while the template is still at v0.x.x, fundamental features like `metadata`-generated tag names and folder structures might change.

Some tips for tackling an upgrade:

1. Backup, or at least do all upgrading and testing in a Git branch.
2. For the very simplest books, upgrading between versions that are close together (e.g. from v0.10 to v0.11) you might be able to simply copy `book` folders and `_data/meta.yml` from the old project into a new template. Check the [changelog](https://github.com/electricbookworks/electric-book/blob/master/CHANGELOG.md) to see whether anything major changed that your project depends on.
3. Your PDF outputs (`print-pdf` in particular) need special attention, because reflow could affect layouts that you've already carefully refined. You may want to use a tool like [diff-pdf](https://vslavik.github.io/diff-pdf/) or Acrobat Pro to compare old and new PDF outputs.

You can read some discussion about upgrades, and see a checklist of possible things to look out for while upgrading, [in the repo's issues](https://github.com/electricbookworks/electric-book/issues/57#issuecomment-303998954).
