---
title: Adding image files
categories: images
order: 1
---

# Adding image files

Store the original, master versions of your images in your book's `images/_source` folder. You can then have the template generate versions optimised for each output format. These are stored in the `print-pdf`, `screen-pdf`, `web`, `epub` and `app` folders alongside `_source`.

Each format-specific folder should then contain the same set of images, saved appropriately for each format. For instance, `epub` images might be full-colour at 96dpi and up to 800 pixels wide; while `print-pdf` images might be in greyscale, 300dpi and 2400 pixels wide.

Images that must be available for pages outside of a book (e.g. on your project's landing page) should be stored in `assets/images/_source` and converted in the same way.

For converting images, see [Automating image conversions](image-conversions.html).
