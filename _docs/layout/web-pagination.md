---
title: Web and app pagination
categories: layout
order: 3
---

# Web and app pagination

Your web or app outputs may need links on each page to the next or previous pages. For instance, in a novel users will want to click to the next chapter when they finish a chapter. This is call pagination. It only applies to web and app outputs (not epub or PDF).

Pagination is created by the `pagination.html` include, which adds previous and next links. So you can manually add pagination links anywhere by using the tag {% raw %}`{% include pagination.html %}`,{% endraw %} but this is already included by default in all web and app outputs already, at the end of the page.

By default, pagination is added at the end of book files (in the `default` layout). It can be turned off in `settings.yml` in the `pagination` section of `web` and `app` settings.

The pagination format can also be changed there to use 'Next' and 'Previous', to use page titles, or to use arrows. Arrows are the default.

By adding a 'direction' parameter to the include tag, you can show only previous or next links. E.g. {% raw %}`{% template/pagination.html direction="next" %}`{% endraw %} will only output 'next' links.

The order of pagination is determined by the `files` list for each format in a book's YAML file in `_data/works`.
