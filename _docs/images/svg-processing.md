---
title: "SVG processing"
categories: images
order: 5
---

# SVG processing
{:.no_toc}

* toc
{:toc}

This is a technically advanced section for those who need to grapple with how SVGs are processed.

Also see the ['Settings'](../setup/settings.html#svg-injection) section in Setup for how SVGs are injected into web pages.


## Default optimisation

Our built-in image-preparation process automatically optimises SVG images, for instance by removing unnecessary data from their code. This happens when you run the 'Convert source images to output formats' option in the output script.

> Technical note: We use a library called [SVGO](https://github.com/svg/svgo) for this optimisation. SVGO has many configuration options. We've carefully preset options based on our experience, and they are written into `_tools/gulp/processors/svgs.js`. If you need to change them, tread carefully and be careful not to overwrite your changes if you update this or related files, for instance by copying the latest version from the template or another project.


## Manipulating SVGs automatically

Sometimes you need to make specific and/or manual changes to SVGs. For instance, we like to include Google Fonts CSS in SVGs so that, at least when you're online, the fonts in an SVG still load even when that SVG is viewed outside of its book web page (e.g. opened in a new tab).

This can be tedious to do manually, or impossible to do in tools like Adobe Illustrator. Or the SVGO optimisation process breaks your manual changes.

So, the Electric Book template includes a way for you to write Javascript functions that manipulate your SVGs for you during image processing. These functions run *after* SVGO optimisation.

These functions are in scripts saved to book specific folders in `_tools/gulp/images/functions`. You can create one file and function per SVG image, or one file and function that applies to *all* SVGs images in a book. You can also have a function run only on the SVG for a particular output format (e.g. `print-pdf`),


### Single-image functions

Add a file for the relevant SVG to the `_tools/gulp/images/functions` folder, in a subfolder with the same name as the image's book directory. Its filename should be identical to the image filename, but with:

- spaces removed
- underscores instead of hyphens
- underscores instead of full stops
- a `.js` file extension.

For example, `naples_svg.js` will contain a function that runs on the `naples.svg` file in the `samples` book. It should be in `_tools/gulp/images/functions/samples`.

If you want the file to only apply to a particular output format, place it in a sub-folder named after that format. E.g. `_tools/gulp/images/functions/samples/print-pdf/naples_svg.js`. If there is a file with the same name for both all formats and a specific output format, the all-formats function will run first, followed by the output-specific one.

Behind the scenes, the function will be run by [gulp-edit-xml](https://www.npmjs.com/package/gulp-edit-xml), which parses SVG files as Javascript objects. For more detail on this approach and syntax, see the docs for [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js). In particular, note that:

- you refer to your SVG as `xml` in your function, and the SVG element as `xml.svg`
- your script must include an `exports` statement after the function. E.g. `exports.naples_svg = naples_svg;`

Here is a full example of a file that would be saved as `_tools/gulp/images/functions/naples_svg.js`, and which inserts a font-face import into an SVG. (Note that this function will entirely replace any existing `<style>` element in the SVG.)

```js
function naples_svg(xml) {

    xml.svg.defs = {
        style: '@import url("https://fonts.googleapis.com/css?family=Asap:400,400i,600,600i");'
    };

    return xml;
}

exports.naples_svg = naples_svg;

```


### Global functions

You can also create one function per book that will apply to *all* SVG images in that book. You need to name it in the same place and format as above, but with the word 'all' instead of the filename. E.g. in the `samples` book, the script would be saved as `all_svg.js`, and the function would be called `all_svg`:

```js
function all_svg(xml) {
    // logic here
    return xml;
}
exports.all_svg = all_svg;
```
