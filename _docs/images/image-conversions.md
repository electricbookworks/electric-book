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

> Note: To do this on your computer, you need to have GraphicsMagick and Node installed, and to have run `npm install` in the project root to install the `node_modules`.
{:.box}

## Using the output script

Run the output script with the relevant options, e.g.

```shell
npm run electric-book -- images
```

for images in the default `book` folder.

```shell
npm run electric-book -- images --book samples
```

will process images in the `samples` book folder.

The options `--folder` and `--dir` are aliases for `--book`. So this is exactly the same as the above command:

```shell
npm run electric-book -- images --dir samples
```

And this:

```shell
npm run electric-book -- images --dir assets
```

will process images in the `assets` folder, which is for images that must be available to pages outside of books, such as your project's landing page.


## Using gulp directly

Instead of using the output script, you can also use `gulp` directly from the command line.

By default, `gulp` will convert the images in your `book/images/_source` folder. To convert the images in a different book folder's `images/_source`, say for `my-potato-book`:

``` shell
gulp --book my-potato-book
```

> Note: You can also use `--folder` instead of `--book`. They have the same effect. 'Folder' can be easier to remember when processing images in `assets/images`.
{:.box}

If you're processing image files in a translation subdirectory, specify the language by its code. E.g.:

``` shell
gulp --language fr
```

You can also combine these:

``` shell
gulp --book my-potato-book --language fr
```

## Image settings

This automatic image processing will apply the same size and colour profiles to all the images for a given output format. For example, all print-PDF images will get a CMYK colour space by default, and remain a large size for high-quality printing. Screen-PDF images will get an RGB colour profile, and have their image size reduced.

You might want to change the color space of specific images in, say, print-PDF output. Or you might want to exclude an image from any optimisation or modification; for example, you might have a hand-coded SVG that should not be changed at all by our default optimisation settings.

You can apply these settings in `_data/images.yml`.

Also see [SVG processing](svg-processing.html) for advanced techniques for modifying SVGs during processing.

### Color spaces

For example, to make one image grayscale in print-PDF:

```yaml
samples:
  - file: "fradkin-1.jpg"
    print-pdf:
      colorspace: "gray"
```

To change a setting for all images in a format, you can use 'all' instead of the image filename:

```yaml
book:
  - file: "all"
    print-pdf:
      colorspace: "gray"
```

Note that this *does not change SVGs*. SVGs are processed differently from bitmap-based images like JPGs. If you want to make SVGs grayscale, you may need to use an [SVG filter](https://www.w3.org/TR/filter-effects-1/#grayscaleEquivalent) ([here's an example](https://stackoverflow.com/a/23255391/1781075)) or use print-PDF-specific CSS.
{:.box}


### Turning off image modification

To avoid modifying an image at all for a given format, you give that format a `modify: no` value, like this:

```yaml
samples:
  - file: "fradkin-1.jpg"
    print-pdf:
      modify: no
```

Now the output in print-PDF will be the same as the image in the `_source` folder, with none of the default print-PDF modifications.

You can also use `all` to set an option for all formats.

```yaml
samples:
  - file: "fradkin-1.jpg"
    all:
      modify: no
```

Here is a shorter way to set `modify: no` for all formats:

```yaml
samples:
  - file: "fradkin-1.jpg"
    modify: no
```

Note that SVGs are treated differently to bitmap-based images like JPGs. We use the same SVG for all output formats. So, if `modify: no` is set for *any* format for an SVG file, it will not be modified for any output formats. E.g. here `naples.svg` will not be modified for *any* output format, not just for print-pdf, even though that's what the setting looks like:

```yaml
samples:
  - file: "naples.svg"
    print-pdf:
      modify: no
```


### Advanced: shorthand with YAML anchors and aliases

Sometimes, you need to apply different settings per output format, and repeat those settings for many images. For instance, perhaps fifty of your images should be optimised for print-pdf and web output, but not for screen PDF, epub or app.

YAML's anchor/alias syntax gives us a concise way to define settings once and reuse them for many images. You define the settings once as an 'anchor', and then refer to that anchor over and over again. If you're familiar with Javascript or Sass, think of the anchor as a function or mixin that you are invoking for each image.

First, above your image settings in `images.yml`, define your anchor, e.g.:

```yaml
no-modifications: &no-modifications
  print-pdf:
    modify: yes
  screen-pdf:
    modify: no
  web:
    modify: yes
  epub:
    modify: no
  app:
    modify: no
```

Note the `&`, which signals an anchor.

Then, for each image, you insert the anchor with an alias like this:

```yaml
samples:
  - file: "fradkin-1.jpg"
    <<: *no-modifications
  - file: "fradkin-2.jpg"
    <<: *no-modifications
```

And so on. This 'merges' the `no-modifications` anchor into each image's settings.

You can create your own anchors and give them any name instead of `no-modifications`, which is just a useful label in this case.
