{% comment %} This will include the book-index-
filename for the format being generated. {% endcomment %}

{% if site.output == "print-pdf" %}
    {% include_relative book-index-print-pdf.js %}
{% elsif site.output == "screen-pdf" %}
    {% include_relative book-index-screen-pdf.js %}
{% elsif site.output == "web" %}
    {% include_relative book-index-web.js %}
{% elsif site.output == "epub" %}
    {% include_relative book-index-epub.js %}
{% elsif site.output == "app" %}
    {% include_relative book-index-app.js %}
{% endif %}
