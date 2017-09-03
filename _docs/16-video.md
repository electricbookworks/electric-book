---
title: Video
---

# Embedding video

You can include any iframe in markdown to embed a video. We've created a simple way to embed YouTube videos and have them look consistent across your web version.

{% raw %}

1.	Find the video's YouTube ID: a code in the URL that looks like this: `MqlyxZiDoOA`
2.	In the markdown, use the ID in this tag: `{% include youtube id="MqlyxZiDoOA" %}`

{% endraw %}

This will embed the video in an iframe. (In epub output, you can replace it with a link to watch the video online.)

{% include youtube id="MqlyxZiDoOA" %}

Note: Our default iframe code gives the iframe a `.non-printing` class, so that your theme can hide the video from the PDF edition.
{:.box}

For now, this only works with YouTube. If you're embedding from any other service, instead of using our `include` tags:

*	use their standard embed iframe
*	try to select a width of around 850 px
*	add `style="max-width: 100%;"` and `class="non-printing"` to the iframe tag.
