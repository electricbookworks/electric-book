---
title: "Page-opener images"
categories:
  - layout
order: 3
---

# Page-opener images

You can add a single, big opening image to each page. This image is set in the page's top-of-page YAML. E.g. the landing page for the template has:

```YAML
opener-image: banner-image.jpg
opener-image-alt-text: "An illustration of an enormous book. It is open, and its pages are each filled with an image of a starry sky. Beside the book, a man stands and looks at the pages. The book is bigger than he is."
```

While the `opener-image-alt-text` is optional, it's highly recommended for accessibility and SEO.

Images used on pages inside a book folder should be saved in the same place as other images for that book: in the book's `images/_source` folder and then [automatically converted for the various output formats](image-conversions.html).

Images used on non-book pages like the landing, contact, about, and search pages should be saved to `assets/images/_source`, and then also [converted](image-conversions.html).
