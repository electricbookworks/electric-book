---
title: Images
categories: editing
order: 5
---

# Images
{:.no_toc}

* toc
{:toc}

{% raw %}

## Adding images in markdown

You can use standard markdown to embed images:

~~~
![A description of the image](../{{ site.image-set }}/filename.svg)
~~~

Let's break that down:

* the exclamation mark and square and round brackets make up the basic markdown image syntax: `![Description](filename)`. The description is especially important for screen-readers used by the visually impaired.
* `../` means 'go up, out of the `text` folder'
* `{{ site.image-set }}/` means 'go into the folder containing our preferred set of images' (as defined in `_config.yml`). The default image-set folder is `images`.
* finally, the image file name.

### Responsive images

To add an image, you can use standard [kramdown syntax](https://kramdown.gettalong.org/quickref.html#links-and-images), as described above, but then you'll be missing a key feature of this template: your user's browser won't fetch the size of image best suited to their device.

Instead, to get responsive images, use this image tag:

``` liquid
{% include image file="foobar.jpg" %}
```

where `foobar.jpg` is the original filename of the image.

If necessary, you can add `class`, `id` and/or `alt` attributes to the image, too:

``` liquid
{% include image file="foobar.jpg" class="example" alt="An example image." id="anyuniqueid" %}
```

(You can also use `src="foobar.jpg"` instead of `file="foobar.jpg"`, if you're used to standard HTML `img` syntax, which uses `src`.)

### Images in translations

If you are creating a [translation](translations.html) in a subdirectory of `text`, and your images are in the parent book folder, you need to change the path to the images slightly. You have three options:

1. From version 0.10 of the template, you can use `{{ images }} metadata tag, which will always create the correct path to your images. At the top of your markdown file, add `{% include metadata %}`, so that you can use metadata variables in that file.
1. In older versions of the template: use the `{{ path-to-book-directory }}` metadata tag. At the top of your markdown file, add `{% include metadata %}`, so that you can use metadata variables in that file. Then instead of any `../`s, you use the tag: `{{ path-to-book-directory }}{{ site.image-set }}/filename.jpg`.

   Even if you're not in a translation folder, it's good practice to always use the `{{ path-to-book-directory }}` tag for maximum portability, if you don't mind having the `{% include metadata %}` tag at the top of your files. Ultimately this image include will look like this: `![A description of the image]({{ path-to-book-directory }}{{ site.image-set }}/filename.jpg)`

1. In very old versions of the template: add another `../` for each directory level. So if your translation text is in `book/text/fr`, anf your images are in the `book` folder, you need to come up two levels before going into `book/images`. So your path is `../../{{ site.image-set }}/filename.jpg`.
   
   Ultimately, your image include will be `![A description of the image](../../{{ site.image-set }}/filename.jpg)`.

{% endraw %}

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

## Images over a double-page-spread

There is no easy way to put images over a double-page spread, but there is a way to hack it.

Of course, images across a DPS are not an ebook or web issue (if an ereader or browser shows 'pages' as a DPS, we have no control over it anyway). They are only a print issue. The problem is that PrinceXML does not provide a mechanism for placing images (or any element) across a spread. 

In short, what we do is:

1. Place the image twice, each in a `div` (as HTML) or `blockquote` (possible with markdown) element.
2. Using PrinceXML's `next` modifier for floats, we float the div or blockquote elements on the first and second pages of the DPS respectively.
3. Inside each div or blockquote, we position the image so that, on the left, only the left half of the image shows; and on the right, only the right half of the image shows.

This all depends on placing your image reference in a way that the first blockquote–image falls on a left-hand page.

Here's a step-by-step guide using example code:

1. The image itself must be in the right aspect ratio. This method cannot (yet) resize or crop your image for you with CSS. In this example here, the image must be 270×120 (landscape), including an allowance for 5mm bleed.
2. In the markdown text file, place the image twice, each inside a blockquote, and tag the first instance `{:.dps-left}` and the second `{:.dps-right}`.
   
   ``` markdown
   > ![1](images/lion.tif)
   {:.dps-left}
   
   > ![1](images/lion.tif)
   {:.dps-right}
   ```

3. Hide the second instance of the image in any web, app or epub CSS:
   
   ``` css
   /* Hide second instance of images intended for DPS in print */
   .dps-right { 
     display: none;
   }
   ```

4. In print CSS, use this. Follow the comments to modify sizes to suit your page size and layout:
   
   ``` css
   /* DPS images */
   
   blockquote.dps-left {
   float: top;
   margin: -20mm 0 10mm -5mm; /* Here you're aiming to start the image in the page bleed top left */
   width: 135mm; /* Page width plus one side's bleed, e.g. 130mm wide plus 5mm bleed */
   height: 120mm; /* Exact height of the image */
   text-align: left;
   }
   blockquote.dps-right {
   float: top next;
   margin: -20mm 0 10mm -5mm; /* Here you're aiming to place the image in the page bleed top right */
   width: 135mm; /* Page width plus one side's bleed, e.g. 130mm wide plus 5mm bleed */
   height: 120mm; /* Exact height of the image */
   text-align: right;
   }
   blockquote.dps-left p img {
   width: 270mm; /* This must be exactly double the width above */
   max-height: 120mm; /* This must be the same as the height above */
   position: absolute;
   left: -5mm;
   }
   blockquote.dps-right p img {
   width: 270mm; /* Ditto */
   max-height: 120mm; /* Ditto */
   position: absolute;
   right: -5mm;
   }
   ```

That's all based on these page settings. Yours may differ, affecting your margins, heights and widths accordingly:

``` css
@page {
    size: 130mm 200mm;
    margin-top: 15mm;
    margin-bottom: 20mm;
    margin-outside: 0;
    margin-inside: 0;
    prince-bleed: 5mm;
    prince-trim: 5mm;
}
```

We've done very little testing with this so far. YMMV.

There is another example [here](https://github.com/electricbookworks/electric-book/issues/164).
