---
title: API
---

{% include metadata %}

# API for {{ project-name }}

This page describes the read-only API for {{ project-name }}.

There are currently two endpoints: [`/metadata`]({{ site.baseurl }}/api/metadata/index.json) and [`/content`]({{ site.baseurl }}/api/content/index.json):

- [`/metadata`]({{ site.baseurl }}/api/metadata/index.json) is a JSON object containing all project metadata (details about the project like its name and the publications in it).
- [`/content`]({{ site.baseurl }}/api/content/index.json) is a JSON array containing all pages on the site, with their URLs, titles and content.

(These are not sophisticated endpoints. On the webserver, they are just flat `index.json` files.)

The `metadata` is refreshed with every site build. The `content` must be manually regenerated when a human editor runs the `index` process to refresh the web-search index.

You'll find a simple RAML definition for the API in [api/definition/definition.raml]({{ site.baseurl }}/api/definition/definition.raml). This refers to two example files:

- [example-metadata.json](definition/example-metadata.json)
- [example-content.json](definition/example-content.json)

To read the definition in a nice interface, you can download the definition and the example files and open them in a [RAML editor](https://rawgit.com/mulesoft/api-designer/master/dist/index.html#/?xDisableProxy=true).
