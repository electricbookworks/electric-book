{% comment %} This will include the book-index-
filename for the format being generated. {% endcomment %}

{% if site.data.settings.dynamic-indexing == true %}

    {% capture book-index-filename %}book-index-{{ site.output }}.js{% endcapture %}
    {% capture book-index-filepath %}/assets/js/{{ book-index-filename }}{% endcapture %}

    {% comment %} Check if the file exists {% endcomment %}
    {% assign book-index-file-exists = false %}
    {% for static_file in site.static_files %}
        {% if static_file.path == book-index-filepath %}
            {% assign book-index-file-exists = true %}
            {% break %}
        {% endif %}
    {% endfor %}

    {% if book-index-file-exists %}

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

    {% endif %}

{% endif %}
