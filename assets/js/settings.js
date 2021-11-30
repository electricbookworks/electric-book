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
        },
        bookmarks: {
            enabled: true,
            synchronise: false,
            elements: {
                include: '#content [id]',
                exclude: ''
            },
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
{% if site.data.settings.web.images.lazyload != nil %}
settings.web.images.lazyload = {{ site.data.settings.web.images.lazyload }};
{% endif %}

{% if site.data.settings.web.bookmarks.enabled != nil %}
settings.web.bookmarks.enabled = {{ site.data.settings.web.bookmarks.enabled }};
{% endif %}

{% if site.data.settings.web.bookmarks.synchronise != nil %}
settings.web.bookmarks.synchronise = {{ site.data.settings.web.bookmarks.synchronise }};
{% endif %}

