---
title: Settings
categories: setup
order: 10
---

# Settings
{:.no_toc}

You can apply a range of settings to how your books build in `_data/settings.yml`.

* Page contents
{:toc}

## Electric Book Manager

These settings are not yet used. In future, we expect to use this setting to allow or disallow Electric Book Manager servers to access your book project.

``` yaml
electric-book-manager: enable
electric-book-manager-key: ""
```

## Variants

See [Variants](variants.html).

## Masthead

These settings control the content of your masthead in web and app outputs. You can have different settings for web and app output. Your masthead can display:

- only the project name (setting: `project-name`)
- the project name and book title (setting: `book-title`)
- the project name, book title, and page title (setting: `page-title`)
- full breadcrumbs that include the project name, book title, all labels listed in `nav` in your book's YAML file in `_data/works`, and the page title (setting: `breadcrumbs`).

For example:

``` yaml
web:
  masthead:
    content: page-title
app:
  masthead:
    content: breadcrumbs
```

Note that `breadcrumbs` slows your site build down significantly. So we recommend not using them for very big sites.

## Pagination

Pagination is the links to the previous and next HTML pages in your books. By default these links appear at the bottom of each page.

You define pagination for `web` and `app` output separately, so that they can differ if you need them to.

See [Pagination](../layout/web-pagination.html) for details.

## Annotation

You can turn on open annotation with [Hypothes.is](https://hypothes.is) by setting the `annotator` settings for the development and/or live versions of your website to `true` (i.e. annotation on) or `false` (i.e. annotation off).

By default, the template turns annotation for development, and off for live. This is because annotation can be useful during development for discussing changes within a team.

## Bookmarks

Web and app users can save their places in books using the bookmarks function.

Bookmark locations are saved in their browser's local storage. Note that if they delete their browser's website data, they will lose their bookmarks.

You can turn bookmarks on or off in `settings.yml` in the settings for `web` and `app` formats.

## Epub settings

You'll need to adjust the epub settings if you want to embed fonts or hide the epub's nav element. See [Epub output](../output/epub-output.html) for details.

## App settings

Among other things, this is where you enable a Google Play expansion file, if you need one for a large app. This is a rare need, so by default this is off (`false`).

``` yaml
google-play-expansion-file-enabled: false
google-play-public-api-key: ""
```

## External media

If a large number of images makes your project too big, you can store your images in a separate location. See [External media](../images/external-media.html) for details.

## SVG injection

If you link to SVG images, in web output we can inject those SVGs into the page as inline XML. This makes their text selectable and searchable, and lets you target their elements with CSS. For instance, they can then get site-wide font faces.

You turn SVG injection off or on by changing this value:

```yaml
web:
  svg:
    inject: true
```

{% raw %}
When this is `true`, SVG injection happens automatically for all images added with `{% include figure %}` or `{% include image %}`, and to any image to which you apply the class `inject-svg`. To turn off SVG-injection for a specific image only, add the class `no-inject-svg` to it.
{% endraw %}

Injecting SVGs can have side-effects, depending how your SVGs are created and coded. If you are going to inject SVGs, we recommend:

- Your SVGs should have inline styles (Illustrator called these 'Style attributes'), not stylesheets in `<style>` elements. If different SVGs use the same class names for different styles, they all inherit each other's styles, ruining your SVGs.
- If font names in your SVGs are different from the font names you use in your site CSS, adjust the font names in `assets/js/svg-management.js`. That script can replace font-family names in SVGs after injection.
- All SVGs must have a [`viewBox` attribute](https://css-tricks.com/scale-svg/#article-header-id-3) for correct sizing. Good programs like Illustrator will add this automatically. Otherwise you should add it yourself to the SVG you save in your book's `_source` images.

For more on SVG processing, see ['SVG processing'](../images/svg-processing.html) in the Images section.
