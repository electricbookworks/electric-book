---
title: External media
categories: images
order: 4
---

# External media

If a large number of images makes your project too big, you can store your images in a separate repo and serve them on a separate server for PDF and web output.

There is a template repo for external media at [github.com/electricbookworks/electric-book-media](https://github.com/electricbookworks/electric-book-media).

## Setting external-media paths

You set the full URL for the `remote-media` location in `_data/settings.yml`. For example:

```
remote-media:
  live: "http://media.superpotatoes.com"
  development: "http://dev.superpotatoes.com/media"
```

To disable external media, just comment out the relevant settings or leave the values blank:

```
remote-media:
  live: ""
  development: ""
```

## Structuring external-media files

At the remote-media domain, the paths to media should match the paths to that media in this project.

For example, if a project called `superpotatoes` contains two books, `mondial` and `fabula`, the remote-media URL might be `http://media.superpotatoes.com`. And on that media server, web images would be stored in `http://media.superpotatoes.com/mondial/images/web` and `http://media.superpotatoes.com/fabula/images/web`.

## Epub and app output

External media does not work for app or epub output. For apps with enough images to warrant external media, it's recommended that you use a separate Cordova-based repo for your app, into the `www` folder of which which you simply copy-paste your app-ready HTML.

## Translations

When using remote-media, translations must have their own image files in their translation subdirectories (e.g. `http://superpotatoes.com/mondial/fr/images/web`). That is, unlike local images they cannot inherit their parent language's images in the absence of their own `images` folder.

## Local media

Remote media works well for web output (while you're online at least), but can make PDF output very slow, because Prince has to fetch every image over the Internet. For faster PDF output you can tell the system to use images on your local machine instead by setting a `local-media` path, in addition to `remote-media`. For example:

```
local-media:
  live: ""
  development: ""
```

(Currently, the `live` local-media path is not used; but this might change in future. For example, the Electric Book Manager may use the `live` setting. So we recommend setting both for now.)

When a `local-media` path is set, PDF outputs will use that path to images, so that Prince does not have to fetch every image over the Internet. Web output cannot use a `local-media` path, because the webserver cannot see outside of its root directory on your file system.

The local-media path is a relative path on your computer; relative to the `_site` folder.

So we recommend that you store your local copy of the external-media directory alongside the main project repo directory, to make the path to the local images simple.

To use external media from a directory alongside the main project repo, then, you would write the path to go up two levels (`../../`) and into the external media directory. E.g.:

```
local-media:
  development: "../../superpotatoes-media"
```

Note: The `development` build is the default build type. A `live` build only really applies to web builds. The `build: live` config is set in `_config.live.yml`, which is generally only used for building live website packages.
{:.box}
