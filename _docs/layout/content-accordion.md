---
title: Web and app content accordion
categories: layout
order: 4
---

# Web and app content accordion
{:.no_toc}

* Page contents
{:toc}

A book chapter can be much too long for reasonable reading on screen. Also, a chapter might contain many images, and downloading them all every time you read just part of the chapter could use up a lot of a user's data. For these reasons, you can turn on a content accordion for web and app pages.

The content accordion breaks up your page into sections, and collapses them, showing only each section's heading. To open or close a section, a user just clicks on the heading (or the toggle icon beside it).

In addition, images in [figures](../editing/figures.html) will only load when a section is opened. This way, if a user doesn't open a given section, their device won't download it, saving them data.

The content accordion only works in chapter files (i.e. markdown files that do not have a `style` set in their YAML frontmatter, or have it set to something other than `chapter`, such as frontmatter).

## Activating the content accordion

To turn on the content accordion, change the value of `accordion` in `_data.settings.yml` to `true`:

``` yaml
  accordion: true
```

This is set separately for `web` and `app` outputs. So you'll find in `settings.yml` that you can set `accordion` in two places.

When the accordion is on, you may want to turn it off for some pages (e.g. a chapter with a few headings but very little content), or have it start fully expanded. To do this, set `accordion` to `none` or `expand` in the page's YAML frontmatter (the part between the `---`s at the top of the file):

``` yaml
accordion: none
```

or

``` yaml
accordion: expand
```

## Setting the accordion heading level

By default, the content accordion collapses on `h2`s. You can change this in the `// Options` section of `assets/js/accordion.js`. For instance, to set the accordion to collapse on third-level headings, change:

``` js
var accordionHeads = '#content h2'
```

to

``` js
var accordionHeads = '#content h3'
```

You should also set which accordion section should open by default, if a user comes to a chapter without selecting an accordion. The default setting opens the first `h2` by default:

``` js
var defaultAccordionHead = '#content h2:first-of-type'
```

You can change `h2` to `h3` here, for instance, or just leave it blank to not set a default, in which case all accordions will be closed when a user comes to a chapter without selecting an accordion:

``` js
var defaultAccordionHead = ''
```
