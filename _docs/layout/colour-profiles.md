---
title: Colour profiles
categories:
  - layout
order: 5
---

# Colour profiles

Just as different people see colours differently, different machines display or print colours differently. We manage this variation with colour profiles: computer-readable files (usually with a `.icc` file extension) that define how a machine should process the colours in a document. For good printing and display, it's important to use profiles so that colours don't vary among machines and printers.

We use colour profiles in two places:

1. When [converting images](../images/image-conversions.html).
2. When [generating PDFs](../pdf-output.html).

The template provides a number of profiles for different uses. They are in `_tools/profiles`, where you can add your own profiles, too.

The profiles then used for automated image conversion are named in `gulpfile.js`. It takes technical know-how to edit a Gulp file, but you can find the `.icc` filenames in the existing Gulp file and carefully change them if you need to.

You can change the profile for a PDF in a book's `styles/print-pdf.scss` and `styles/screen-pdf.scss` files.

In high-end colour printing (e.g. photography or graphics arts), colour profiles should be discussed with your printer. The printer should provide a colour profile file suited specifically to your project and the printing press they will use to print it.

When printing in black and white, the darkness or lightness of images can be heavily influenced by the colour profile used. Here it is also a good idea to get an `.icc` file from your printer that's designed to be used with their particular press or digital printer.

That said, the profiles included here should be suitable for most uses:

> The PSO profiles are provided by eci.org. The sRGB profile is from color.org. The grey profiles were provided kindly by [digitaldistributors.co.za](https://digitaldistributors.co.za).
{:.sidenote}

- `sRGB_v4_ICC_preference_displayclass.icc` is for images and documents to be viewed on screens. Avoid using it for print PDF output.
- `PSOcoated_v3.icc` is for printing in full colour on coated paper.
- `PSOuncoated_v3_FOGRA52.icc` is for printing in full colour on uncoated paper.
- `Grey_Fogra39L.icc` is for printing in black and white. It follows ISO Curve B as per ISO 12647-2:2007 (M0 measurement condition).
- `Grey_Fogra52L.icc` is also for printing in black and white, and is newer than Fogra 39. It follows ISO Curve A as per ISO 12647-2:2013 (M1 measurement condition).
