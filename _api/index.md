---
title: API
---

{% include metadata %}

# API for {{ project-name }}

This page describes the read-only API for {{ project-name }}.

There are currently these endpoints:

- [`{{ site.baseurl }}/api/metadata`]({{ site.baseurl }}/api/metadata/index.json) is a JSON object containing all project metadata. This includes information about the project like its name and the publications in it, as well as the filenames of each page in each book.
- [`{{ site.baseurl }}/api/content`]({{ site.baseurl }}/api/content/index.json) is a JSON array containing all pages on the site, with their URLs, titles and content.
- Each page on the site has its own JSON object:\\
  `{{ site.baseurl }}/api/content/{booktitle}/{filename}`\\
  Translated pages include the language code in their path:\\
  `{{ site.baseurl }}/api/content/{booktitle}/{code}/{filename}`

These are not sophisticated API endpoints! On the webserver, they are just flat `index.json` files.

## Refreshing API content

The `metadata` is refreshed with every site build. The `content` must be manually regenerated when a human editor runs the `index` command to refresh the web-search index.

## API definition

You'll find a simple RAML definition for the API in [{{ site.baseurl }}/api/definition/definition.raml]({{ site.baseurl }}/api/definition/definition.raml). It refers to these example files:

- [example-metadata.json](definition/example-metadata.json)
- [example-content.json](definition/example-content.json)
- [example-content-file.json](definition/example-content-file.json)
- [example-content-file-translated.json](definition/example-content-file-translated.json)

To read the definition in a nice interface, you can download the definition and the example files and open them in a [RAML editor](https://rawgit.com/mulesoft/api-designer/master/dist/index.html#/?xDisableProxy=true).
