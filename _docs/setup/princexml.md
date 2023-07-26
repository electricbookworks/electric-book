---
title: PrinceXML settings
categories: setup
order: 11
---

# PrinceXML settings

Alongside open-source tools, we depend on one proprietary, commercial application called PrinceXML, which is for creating PDFs. (If you're only making ebooks, websites and apps, you don't need Prince.)

The Electric Book template will automatically install PrinceXML's free trial version when you run the 'Install and update dependencies' step in the output script.


## Setting a Prince version

It is important for everyone working on a project to use the same version of Prince, or your team members might get different-looking PDFs. To set the version of Prince for everyone, set it in `package.json`:

```json
  "prince": {
    "version": "11.4"
  }
```

### Non-semver Prince versions

Prince for Books and prince latest builds do not use semantic versioning. If you want to use those, you need a slightly different syntax for setting the Prince version.

For Prince for books, use `books-YYYMMDD`, e.g.:

```json
  "prince": {
    "version": "books-20220701"
  }
```

For a latest build, use `YYYMMDD`, e.g.:

```json
  "prince": {
    "version": "20220701"
  }
```

## Adding a Prince license

In order to use a [fully licensed version of Prince](https://www.princexml.com/purchase/), create a folder in your project called `_prince` and save your purchased `license.dat` file in there.

If you want to change the location of your license file, you can do that in `package.json`. E.g. here we use version `10r7` and save the license file in a very specific place on our machine:

```json
  "prince": {
    "version": "10r7",
    "license": "C:\Users\Jo\Documents\Prince\license.dat"
  }
```
