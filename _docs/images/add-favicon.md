---
title: Adding a favicon
categories: images
order: 5
---

# Adding a favicon

To add a favicon (the website icon in a browser tab), add a PNG image called `favicon.png` to the `assets/images/_source` folder, and then process the images in `assets`:

```sh
npm run eb -- images --book assets
```

We recommend using a very small, simple image, 64px square.
