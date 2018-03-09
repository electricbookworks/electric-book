---
title: External media
categories: images
order: 4
---

# External media

If a large number of images makes your project too big, you can store your images in a separate repo and serve them on a separate server for PDF and web output.

## Setting external-media paths

You set the full URL for the `remote-media` location in `_data/settings.yml`. For example:

```
remote-media:
  live: "http://media.example.com"
  development: "http://dev.example.com/media"
```

To disable external media, just comment out the relevant settings or leave the values blank:

```
remote-media:
  live: ""
  development: ""
```

## Structuring external-media files

At the remote-media domain, the paths to media should match the paths to that media in this project.

For example, if a project called `example` contains two books, `foobar` and `helloworld`, the remote-media URL might be `http://media.example.com`. And on that media server, web images would be stored in `http://media.example.com/foobar/images/web` and `http://media.example.com/helloworld/images/web`.

## Epub and app output

Note that remote-media does not work for app or epub output. For books with enough images to warrant remote-media, it's recommended that you use a separate repo for your app, and you won't have a sensibly sized epub anyway.

## Translations

When using remote-media, translations must have their own image files in their translation subdirectories (e.g. `http://example.com/foobar/fr/images/web`); that is, unlike local images they cannot inherit their parent language's images.

## Local media

Remote media works well for web output when you're online, but for faster PDF output you can tell the system to use images on your local machine instead.

You can set a `local-media` path, too, in addition to `remote-media`, like this (using example paths):

```
local-media:
  live: ""
  development: ""
```

(Currently, the `live` local media has no meaning, and only the `development` default is used; but this might change in future, for example the Electric Book Manager may use the `live` setting. So set both.)

When a `local-media` path is set, PDF outputs will use that local media, so that Prince does not have to fetch every image online. Web output generally cannot use a `local-media` path, because the webserver cannot see outside of its root directory on your file system.

The local-media path is set as a relative path on your computer, relative to the `_site` folder.

So we recommend that you store your local copy of the external-media directory alongside the main project repo directory, to make the path to it simple.

To use external media from a directory alongside the main project repo, then, you would write it to go up two levels (`../../`) and into the external media directory. E.g.:

```
local-media:
  development: "../../example-media"
```

Note: The `development` build is the default build type. A `live` build only really applies to web builds. The `build: live` config is set in `_config.live.yml`, which is generally only used for building live website packages.
{:.box}
