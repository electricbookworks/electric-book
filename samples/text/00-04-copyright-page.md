---
title: Copyright
style: copyright-page

# The Liquid tags here fetch metadata 
# from this book's YML file in _data
---

{% include metadata %}

# Copyright
{:.non-printing}

*{{ title }}*\\
Collection © {{ creator }}\\
Text © The contributors

{% unless print-pdf-identifier == "" %}ISBN ({{ print-pdf-format }}): {{ print-pdf-identifier }}{% endunless %}<br />
{% unless epub-identifier == "" %}ISBN ({{ epub-format }}): {{ epub-identifier }}{% endunless %}

{{ rights }}
