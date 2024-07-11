---
title: SEO, social media, and sharing
categories: setup
order: 35
---

# {{ page.title }}

The template supports many of the most important features you need for good search-engine rankings and good visibility when pages are shared on social media.

You do need to make sure the relevant information, text and images are set up. Here are some of the most important.

## Project-wide information

Make sure that your project's information in `_data/project.yml` is complete, and that the image you define there is in `assets/images/_source` and has been [processed](../images/image-conversions.html).

This information is the default fallback for any page without its own information.

## Page-specific information

Each markdown file will be its own web page. At the top of the file, in the top-of-page YAML, you can specify the following information:

- the `title`
- the `image` that will appear when the page is shared online. For markdown files in a book folder, the image must be among that book's images. For markdown files outside of a book (like the `index.md` home-page and `about.md` page), the image must be among those in `assets/images`.
- the short `description` that will appear when the page is shared online.

Here you can also define other information that is used in the template and might be used elsewhere in future:

- the `image-position` defines where to focus on the image when it is cropped (this follows [CSS object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position) syntax), for example in the [`visual-toc`](../layout/landing-page.html#a-visual-table-of-contents) that you can include on your landing page.
- the `opener-image` defines the image to use at the top of the page
- the `opener-image-alt-text` sets the alt text for that opener image
- the `opener-image-position` sets where to focus on the image when it is cropped.
