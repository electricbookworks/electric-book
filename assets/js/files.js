{% for work in site.data.works %}
{% assign work-key = work[0] %}
{% assign work-pages = site.pages | where_exp: "page", "page.path contains work-key" | where_exp: "page", "page.name contains '.md'" %}
metadata.files['{{ work-key }}'] = [
{% for page in work-pages %}
    {% unless page.path contains "/" and page.path contains "/" != page.path | split: "/" | first %}{% continue %}{% endunless %}
    {% assign page-filename = page.name | split: "." | first %}
    {% assign excluded-styles = "cover,previous-publications-page,half-title-page,halftitle-page,title-page,copyright-page,contents-page,epigraph-page,dedication-page" | split: "," %}
    {% assign include-file = true %}
    {% for style in excluded-styles %}
        {% if style == page.style %}
            {% assign include-file = false %}
            {% break %}
        {% endif %}
    {% endfor %}
    {% if include-file %}
    {
        file: '{{ page-filename }}',
        title: '{% if page.title and page.title != "" %}{{ page.title | escape }}{% else %}{{ page-filename | capitalize }}{% endif %}',
        style: '{% if page.style %}{{ page.style }}{% endif %}',
        path: '{{ page.path | escape }}'
    }{% unless forloop.last %},{% endunless %}
    {% endif %}
{% endfor %}
]
{% endfor %}