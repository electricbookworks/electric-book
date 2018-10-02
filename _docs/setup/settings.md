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
- full breadcrumbs that include the project name, book title, all labels listed in `nav` in `_data/meta.yml`, and the page title (setting: `breadcrumbs`).

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
