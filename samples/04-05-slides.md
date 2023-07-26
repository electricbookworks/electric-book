---
title: "Slides"
---

## Slides

You can gather a number of figures into a set of slides. On the web and in apps, you can click through the slides. In print, you'll see one summary slide, and step-by-step text below the image describing each stage in the slide sequence. In epub, you'll see the summary slide, then each slide in turn, with its slide caption.

{% if site.output == "web" %}
[See the docs](https://electricbookworks.github.io/electric-book/docs/editing/slides.html) for how to create a slide sequence like this.
{% endif %}

<div class="slides wide">

{% include figure
    image="cats.jpg"
    reference="Slide 1"
    caption="Three stages of an artistic way to draw animal shapes."
    alt-text="Pencil sketch of an animal character as the combination of loosely drawn primitives of varying size. In the top row in its simplest form as a series of ovals of varying sizes positioned at important junctions and capturing some of the main body parts. The particular orientations and combinations of these primitives indicate different body poses and leads to an animation of natural-looking movements. In the middle row details are added, some shading is shown. In the bottom row some of the initial drawn primitive outlines are erased, while other details are added as well as shadows."
    source="['Medialness and the Perception of Visual Art'](https://brill.com/view/journals/artp/5/2/article-p169_169.xml?language=en), Frederic Fol Leymarie and Prashant Aparajeya, in *Art & Perception* 5:2."
    class="summary"
%}

{% include figure
    image="cats-a.jpg"
    reference="Slide 1a"
    slide-caption="Ovals of varying sizes positioned at important junctions and capturing some of the main body parts. The particular orientations and combinations of these primitives indicate different body poses and leads to an animation of natural-looking movements."
    alt-text="A series of ovals of varying sizes positioned at important junctions and capturing some of the main body parts. The particular orientations and combinations of these primitives indicate different body poses and leads to an animation of natural-looking movements."
    title="Simple ovals capture main body parts"
%}

{% include figure
    image="cats-b.jpg"
    reference="Slide 1b"
    slide-caption="Details are added and some shading is shown."
    alt-text="Details and shading are added to the original ovals."
    title="Adding detail"
%}

{% include figure
    image="cats-c.jpg"
    reference="Slide 1c"
    slide-caption="Some of the initial primitive outlines are erased, and further details and shadows are added."
    alt-text="Some of the initial primitive outlines are erased, and further details and shadows are added."
    title="Further detail and shadows"
    class="column-break-before"
%}

</div>
