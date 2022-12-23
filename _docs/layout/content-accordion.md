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

The content accordion only works in chapter files (i.e. markdown files that do not have a `style` set in their YAML frontmatter, or have it set to something other than `chapter`, such as frontmatter).

Technical note: By default, when you open an accordion section, other open sections stay open. If you would like only one accordion section to open at a time, so that opening a section closes the others, set `accordion-auto-close: false` for web and/or app output in `_data/settings.yml`.
{:.box}

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

By default, the content accordion collapses on `h2`s. You can change this in `_data/settings.yml` by setting the `accordion-level`.

You can override that level per page by specifying an `accordion-level` in a page's YAML fronmatter, e.g.:

``` yaml
accordion-level: h3
```
