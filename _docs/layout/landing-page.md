---
title: The landing page
categories:
  - layout
order: 2
---

# The landing page

When you generate the web or app version of your project, the root `index.md` file is its landing page. This is usually the most important page for users, because it sets the tone and tells users how to get the most from your publications.

The template includes several features specifically for use on landing pages:

1. [Sibling-feature boxes](#sibling-feature-boxes)
2. [Full-width, coloured panels](#full-width-coloured-panels)
3. [A high-level, visual table of contents](#a-visual-table-of-contents)

## Sibling-feature boxes

Sibling-feature boxes are one or more side-by-side boxes containing a small image and a small piece of text. They are usually used to each highlight a key feature of your project.

To add a feature box, use the `feature-box` include tag like this:

{% raw %}
```
{% include feature-box
   text="The template includes [a blank book](book/0-3-contents.html) to add your content to."
   image="logo.svg"
%}
```
{% endraw %}

To gather multiple feature boxes as siblings, wrap one or more of these tags in a div with a `feature-boxes` class. E.g.

{% raw %}
```
<div class="feature-boxes">

{% include feature-box
   text="The template includes [a blank book](book/0-3-contents.html) to add your content to."
   image="logo.svg"
%}

{% include feature-box
   text="Learn from [a book of examples](samples/index.html), with a partial [translation](samples/fr/)."
   image="cover.jpg"
%}

{% include feature-box
   text="The template's [documentation](docs/) explains how its features work."
   image="banner-image.jpg"
%}

</div>
```
{% endraw %}

The images used in feature boxes should be in `assets/images/_source` and [converted for the template's output formats](image-conversions.html).

## Full-width coloured panels

It can be useful to set a section of your landing page off from the rest by putting it in a full-screen-width panel with a background colour.

While you could write project-specific CSS to handle this, the template includes an efficient way to create this effect without writing any code.

Wrap the content of your panel in a `div` with the class `color-panel`. You then set the colours of the panel, its text, and its links with additional classes. These additional classes include the hex values of those colours in their names.

Note the American spelling of `color` in `color-panel`. This is for consistency with the way `color` is spelled in CSS properties. So `colour-panel` won't work.
{:.sidenote}

For example:

```html
<div class="color-panel background-000 text-fff links-ccc" markdown="1">

This panel has a black background (`#000`) with white text (`#fff`) and grey links (`#ccc`).

</div>
```

```html
<div class="color-panel background-b5dcff text-10622b links-10622b" markdown="1">

This panel has a light-blue background (`#b5dcff`) with dark-green text and links (`#10622b`).

</div>
```

It's often not wise to define design elements in content (markdown, HTML) like this. Normally, it's important to separate content and design. However, in this case, used only on the landing page for efficiency, it can be worth doing.

In the examples above, we include the `markdown="1"` attribute to tell the processor (kramdown) to treat the contents of the `div` as markdown, and convert it to HTML like other markdown content. By default, anything inside a block-level HTML element like a `div` will be treated as finished HTML, not markdown to be processed.

## A visual table of contents

For projects containing only one or two books, it can be great for users to include a high-level table of contents, with small thumbnail images, on the landing page.

To include a visual table of contents on a landing page, use the `visual-toc` include tag, like this:

{% raw %}
```
{% include visual-toc
   book="samples"
   files="
   * 00-05-contents-page
   * 01-01-plain-text-1
   * 01-10-questions
   * 02-01-plain-images
   * 02-02-figures
   * 03-02-maths
   * 04-02-video
   * 10-02-dynamic-index
" %}
```
{% endraw %}

Only the files that you list, for the book you define, will be included in the visual TOC. The visual TOC will draw the title, image, and description for each file from that file's top-of-page YAML. For example, from the `02-02-figures.md` file in the template's book of samples:

```YAML
---
title: "Figures"
image: "fradkin-2.jpg"
description: "A research paper that includes figures with reference numbers, captions and sources."
---
```
