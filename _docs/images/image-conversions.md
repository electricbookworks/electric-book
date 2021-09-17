---
title: Automating image conversions
categories: images
order: 2
---

# Automating image conversions
{:.no_toc}

* toc
{:toc}

You can automate the conversion of images to various outputs. Then you only need to put high-res versions of your images in `images/_source` and run the automatic conversion to populate the images for all output formats.

This will automatically optimise, convert and save your images to the output folders, including specifying the correct [colour profiles](../layout/colour-profiles.html) and creating multiple image sizes for web output.

> Note: To do this on your computer, you need to have npm installed, and to have run `npm install` in the project root to install the `node_modules`. This can be done easily by running the 'Update and install dependencies' option in the `run-` output script for your operating system.
{:.box}

## Using the output script

Run the `run-` output script for your operating system, then choose 'Convert source images to output formats' and answer the prompts.

## Using gulp directly

Instead of using the output script, you can also use `gulp` directly from the command line.

By default, `gulp` will convert the images in your `book/images/_source` folder. To convert the images in a different book folder's `images/_source`, say for `my-potato-book`:

``` shell
gulp --book my-potato-book
```

> Note: You can also use `--folder` instead of `--book`. They have the same effect. 'Folder' can be easier to remember when processing images in `assets/images` and `_items/images`.
{:.box}

If you're processing image files in a translation subdirectory, specify the language by its code. E.g.:

``` shell
gulp --language fr
```

You can also combine these:

``` shell
gulp --book my-potato-book --language fr
```
