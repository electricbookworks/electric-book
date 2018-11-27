---
title: Video
categories: editing
order: 11
---

# Embedding video
{:.no_toc}

* Page contents
{:toc}

You can include any iframe in markdown to embed a video. We've created a simple way to embed videos from YouTube and Vimeo.

## Embed from YouTube or Vimeo

1. Find the video's ID. On YouTube, this is a code in the URL that looks like this: `MqlyxZiDoOA`. On Vimeo, it's a string of numbers in the URL like this: `75421736`.
2. In your markdown, use the ID in either this YouTube tag:

    {% raw %}

    `{% include youtube id="MqlyxZiDoOA" %}`

    or this vimeo tag:

    `{% include vimeo id="75421736" %}`

    {% endraw %}

This will embed the video like this for YouTube:

{% include youtube id="MqlyxZiDoOA" %}

and this for Vimeo:

{% include vimeo id="75421736" %}

## Cover images

In web output, when a user is online, we can automatically fetch the video cover image for YouTube videos. This isn't currently possible with Vimeo.

So it's best to specify an image to use as the cover image by adding an `image` parameter to the tag, like this:

{% raw %}
```
{% include youtube
    id="MqlyxZiDoOA"
    image="peppa.jpg"
%}
```
{% endraw %}

Save the image file to your book's images folders [in the usual way](../images/adding-image-files.html).

## Custom classes

You can also add a class to the video to target it with custom CSS, like this:

{% raw %}
```
{% include youtube
    id="MqlyxZiDoOA"
    class="kids-video"
%}
```
{% endraw %}

## Descriptions

You can add a description that will appear as a caption below the video like this:

{% raw %}
```
{% include youtube
    id="MqlyxZiDoOA"
    description="Daddy Pig's puddle-jumping world record is broken! Can he win it back?"
%}
```
{% endraw %}

## Links

You can add a clickable link to a video. This is especially useful for screen PDFs and epubs, where users might need to click to launch their web browser or video player.

{% raw %}
```
{% include youtube
    id="MqlyxZiDoOA"
    description="Daddy Pig's puddle-jumping world record is broken! Can he win it back?"
    link="https://www.youtube.com/watch?v=MqlyxZiDoOA"
%}
```
{% endraw %}

## Subtitles

If the video you're embedding has subtitles, you can turn them on by adding `subtitles="true"` to your include tag:

{% raw %}
```
{% include youtube
    id="MqlyxZiDoOA"
    subtitles="true"
%}
```
{% endraw %}

By default, the language used will be the language of the book you're editing. So, if you're editing the French translation of a book, and the video has French subtitles, those will be shown.

If you want to specify that subtitles should show in a particular language (that the video actually supports), then add `language="xx"`, too, where `xx` is the language code. For instance, to specify that German subtitles should show:

{% raw %}
```
{% include youtube
    id="MqlyxZiDoOA"
    subtitles="true"
    language="de"
%}
```
{% endraw %}

These subtitles and language options currently only work with YouTube videos.

## Other services

If you're embedding from any other service, instead of using our `include` tags:

* use their standard embed iframe
* try to select a width of around 850 px
* add `style="max-width: 100%;"`
* add `class="non-printing"` to the iframe tag to hide it from PDF output.
