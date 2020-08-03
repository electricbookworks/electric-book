// Load settings.yml into a settings array.

// Fetch specific values from settings.yml and
// convert them into a Javascript object called settings.
// Note that some YAML keys use hyphens, which are invalid JS. 
// So to use them as variables, use square brackets and quotes,
// e.g. search['search-placeholder'].
// NB: The generated settings load in client-side Javascript, so
// do not include any settings that should not be publicly available.

// Create default settings object
var settings = {
    site: {
        baseurl: '',
        output: 'web'
    },
    web: {
        images: {
            lazyload: true
        }
    }
};

// Override default settings from Jekyll config
{% if site.baseurl %}
settings.site.baseurl = '{{ site.baseurl }}';
{% endif %}

{% if site.output %}
settings.site.output = '{{ site.output }}';
{% endif %}

// Override default settings from settings.yml
{% if site.data.settings.web.images.lazyload %}
settings.web.images.lazyload = {{ site.data.settings.web.images.lazyload }};
{% else %}
settings.web.images.lazyload = false;
{% endif %}
