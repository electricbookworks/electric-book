---
title: Word output
categories: output
order: 5
---

# Word output
{:.no_toc}

* Page contents
{:toc}

You can export a book format to Word by running the output script with the `export` command, and your book folder for the `book` option, e.g.:

```shell
npm run electric-book -- export --book great-expectations
```

Word output is a conversion to MS Word from one of the other output formats. Our script generates your book in a format you choose (e.g. the print PDF version) and then converts the content into MS Word files.

Word output requires that you have [Pandoc](https://pandoc.org/) installed.

If you have SVGs in your book, you should also have rsvg-convert installed. This usually comes with Mac and Linux already, and only needs to be [installed separately on Windows](https://community.chocolatey.org/packages/rsvg-convert).
