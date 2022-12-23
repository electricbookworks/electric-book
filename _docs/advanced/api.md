---
title: API
categories: advanced
---

# API
{:.no_toc}

* Page contents
{:toc}

The template includes a basic API for fetching its metadata and content in a JSON format.

To activate the API, turn on the `api` collection in `_config.yml`:

```yml
collections:
  api:
    output: true
```

Note that if you don't need the API, leave it off, since generating it will add time to your site builds.

There is documentation on the API in `_api/index.md`. When the API is on, you can visit that page at [{{ site.baseurl }}/api]({{ site.baseurl }}/api).
