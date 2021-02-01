---
title: API
---

# API for {{ site.data.meta.project.name }}

This page describes the read-only API for {{ site.data.meta.project.name }}.

You'll find a RAML definition for the API in [{{ site.baseurl }}/api/definition/definition.raml]({{ site.baseurl }}/api/definition/definition.raml).

There are currently two API endpoints: `/meta` and `/content`:

- [`/meta`]({{ site.baseurl }}/api/meta/index.json) returns a JSON object containing all project metadata.
- [`/content`]({{ site.baseurl }}/api/content/index.json) returns a JSON object listing URLs for files in each book.
