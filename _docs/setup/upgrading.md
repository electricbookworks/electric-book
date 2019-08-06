---
title: Upgrading a project
categories: setup
order: 60
---

# Upgrading a project

The Electric Book template is developing all the time. Sometimes you'll want to add features from later versions into a project built on an earlier version.

This is rarely a simple exercise. Especially while the template is still at v0.x.x, fundamental features like `metadata`-generated tag names and folder structures might change.

So upgrading is a largely manual exercise of knitting your content, styles and templates into a new copy of the template.

Some tips for tackling an upgrade:

1. Back up everything.
2. For the very simplest books, when upgrading between versions that are close together (e.g. from v0.10 to v0.11) you might be able to simply copy `book` folders and `_data/meta.yml` from the old project into a new copy of the template. Check the [changelog](https://github.com/electricbookworks/electric-book/blob/master/CHANGELOG.md) to see whether anything major changed that your project depends on.
3. Your PDF outputs (`print-pdf` in particular) need special attention, because reflow could affect layouts that you've already carefully refined. You may want to use a tool like [diff-pdf](https://vslavik.github.io/diff-pdf/) or Acrobat Pro to compare old and new PDF outputs.

You can read some discussion about upgrades, and see a checklist of possible things to look out for while upgrading, [in the repo's issues](https://github.com/electricbookworks/electric-book/issues/57#issuecomment-303998954).

Here is an example workflow for upgrading that you could adapt as follow for your upgrading projects:

1. Create a new repo from the latest Electric Book template.
2. Unless you really need the built-in samples (aka demo content) for testing, delete the `samples` folder and the `samples` node from `meta.yml`.
3. Manually copy values from `_data/meta.yml` from the old project to your new one.
4. Copy any custom or customised files you created in `_includes` from the old project to the new one.
5. Make a decision whether to use only the new template's `_includes`, or to copy the includes in the old version over the newer ones. We don't recommend keeping the old includes. Either way, you need to watch for changes or bugs in your output, in case the behaviour of includes changed.
6. Copy all fonts, images and text files from the old project to the new one, into the relevant folders (e.g. old `images/print-pdf` images may now go into `images/_source`). Be careful to only copy across actual content files, and retain the new template's default files (like `index.md` and `cover.md`).
7. Decide whether to use the latest template styles or keep your old styles. Especially if you have an existing, page-refined print edition and you want to retain its layout, we recommend copying across your old project's `_sass` partials and book styles, and discarding the new template's ones, to ensure like-for-like output. You're likely to find some bugs either way that you will have to find and fix manually.
8. Copy any content you'd like to keep from the old project's root `index.md` and `README` files into the new template's ones.
9. Output and manually debug.
