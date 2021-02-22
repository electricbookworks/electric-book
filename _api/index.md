---
title: API
---

# API for {{ site.data.meta.project.name }}

This page describes the read-only API for {{ site.data.meta.project.name }}.

You'll find a simple RAML definition for the API in [api/definition/definition.raml](https://github.com/electricbookworks/electric-book/tree/api-poc/_api/definition). You can open this in a [RAML editor](https://rawgit.com/mulesoft/api-designer/master/dist/index.html#/?xDisableProxy=true).

There are currently two API endpoints: `/meta` and `/content`:

- [`/meta`]({{ site.baseurl }}/api/meta/index.json) returns a JSON object containing all project metadata.
- [`/content`]({{ site.baseurl }}/api/content/index.json) returns a JSON object listing URLs for files in each book.
