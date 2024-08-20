---
title: "Video"
image: "book-and-kite.jpg"
description: "This page shows how video from YouTube and Vimeo can be added to a book."
---

## Video

The Electric Book template includes a tag for easily inserting videos from YouTube and Vimeo. [See the docs for more](https://electricbookworks.github.io/electric-book/docs/editing/video.html).

In this example, we have a YouTube video, without a description, set to start 14 seconds in. There's an option to watch it elsewhere, too, which won't show on PDF by default.

{% include video id="oXkSfqmzG1o" start="14" options="
[Watch on Bilibili](https://www.bilibili.com/video/BV1tG4y1L7u2/)" %}

And a Vimeo one, set to start 5 seconds in.

{% include video host="vimeo" id="113933422" link="https://www.vimeo.com/113933422" description="The Hey Duggee series trailer" start="5" %}

Neither have thumbnail images specified. On the web, if an image hasn't been specified here, when you're online the page will fetch a thumbnail for YouTube videos automatically. For Vimeo and in other formats (PDF, epub, app), you'll get a placeholder.

Clicking the description will take you to the video online (except in print-PDF, where the print-ready PDF's profile doesn't allow clickable links).
