---
title: Title page
style: title-page
---

{% include get-slug.html %}

{{ site.data.meta.titles.[slug].title }}
{:.title-page-title}

{{ site.data.meta.titles.[slug].subtitle }}
{:.title-page-subtitle}

{{ site.data.meta.titles.[slug].creator }}
{:.title-page-author}

{{ site.data.meta.titles.[slug].publisher }}
{:.title-page-publisher}
