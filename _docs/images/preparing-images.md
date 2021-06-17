---
title: Preparing images
categories: images
order: 4
---

# Preparing images
{:.no_toc}

* toc
{:toc}

We recommend consistently using JPG (saving large versions in the `_source` images folder and using [automated image conversion](image-conversion.html) to create versions in `print-pdf`, `screen-pdf`, `web`, `app` and `epub`) or SVG.

We recommend JPG over GIF or PNG. One reason is that transparency (which JPG does not support) seems like a good idea until your end-user switches their e-reader to 'night mode', and your black line-art disappears into the background.

More importantly, if you're creating a print edition, PNG cannot work with CMYK color spaces.

For some books we use SVG so that they scale beautifully but also remain small in file-size for web use.

> Note that if you're deliberately going to create EPUB2, that standard does not support SVG and you may need to use EPUB3.
{:.sidenote}

Ensure that raster images, or raster/bitmap elements in SVG, are high-res enough for printing (e.g. 300dpi at full size).

> ## Illustrator vs Inkscape
> 
> Different SVG editors treat image size differently. For instance, a 2-inch-wide image in Illustrator will appear 1.6 inches wide in Prince and Inkscape. Why? Because when creating the SVG's XML, Illustrator includes its dimensions in pixels, and *assumes a 72dpi resolution*, where Prince and Inkscape follow the W3C SVG spec and assume 90dpi. As a result, images coming out of Illustrator always appear 80% of their intended size. So, if you're creating images in Illustrator, set your image sizes to 125% of what you intend to appear in the book. That means:
> 
> Check out [Adobe's guidance on saving SVGs](https://helpx.adobe.com/illustrator/using/saving-artwork.html#save_in_svg_format).
{:.box}

If your SVG files seem too big, [read up on optimising SVGs](https://stackoverflow.com/a/7068651/1781075), and/or (if you're comfortable using Python scripts) run your SVGs through [Scour](https://codedread.com/scour/).

## Resolution

For SVG images, note that the editor you use will determine underlying resolution. Illustrator uses 72dpi, and Inkscape 90dpi. We favour and assume 90dpi, but can rescale SVG images with our stylesheets just in case.

For JPGs, we often use 300dpi and image quality of 100%/12/maximum for `_source` images. Our [automated image conversion](image-conversion.html) then provides for excellent print quality while keeping file sizes sensible for screen delivery.

> Note: To get a 200dpi JPG that is 115 mm wide, the image must be 906 pixels wide. (115mm is 4.53 inches, which contains 906 pixels at 200 pixels per inch, aka 200 dpi.)
{:.sidenote}

## Image styles

We like these approaches to artwork, where possible:

*	Use the same font and size for all labels
*	Fit artboards to artwork bounds; there should be no white space around the art in an image. (Control space with CSS styling.)

## Cover images

Save the front-cover image as `cover.jpg`.
