---
title: Updating project files
categories: setup
order: 60
---

# Updating project files

The Electric Book template is developing all the time. Sometimes you'll want to add features from later versions into a project built on an earlier version.

Or if you're working on a family of projects with common files, you may want to update projects based on changes in another, to keep files in sync.

This is rarely a simple exercise. Especially while the template is still at v0.x.x, fundamental features like `metadata`-generated tag names and folder structures might change.

## Updating manually

So updating is a largely manual exercise of knitting your content, styles and templates into a new copy of the template.

Some tips for tackling an update:

1. Back up everything.
2. For the very simplest books, when updating between versions that are close together (e.g. from v0.10 to v0.11) you might be able to simply copy `book` folders and `_data/works` from the old project into a new copy of the template. Check the [changelog](https://github.com/electricbookworks/electric-book/blob/master/CHANGELOG.md) to see whether anything major changed that your project depends on.
3. Your PDF outputs (`print-pdf` in particular) need special attention, because reflow could affect layouts that you've already carefully refined. You may want to use a tool like [diff-pdf](https://vslavik.github.io/diff-pdf/) or Acrobat Pro to compare old and new PDF outputs.

You can read some discussion about updates, and see a checklist of possible things to look out for while updating, [in the repo's issues](https://github.com/electricbookworks/electric-book/issues/57#issuecomment-303998954).

Here is an example workflow for updating that you could adapt as follow for your updating projects:

1. Create a new repo from the latest Electric Book template.
2. Unless you really need the built-in samples (aka demo content) for testing, delete the `samples` and `_data/works/samples` folders.
3. Manually copy values from `_data/meta.yml` (in old repos) or `_data/works` (newer repos) from the old project to your new one.
4. Copy any custom or customised files you created in `_includes` from the old project to the new one.
5. Make a decision whether to use only the new template's `_includes`, or to copy the includes in the old version over the newer ones. We don't recommend keeping the old includes. Either way, you need to watch for changes or bugs in your output, in case the behaviour of includes changed.
6. Copy all fonts, images and text files from the old project to the new one, into the relevant folders (e.g. old `images/print-pdf` images may now go into `images/_source`). Be careful to only copy across actual content files, and retain the new template's default files (like `index.md` and `cover.md`).
7. Decide whether to use the latest template styles or keep your old styles. Especially if you have an existing, page-refined print edition and you want to retain its layout, we recommend copying across your old project's `_sass` partials and book styles, and discarding the new template's ones, to ensure like-for-like output. You're likely to find some bugs either way that you will have to find and fix manually.
8. Copy any content you'd like to keep from the old project's root `index.md` and `README` files into the new template's ones.
9. Output and manually debug.

## Using the `update` script

The process of updating a project can be made much easier by using the `update.sh` script in `_tools/update`, together with `files.txt`, a list of files to update.

**This is an experimental approach, so be careful.**

The `update.sh` script copies all the files listed in `files.txt` to or from another project. As long as `files.txt` lists every file you need to update, running `update.sh` will work. After running the update, check all the changes to your files (e.g. in a Git diff) to be sure that they are expected changes.

The `files.txt` file should therefore list all files that are common to all the projects you might sync -- so not content files in places like `_data` and `book` folders, or project-specific files in `_includes`. The `files.txt` file can include blank lines and comments on lines that start with `#`.

The `update.sh` script only works on Mac and Linux machines, or on unix terminals in Windows (e.g. Cygwin with rsync installed).

In Terminal (or Cygwin with rsync installed), navigate (`cd`) to `_tools/update` and run the script with at least one argument: the name of the project to or from which you want to update.

For example, in Terminal, in `theeEmpireStrikesBack/_tools/update`, you might enter:

``` sh
./update.sh --to aNewHope
```

That would copy all the common files in `theeEmpireStrikesBack` to `aNewHope`.

If you set only one direction to copy (e.g. `--to`), the other direction (`--from`) is assumed to be the project you're in. The `files.txt` list used is always the one in the current project.

Optionally, add the `--preview` option, which only does a dry run of the update, showing you what files will be changed without actually copying any files:

``` sh
./update.sh --to aNewHope --preview
```

Or to sync two *other* projects with the file list from `theeEmpireStrikesBack`:

``` sh
./update.sh --from returnOfTheJedi --to aNewHope
```
