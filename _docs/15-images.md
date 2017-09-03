---
title: Images
---

# Images
{:.no_toc}

* toc
{:toc}

{% raw %}

## Adding image files

Our template comes with four folders for images, which correspond to output formats: `print-pdf`, `screen-pdf`, `web` and `epub`. Save your images files there. Each folder should contain the same set of images, saved appropriately for each format. For instance, while their file names must be identical, `web` images might be full-colour, 96dpi, and up to 800 pixels wide; while `print-pdf` images might be in greyscale, 300dpi and 2400 pixels wide.

## Adding images in markdown

We use standard markdown to embed images:

~~~
![A description of the image](../{{ site.image-set }}/filename.svg)
~~~

Let's break that down:

* the exclamation mark and square and round brackets make up the masic markdown image syntax: `![Description](filename)`. The description is especially important for screen-readers used by the visually impaired.
* `../` means 'go up, out of the `text` folder'
* `{{ site.image-set }}/` means 'go into the folder containing our preferred set of images' (as defined in `_config.yml`). The default image-set folder is `images`.
* finally, the image file name.

### Images in translations

If you are creating a [translation](70-translations.html#translations) in a subdirectory of `text`, and your images are in the parent book folder, you need to change the path to the images slightly. You have two options:

1. Use the `{{ path-to-book-directory }}` metadata tag. At the top of your markdown file, add `{% include metadata %}`, so that you can use metadata variables in that file. Then instead of any `../`s, you use the tag: `{{ path-to-book-directory }}{{ site.image-set }}/filename.jpg`.

   Even if you're not in a translation folder, it's good practice to always use the `{{ path-to-book-directory }}` tag for maximum portability, if you don't mind having the `{% include metadata %}` tag at the top of your files.

1. Add another `../` for each directory level. So if your translation text is in `book/text/fr`, you need to come up three levels before going into `book/images`. So your path is `../../{{ site.image-set }}/filename.jpg`.


## Figures

A figure is the combination of an image and a caption. Sometimes a figure can include things like tables or video instead of images, and the captions can be accompanied by things like titles and sources.

## Simple markdown figures

You can create simple markdown figures that include an image followed by a caption. We put these together in a `<blockquote>` element with a `.figure` class. We can then control placement by styling the `<blockquote>`.

The reason we use a blockquote is that it lets us keep images and their captions together. A `<figure>` element would be better HTML, but it won't validate in EPUB2, and can't be created with kramdown.

Here's an example of markdown for a figure:

~~~
> ![Line drawing of a book](../{{ site.image-set }}/book.jpg)
>
> This is not a book.
{:.figure}
~~~

Every line (except the `{:.figure}` class tag at the end) starts with a `>` and a space. These wrap the figure (image and caption) in a `blockquote` element.

The first line is the image reference. As noted above, it consists of:

*	an exclamation mark telling markdown that we're placing an image
*	the `alt` attribute in square brackets
*	the path to the image file.

The third line is the figure caption, followed by the kramdown tag `{:.figure}`, which lets our stylesheets format the `blockquote` as a figure. (For instance, preventing a page break between the image and the caption in print.)

This will display like this.

{% endraw %}

> ![Line drawing of a book](../{{ site.image-set }}/book.jpg)
>
> This is not a book.
{:.figure}

{% raw %}

If your image has no caption, just skip the empty line and caption line:

~~~
> ![Figure 2-A: The Ballard scoring method](../{{ site.image-set }}/fig-2-A.svg)
{:.figure}
~~~

If it's important to you that the image isn't in a blockquote, and there is no caption, you can use:

~~~
![Figure 2-A: The Ballard scoring method](../{{ site.image-set }}/fig-2-A.svg)
{:.figure}
~~~

## Advanced figures

Figures are much more powerful if you use the `figure` include. The `figure` include is a dedicated piece of code in our template that creates figures with many options.

To include a figure this way, start with this simple tag:

`{% include figure %}`

Then, inside that tag after the word `figure`, you add extra info, depending what you need it to include.

In the tag for each figure, we can define the following information:

* one or more images
* html (e.g. for complex tables with merged cells)
* markdown (e.g. for simple tables)
* a reference (e.g. 'Figure 1.2', which will appear in front of the caption)
* a link (clicking the image opens this link; without it, by default clicking the image opens the image file)
* a caption (appears below the image)
* a title (can be used to title descriptive text)
* a description (hidden by default and used at `alt` text on the image; can be displayed and used with custom CSS)
* a source (appears below the figure)
* a [class](#classes) (for styling the layout of a given figure).

The template uses that information differently depending on the output format. For instance, on the web and in the epub, the description is the text that screen-readers will read aloud to blind users who can't see an image, and we don't need to display it in print.

A caption and a description are similar, but not the same. A caption usually provides information about the figure, while a description describes its appearance.

We define these things in the tag using 'parameters'. For instance, we set the `image` parameter by writing `image='mydog.jpg'`. Here is a `figure` include with each parameter set. You can copy this and set the value in each parameter. Nothing is mandatory, so you only need to include the parameters that your figure needs defined.

Here is a full example:

```
{% include figure
   images="mydog.jpg, yourdog.jpg"
   html="<table></table>"
   markdown="A *bad* example."
   reference="Figure 1.2a"
   link="http://example.com"
   caption="This is the figure caption."
   title="My Example Figure"
   description="This should describe what the images look like."
   source="Fire and Lion, 2017"
   class="featured"
%}
```

Note the double quotes. If the text you're adding to a parameter contains quotes, you'd use single quotes in the text – or vice versa. Do not mix single and double quotes, or the software won't know where the parameter ends. If you must use, say, double quotes inside the quotes around a parameter, use the actual unicode glyphs for curly quotes, `“` and `”`. For instance, all of these are okay:

```
caption="Blake's illustration for 'The Tyger'."
caption='Blake's illustration for "The Tyger".'
caption="Blake's illustration for “The Tyger”."
```

## Alternative image sets

There are often good reasons for producing books with different sets of images. For instance, one edition may have colour images and another black-and-white. Or your print edition might call for high-res images, but you want low-res ones for the ebook.

You want Jekyll to get images from the right image set. We do this by using the `{{ site.image-set }}` tag to refer to whatever format-specific image set Jekyll should use.

For example:

~~~
![]({{ site.image-set }}/filename.jpg)
~~~

To always use a specific image file for any given image, irrespective of the `images-set` config, simply hard-code your image path in markdown – that is, without using the `{{ site.image-set }}` tag. For example, for a given image you might specify the default images folder `![](images/filename.jpg)` or a specific subfolder `![](images/nb/filename.jpg)`.

{% endraw %}

If you're using `{% include figure %}` to add your figures, you don't need to specify any path or `site.image-set`. The figure include does that for you.

## Image placement

You may need to control how an image is sized and placed on the page – especially in print – depending on its detail or aspect ratio and nearby images or other elements. You do this by adding a class tag to the line following the image or figure created with a `>` blockquote. (This applies a class to the blockquote in HTML.) 

You have two broad options:

The lazy way: use these class attributes:

* `.x-small` limits the image height. In print, to 30mm.
* `.small` limits the image height. In print, to 45mm.
* `.medium` limits the image height. In print, to 65mm, which allows two figures with shortish captions to fit on a page.
* `.large` fills the width and most of a printed page, up to 150mm tall. Try to put these images at the end of a section, because they cause a page break.
* `.fixed` keeps the figure in its place in the text flow, and will not float it to the top or bottom of a page. For instance, when an image must appear in a step-by-step list of instructions.

You add these classes to the `{:.figure} tag like this:

`{:.figure .small}`

`{:.figure .fixed}`

and so on. You can combine size and placement classes like this, too:

`{:.figure .fixed .small}`

The more accurate way: use a class tag to specify the exact height of the image in lines. This is important if you're maintaining a baseline grid on your pages. For instance, `{:.height-5}` will limit the image to a height of five lines. Unlike the lazy way above, this tag should be applied to the image, not the figure. So a complete figure element might look like this in markdown:

~~~
> ![Potatoes on the moon]({{ site.image-set }}/1-moon-potatoes.jpg)
> {:.height-12}
>
> Potatoes grow well on the moon if well watered.
{:.figure}
~~~

> CSS tip: [If you're having trouble with SVGs having space around them](http://stackoverflow.com/questions/24626908/how-to-get-rid-of-extra-space-below-svg-in-div-element), in your CSS make sure you set the height of the `img` element. SVGs are inline elements by default, and will add white space around them.

## Preparing images

*   We recommend consistently using JPG – large versions in the `print-pdf` images folder and web-optimised versions in `screen-pdf`, `web` and `epub`. For some books we use SVG so that they scale beautifully but also remain small in file-size for web use; but EPUB2 does not support SVG.
*   Ensure that raster images, or raster/bitmap elements in SVG, are high-res enough for printing (e.g. 300dpi at full size).

### Using SVG images

If you choose to use SVG:

*   Embed images placed in SVG images, don't just link them.
*   Create a JPG version of every SVG image with the same file name (e.g. `bear.svg` and `bear.jpg`). You'll need the JPG fallback for EPUB. (We recommend JPG over GIF or PNG as a general default. One reason is that transparency seems like a good idea until your end-user switches their e-reader to 'night mode', and your black line-art disappears into the background.)

Here's our most common workflow for converting images to SVG:

*   If the image was created in InDesign (e.g. a flowchart made of InDesign frames): open in InDesign, group the frames that make up the image, copy, and paste into a new Illustrator file. Adjust Illustrator file artboards as necessary, then save as SVG.
*   If the image was created in Photoshop or other raster format: open the original, copy into Illustrator. Live trace the image. (We mostly use the 'Detailed Illustration' preset.) Save as SVG. You can also use the trace function in Inkscape instead of Illustrator.
*   If you save SVG from Adobe Illustrator (and possibly other creators, too), choose to convert type to outlines. (For us, the main reason for this is that PrinceXML gives unpredictable results with type in SVG. But it's probably safest generally to convert type to outlines for consistent output.)

#### Image sizes

We like to use these settings where possible:

*	Default width: 115mm
*	Aspect ratios: 4:3 (portrait or landscape), a closer ratio, or square. Images at wider ratios (e.g. 16:9) than 4:3 make layout more difficult.
*	Therefore, maximum height is 150mm. (That's very slightly less than a 4:3 height:width ratio.)

Using Illustrator? Different SVG editors treat image size differently. For instance, a 2-inch-wide image in Illustrator will appear 1.6 inches wide in Prince and Inkscape. Why? Because when creating the SVG's XML, Illustrator includes its dimensions in pixels, and *assumes a 72dpi resolution*, where Prince and Inkscape follow the W3C SVG spec and assume 90dpi. As a result, images coming out of Illustrator always appear 80% of their intended size. So, if you're creating images in Illustrator, set your image sizes to 125% of what you intend to appear in the book. That means:

*	default width 115mm × 125% = 143.75mm
*	max height (at 4:3) = 190mm

Check out [Adobe's guidance on saving SVGs](https://helpx.adobe.com/illustrator/using/saving-artwork.html#save_in_svg_format).

If your SVG files seem big, [read up on optimising SVGs](http://stackoverflow.com/a/7068651/1781075), and/or (if you're comfortable using Python scripts) run your SVGs through [Scour](http://codedread.com/scour/).

### Resolution

*	For SVG images, the editor you use will determine underlying resolution. Illustrator uses 72dpi, and Inkscape 90dpi. We favour and assume 90dpi, but can rescale SVG images with  our stylesheets just in case.
*	For JPGs, we often use 200dpi and image quality of 80 ('very high' in Adobe presets). This allows for reasonable print quality while keeping file sizes sensible for web delivery. The higher resolution also allows ebook users to zoom in for more detail. This saves having to create different images for each image set. However, it is best practice to create separate image sets, with higher quality for `print-pdf`.
*	To get a 200dpi JPG that is 115 mm wide, the image must be 906 pixels wide. (115mm is 4.53 inches, which contains 906 pixels at 200 pixels per inch, aka 200 dpi.)
*	Try to keep non-`print-pdf` JPG file sizes below 127KB: [Amazon Kindle may automatically downsample images above that](http://authoradventures.blogspot.com/2014/02/image-size-limit-increased-in-kindle.html), and it's better if you control the downsampling for quality than let their servers do it. However, for raster-only images (e.g. x-rays or photos) if a larger size is required for acceptable print quality then larger is fine.

### Image styles

We like these approaches to artwork, where possible:

*	Use the same font and size for all labels
*	Fit artboards to artwork bounds; there should be no white space around the art in an image. (Control space with CSS styling.) Since you're creating images to a specific size, you may need to **expand artwork to fit the artboard**, *not* fit artboards to artwork bounds, which would make your whole image smaller.

If you use live trace to create art from a raster source, you must clean up the file to remove unnecessary fills that add to file size but do little for clarity.

Raster images should follow the sizing constraints above and be saved as jpg (since older Amazon Kindles only use JPG or GIF, avoid PNG or other formats). Save as RGB.

### Cover images

Add the front-cover image to the book's `images` folder. Ensure colour settings are RGB and the DPI is set to 72. We recommend creating the image in three sizes:

*	`cover.jpg`: 960px high (in keeping with epub best practice these are just under 1000px on their longest side)
*	`cover-thumb.jpg`: 300px wide
*	`cover-large.jpg`: 2000px high

The first is mandatory. The thumbnail and large images are for your convenience. For instance, when uploading a book to Amazon Kindle, you must provide a cover image this large.
