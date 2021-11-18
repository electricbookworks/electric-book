# Adding image functions

This folder lets you define functions for adjusting SVG images during gulp image-processing.

Add a function for the relevant SVG to the functions folder. Its filename should be in camelcase, with no hyphens, in this format that includes the book folder, filename, and file extension:

```
bookFileSvg.js
```

For example, this function run on the `naples.svg` file in the `samples` book:

```
samplesNaplesSvg.js
```

The function will be run by `gulp-edit-xml` (https://www.npmjs.com/package/gulp-edit-xml), which parses SVG files as Javascript objects.

- Give your function the same names as the file (without the `.js`).
- Refer to your SVG as `xml` in your function.
- Your function file must include an `exports` statement after the function. E.g. `exports.samplesNaplesSvg = samplesNaplesSvg;`

Here is a full example that inserts a font-face import into an SVG. (Note that this function will entirely replace any existing `<style> element in the SVG.)

```js
function samplesNaplesSvg(xml) {

    xml.svg.defs = {
        style: '@import url("https://fonts.googleapis.com/css?family=Asap:400,400i,600,600i");'
    };

    return xml;
}

exports.samplesNaplesSvg = samplesNaplesSvg;

```
