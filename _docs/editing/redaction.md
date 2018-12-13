---
title: Redaction
categories: editing
order: 15
---

# Redaction

You can redact text and images in PDF output, and turn that redaction on or off. For instance, this is useful for textbook publishers in South Africa, where publishers need to redact mentions of their and the authors' names before their books are reviewed by government.

To redact content in PDF:

1. Add the `redact` class to any element you want to redact.
2. Set `redact: true` in `_data/settings.yml`.

The redaction turns images black and text to series of `x`es and a few other letters. The aim is to completely replace the original text, but as closely as possible retain text flow, which might have been manually refined.

*Note that this is only effective for PDF outputs.* While text and images will *appear* redacted in web, epub and app outputs, the redaction there is done only by client-side Javascript, so it's only a thin layer of redaction that can be easily turned off, and won't work at all without Javascript.

Should the need arise, in future we might add a preprocessor step (e.g. using gulp) to redact the HTML in the build process.
