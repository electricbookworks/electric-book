---
title: External media
categories: images
order: 4
---

# External media
{:.no_toc}

* toc
{:toc}

If a large number of images makes your project too big, you can store your images in a separate repo and serve them on a separate server for PDF and web output.

There is a template repo for external media at [github.com/electricbookworks/electric-book-media](https://github.com/electricbookworks/electric-book-media).

## Setting external-media paths

You set the full URL for the `remote-media` location in `_data/settings.yml`. The `remote-media` paths must be full URLs. For example:

``` yaml
remote-media:
  live: "https://media.superpotatoes.com"
  development: "https://dev.superpotatoes.com/media"
```

To disable external media, comment out the relevant settings, e.g. to only use remote media for development, but not for a live website:

``` yaml
remote-media:
  # live: ""
  development: "https://dev.superpotatoes.com/media"
```

## Structuring external-media files

At the remote-media domain, the paths to media should match the paths to that media in this project.

For example, if a project called `superpotatoes` contains two books, `mondial` and `fabula`, the remote-media URL might be `https://media.superpotatoes.com`. And on that media server, web images would be stored in `https://media.superpotatoes.com/mondial/images/web` and `https://media.superpotatoes.com/fabula/images/web`.

Images inserted by CSS (e.g. `background-image` files) cannot be in external media, because their paths are fixed in CSS. So do not move these to the external media location.

## Epub and app output

External media does not work for app or epub output. For apps with enough images to warrant external media, it's recommended that you use a separate Cordova-based repo for your app, into the `www` folder of which which you simply copy-paste your app-ready HTML.

## Translations

When using remote-media, translations must have their own image files in their translation subdirectories (e.g. `https://superpotatoes.com/mondial/fr/images/web`). That is, unlike local images they cannot inherit their parent language's images in the absence of their own `images` folder.

## Local media

Remote media works well for web output, but it means you have to be online, and can make PDF output very slow, because Prince has to fetch every image over the Internet. For faster PDF output you can tell the system to use images on your local machine instead by setting a `local-media` path, in addition to `remote-media`.

When a `local-media` path is set, PDF outputs will use that path to images, so that Prince does not have to fetch every image over the Internet.

The local-media path can be set in two ways:

1. As a path on your computer's filesystem, relative to the `_site` folder.
2. As a URL served locally, by a webserver running on your machine.

### Setting a filesystem path

A relative filesystem path might look like this:

``` yaml
local-media:
  development: "../../superpotatoes-media"
```

Note: Setting a `live` local-media path has no effect. Local, external media is only useful for development anyway. The `development` build is the default build type. A `live` build only applies to web builds. We set `build: live` in `_config.live.yml`, which is generally only used for building live websites.
{:.box}

We recommend that you store your local copy of the external-media directory alongside the main project repo directory, to make the filesystem path to the local images simple.

To use external media from a directory alongside the main project repo, then, you would write the path to go up two levels (`../../`) and into the external media directory, as shown above.

### Setting a local URL

Web output cannot use a relative filesystem path, because a webserver cannot see outside of its own root directory on your filesystem.

So you can use a webserver running on your own machine for offline development, e.g.

``` yaml
local-media:
  development: "http://localhost:5000"
```

If you use the `electric-book-media` template for your external media repo, the OS-specific `run-` scripts there will launch a local server running at that address. You can run it at the same time as your local Jekyll instance of your book project.
