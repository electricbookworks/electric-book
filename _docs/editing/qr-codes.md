---
title: QR codes
categories: editing
order: 12
---

# Adding QR codes
{:.no_toc}

While QR codes are not beautiful, sometimes they are a useful way to let readers get from a printed page to a website quickly and easily. You can include QR codes in PDF outputs. (They are currently not supported or shown in other output formats.)

To add a QR code, use the `include qr-code` tag. It takes these arguments:

- `content`: this is what the QR code encodes, usually a link. The `content` argument is required. If you are including a link, ensure it's a full URL including the `https://`. Technically, QR codes can contain any kind of text.
- `show-content`: if this optional argument is included or set to `true`, the `content` will appear in text below the code.
- `caption`: this is optional. This is text that will be shown below the code image and the link. For example, it can include instructions to users on how and why to scan the QR code. You can include markdown in the caption.

This is an example:

{% raw %}
```
{% include qr-code
  content="https://electricbookworks.com"
  caption="Scan this code to visit the Electric Book Works website."
%}
```
{% endraw %}
