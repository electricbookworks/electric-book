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

Note: never include a trailing slash at the end of your `remote-media` URLs. If you do, the resulting full URL to images will include two slashes. If you're using SVGs, they will not be injected properly for CORS reasons.

To disable external media, comment out the relevant settings, e.g. to only use remote media for development, but not for a live website:

``` yaml
remote-media:
  # live: ""
  development: "https://dev.superpotatoes.com/media"
```

### Testing new images with remote media

Sometimes, you want to test a new image (e.g. an SVG you're editing iteratively). Once it's committed to version control, the image will load from a remote-media repo, which is served online. But you don't want to commit the new image to version control until you've got it right. You also don't want to spin up an entire separate media repo to test just a few new images.

So you need to load the testing version temporarily, to see it in place, while you work on it.

To do this, you can serve your testing image(s) and enter their location in `_data/settings.yml`. Here is a recommended method for doing this.

#### Preparing your testing image(s)

1. Create a fresh copy of the Electric Book template for testing with. Unless your book is in its repo's `book` folder, rename the `book` folder in the testing template to match the name of your book.
1. Let's say it's called `spacepotatoes`. Put *only* your testing image in `spacepotatoes/images/_source`.
1. Then, as you would with any book, process the source image(s) using the command `npm run eb -- images -b spacepotatoes`. You should now have generated copies of your testing images for each output format in `spacepotatoes/images/`.

   Note: If your project uses special image settings in `_data/images.yml`, copy that file to `_data/images.yml` in your testing repo before processing your source images.

#### Serving your testing image(s)

Now you can serve your testing image(s). You have two options.

- Run this command in the root folder of the testing template (then entering `y` if prompted):

  ```sh
  npx http-server --cors
  ```

  That will run a website version of your testing template, and its URL will appear in the terminal. Copy the URL and paste it in as the `testing` url in `settings.yml`. E.g.:

  ``` yaml
  remote-media:
    # live: ""
    # development: ""
    testing: "http://127.0.0.1:8080"
  ```

- Run the usual EBT output script with the `--cors` option:

  ```
  npm run eb -- output --cors
  ```

  That will run a full Jekyll build of your testing template, and its URL will appear in the terminal. Copy the URL and paste it *including the repo's base URL* (e.g. `/electric-book`) in as the `testing` url in `settings.yml`. E.g.:

  ``` yaml
  remote-media:
    # live: ""
    # development: ""
    testing: "http://127.0.0.1:8080/electric-book"
  ```

Now, when you build your book as a website or PDF, you'll see the testing image.

#### Tips and troubleshooting

- Testing images work in web and PDF outputs only. For PDF testing images to work, the `remote-media > testing` location should be a full URL, not local file path. That is, it must start with `http`. This is because the script that loads testing images needs to check over HTTP whether a testing image exists.
- Testing images do not work with epub or app outputs. Those outputs require images to exist locally (i.e. in the content repo) when building. Instead, you can temporarily replace the relevant images with their testing versions before you generate an epub or app.
- If you're using GitPod to serve your testing images, GitPod will route your `http-server` URL through a public-facing GitPod URL, and prompt you about that. You need the public GitPod URL for `testing` in `settings.yml`. When prompted, click 'Make public'. You may also need to go to 'Ports', in a tab beside 'Terminal', to get the URL and make its port public. The public URL will something like `https://8080-githubname-reponame-8mktdixc1yt.ws-eu114.gitpod.io`. Ensure you *do not* include a trailing slash when entering the URL in `settings.yml`.
- If your testing images are very large, PDF output may stall, because Prince has to fetch each image just to check that it exists. If your PDF output is stalling with testing images, try reducing their file size, or testing with screen PDF rather than print PDF output. Screen PDF images are generally smaller than print PDF images.

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
