---
title: Supported classes
---

# Supported classes

Our Classic theme includes styling for a range of classes. You can apply these to elements in markdown.

## Formatting

Use these classes in your markdown to create specific formatting effects.

| Feature | Workflow class | Block or inline |  Explanation | Supports edition suffix
| --- | --- | --- | --- | ---
| Bibliography list | `.bibliography` | Block | Styles a list as a bibliography, for instance at the end of an academic book. | No
| Box | `.box` | Block | Puts the element in a box, to set it off from the rest of the text. | No
| Chapter number | `.chapter-number` | Block | Used for a chapter number before a chapter heading. (See the tip at [Bold in the chapter on Markdown](03-markdown.html#bold) for another way to handle chapter numbers. | No
| Dedication | `.dedication` | Block | A dedication, for instance at the start of a book or chapter | No
| Epigraph source | `.epigraph-source` | Block | The person to whom the epigraph is attributed. | No
| Epigraph | `.epigraph` | Block | An epigraph at the start of a book or chapter. | No
| Figure | `.figure` | Block | A figure is an image with a caption. Read about how to manage them properly [in our workflow guide](https://github.com/electricbookworks/electric-book-workflow#adding-images-in-markdown). | No
| Figure: extra small | `.x-small` | Block | Add to the `.figure` tag, e.g. `{:.figure .x-small}`.  | No
| Figure: fixed position | `.fixed` | Block | Add to the `.figure` tag, e.g. `{:.figure .fixed}`. For figures that must keep their position in the text flow, and must not float to the top of the page. | No
| Figure: large | `.large` | Block | Add to the `.figure` tag, e.g. `{:.figure .large}`.  | No
| Figure: medium | `.medium` | Block | Add to the `.figure` tag, e.g. `{:.figure .medium}`.  | No
| Figure: small | `.small` | Block | Add to the `.figure` tag, e.g. `{:.figure .small}`.  | No
| Figure height | `.height-1` to `.height-50` | Block | Sets the height of an element to a multiple of the default line height. Use in figures, on line after image (the `<p>` containing the `<img>`), to maintain baseline grid. | Yes
| First paragraph | `.first`| Block | For any paragraph that starts a new set of paragraphs, flush left and with a gap above it. | No
| Float to top | `.float-top` | Block | Floats the element to the top of its page. Useful for boxes. Applies to print output only. | Yes
| Float to bottom | `.float-bottom` | Block | Floats the element to the bottom of its page. Useful for boxes. Applies to print output only. | Yes
| Footnote | `.sidenote .bottom` | Block or inline | When you add `.bottom` to `.sidenote`, the note appears at the foot of the page in print output. It remains on the side on screens. (Also see the chapter ['Footnotes, endnotes and sidenotes'](17-notes.html#footnotes-endnotes-and-sidenotes).) | No
| Fraction | `.fractions` | Block or inline | If your font supports it, converts characters like `1/2` into fraction characters. | No
| Frontmatter references | `.frontmatter-reference` | Inline | Tag links in the Table of Contents whose page numbers must match yout frontmatter reference style set in CSS. | No
| Glossary | `.glossary` | Block | Use this after the last entry in a series of definition lists to define the entire list of definitions as a glossary. | No
| Hide from print | `.non-printing` | Block or inline | Hides the element from print output. Useful for things like clickable buttons, which are only intended for screens, not paper. | No
| Keep together | `.keep-together` | Block | Prevents an element from breaking across pages. (E.g. you want to keep a short list on the same page.) | No
| Keep with next | `.keep-with-next` | Block | Prevents a page break between this element and the next one. | No
| Logo image | `.logo` | Block | Used for making images small, especially for small logos in text like on acknowledgements pages. | No
| Page break after | `.page-break-after` | Block | Creates a page break after the element. | No
| Page break after, end of book | `.page-break-after-right` | Block | When applied to the very last element in the book, ensures a blank verso for an even-numbered page extent. | No
| Page break before | `.page-break-before` | Block | Starts its element on a new page. | No
| Page break: allow | `.allow-break` | Block | Allows an element to break over a page where the default styles would normally prevent that. Apply the class to the parent element. | No
| Page numbering restart | `.page-1` | Block | Restarts page numbering from 1. Can be added to the first block element on a page, or to the YAML header, in addition to the main style, e.g. `style: halftitle-page page-1` or `style: chapter page-1`. Recommended for any document that starts a book interior (e.g. title page), to retain correct pagination when creating a PDF ebook with a front cover | No
| Poetry | `.verse` | Block | Designing poetry is tricky and important. Read about how to manage this [in our workflow guide](https://github.com/electricbookworks/electric-book-workflow#poetry). | No
| Pull quote | `.pullquote` | Block | Displays a paragraph as a pull quote. | No
| Sidenote | `.sidenote` | Block or inline | A sidenote appears in a sidebar to the right of the text. | No
| Small caps (lowercase only) | `.smallcaps` | Block or inline | If your font supports proper small-caps glyphs. Only affects the lowercase letters. Add `.italics` or `.bold` if needed to italicise or bold. | No
| Small caps throughout | `.allsmallcaps` | Block or inline | If your font supports proper small-caps glyphs, all characters are small caps.  Add `.italics` or `.bold` if needed to italicise or bold. | No
| Source after a quotation | `.source` | Block | The name and/or title of the source for a preceding quotation. | No
| Table caption | `.table-caption` | Block | Add `{:.table-caption}` in the line immediately after a table caption. Table captions must always appear above tables, not after them. | No
| Title page: author | `.title-page-author` | Block | The book's author(s) on the title page. | No
| Title page: logo | `.title-page-logo` | Block | A logo, as an image, on the title page. | No
| Title page: subtitle | `.title-page-subtitle` | Block | The book's subtitle on the title page. | No
| Title page: title | `.title-page-title` | Block | The book's title on the title page. | No
| Tracking: tighten | `.tighten-1` to `.tighten-50` | Block or inline | Each increment tightens the space between letters by 0.001em (1/1000 of a em). *Affects print output only.* | Yes
| Tracking: loosen | `.loosen-1` to `.loosen-50` | Block or inline | Each increment loosens the space between letters by 0.001em (1/1000 of a em). *Affects print output only.* | Yes
| Valediction | `.valediction` | Block | Used for the sign-off at the end of a letter, preface or foreword. | No

## Reserved classes

You may also need to create your own classes for other uses. If you do, avoid using the same already-supported class names above. You should also avoid using the following ones, which are reserved for specific structural elements.

| Class name | Reserved for
|---|---
| `index` | The home page of a collection, used for the `style` value in file YAML headers
| `cover` | A front cover, which will appear in ebook editions, used for the `style` value in file YAML headers
| `halftitle-page` | A book's halftitle page, used for the `style` value in file YAML headers
| `previous-publications-page` | A book's list of the author's previous publications, used for the `style` value in file YAML headers
| `title-page` | A book's title page, used for the `style` value in file YAML headers
| `copyright-page` | copyright or imprint page, used for the `style` value in file YAML headers
| `contents-page`  | A book's table of contents, used for the `style` value in file YAML headers
| `dedication-page` | A dedication page, used for the `style` value in file YAML headers
| `epigraph-page` | An epigraph page, used for the `style` value in file YAML headers
| `frontispiece-page` | A frontispiece page, used for the `style` value in file YAML headers
| `frontmatter` | For other prelim pages not accounted for otherwise, used for the `style` value in file YAML headers
| `chapter`  | A book's default chapter page (and the global default), used for the `style` value in file YAML headers

## The edition suffix

If you want to produce more than one print edition of a book from the same source file, you can't use the same classes that affect text-flow – like `.tighten-1`, for instance – in both editions, because the text will flow differently in each edition.

Our workflow has a way to manage that. In the print CSS file, you can specify an edition suffix. For instance, if you're producing a schools edition of a book, you might make your suffix `-schools-edn`. That suffix will be appended to the end of certain class names for that stylesheet. The default `.tighten-1` class will become `.tighten-1-schools-edn` in your final print CSS.

(It's a good idea to start a suffix with a hyphen and use all lowercase letters, to keep your output CSS neat. Never use spaces.)

Only some classes are affected – see the table above for which ones. The most important are the classes used for tightening and loosening letter-spacing, which are mostly used to control widows and orphans in print layout.

In your markdown, then, you'd use `{:.tighten-1-schools-edn}` instead of `{:.tighten-1}`, and that class will then only have an effect on your schools edition. If you had another edition, say a large-print edition with a `-large-print` suffix, you'd use a `{:.tighten-1-large-print}` tag in the markdown. These would match the classes automatically generated in each edition's CSS.

Of course, one element can carry both classes. For instance, you might end up with a paragraph tagged with `{:.tighten-1-schools-edn .tighten-1-large-print}`. That paragraph would then be tightened in both print layouts.

## Deprecated classes

Early versions of the EBW used the following classes, which are no longer supported:

* `shrink`
* `tighten`, `tight`, `x-tight`, `xx-tight`, `xxx-tight`
* `loosen`, `loose`, `x-loose`
