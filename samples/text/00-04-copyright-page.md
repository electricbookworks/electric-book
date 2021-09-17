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
Text © {% if rightsholder != "" %}{{ rightsholder }}{% else %}{{ creator }}{% endif %}

{% include identifiers scheme="ISBN" %}

{{ rights }}
