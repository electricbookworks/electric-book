---
title: "Page-opener images"
categories:
  - layout
order: 3
---

# Page-opener images

You can add a single, big opening image to each page. This image is set in the page's top-of-page YAML. You can define:

- the image to use as `opener-image`
- alt text for the image as `opener-image-alt-text`
- which area of the image to focus on, when the screen size and shape crops the image, as `opener-image-position`. This follows the properties for [CSS object-position](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position).

For example, the landing page for the template has:

```YAML
opener-image: "banner-image.jpg"
opener-image-alt-text: "An illustration of an enormous book. It is open, and its pages are each filled with an image of a starry sky. Beside the book, a man stands and looks at the pages. The book is bigger than he is."
opener-image-position: "0 60%"
```

While the `opener-image-alt-text` is optional, it's highly recommended for accessibility and SEO. The `opener-image-position` is optional, and defaults to focus on the center of the image.

Images used on pages inside a book folder should be saved in the same place as other images for that book: in the book's `images/_source` folder and then [automatically converted for the various output formats](image-conversions.html).

Images used on non-book pages like the landing, contact, about, and search pages should be saved to `assets/images/_source`, and then also [converted](image-conversions.html).
