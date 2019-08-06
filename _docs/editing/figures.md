---
title: Figures
categories: editing
order: 3
---

# Figures
{:.no_toc}

* toc
{:toc}

A figure is the combination of an image and a caption. Sometimes a figure can include things like tables or video instead of images, and the captions can be accompanied by things like titles and sources.

## Simple markdown figures

You can create simple markdown figures that include an image followed by a caption. We put these together in a `<blockquote>` element with a `.figure` class. We can then control placement by styling the `<blockquote>`.

The reason we use a blockquote is that it lets us keep images and their captions together. A `<figure>` element would be better HTML, but it won't validate in EPUB2, and can't be created with kramdown.

Here's an example of markdown for a figure:

~~~ md
> ![Line drawing of a book](../{{ site.image-set }}/book.jpg)
>
> This is not a book.
{:.figure}
~~~

Every line (except the `{:.figure}` class tag at the end) starts with a `>` and a space. These wrap the figure (image and caption) in a `blockquote` element.

The first line is the image reference. As noted above, it consists of:

*	an exclamation mark telling markdown that we're placing an image
*	the image's description (aka the `alt` attribute in HTML) in square brackets
*	the path to the image file.

The third line is the figure caption, followed by the kramdown tag `{:.figure}`, which lets our stylesheets format the `blockquote` as a figure. (For instance, preventing a page break between the image and the caption in print.)

If your image has no caption, just skip the empty line and caption line:

~~~ md
> ![Figure 2-A: The Ballard scoring method](../{{ site.image-set }}/fig-2-A.svg)
{:.figure}
~~~

If it's important to you that the image isn't in a blockquote, and there is no caption, you can use:

~~~ md
![Figure 2-A: The Ballard scoring method](../{{ site.image-set }}/fig-2-A.svg)
{:.figure}
~~~

## Advanced figures

Figures are much more powerful if you use the `figure` include. The `figure` include is a dedicated piece of code in our template that creates figures with many options.

To include a figure this way, start with this simple tag:

{% raw %}
`{% include figure %}`
{% endraw %}

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
* the height of the image in lines
* a [class](classes.html) (for styling the layout of a given figure).

The template uses that information differently depending on the output format. For instance, on the web and in the epub, the description is the text that screen-readers will read aloud to visually impaired users who can't see an image; and we don't need to display it in print.

A caption and a description are similar, but not the same. A caption usually provides information about the figure, while a description describes its appearance.

We define these things in the tag using 'parameters'. For instance, we set the `image` parameter by writing `image='mydog.jpg'`. Below is a `figure` include with each parameter set. You can copy this and set the value in each parameter. Nothing is mandatory, so you only need to include the parameters that your figure needs defined.

Here is a full example:

{% raw %}
``` liquid
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
   image-height="10"
   class="featured"
%}
```
{% endraw %}

Note the double quotes. If the text you're adding to a parameter contains quotes, you'd use single quotes in the text – or vice versa. Do not mix single and double quotes, or the software won't know where the parameter ends. If you must use, say, double quotes inside the quotes around a parameter, use the actual unicode glyphs for curly quotes, `“` and `”`. For instance, all of these are okay:

``` html
caption="Blake's illustration for 'The Tyger'."
caption='Blake's illustration for "The Tyger".'
caption="Blake's illustration for “The Tyger”."
```

### Rotating figures

If you need to rotate a large figure on the page, add the `rotate` class. E.g.

{% raw %}
``` liquid
{% include figure
   html="<table>...</table>"
   reference="Figure 1.1"
   caption="A really huge table."
   class="rotate"
%}
```
{% endraw %}

Rotation only affects PDF output.

### Figure width

If you need to make a figure narrower than the full text area, add a `width-x` class, where `x` is the width you want in percent. E.g. `width-50` will create a half-width image.
