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
Text © {{ creator }}

{% include identifiers scheme="ISBN" %}

{{ rights }}
