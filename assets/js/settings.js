// Load settings.yml into a settings array.

// Fetch specific values from settings.yml and
// convert them into a Javascript object called settings.
// Note that some YAML keys use hyphens, which are invalid JS.
// So to use them as variables, use square brackets and quotes,
// e.g. search['search-placeholder'].
// NB: The generated settings load in client-side Javascript, so
// do not include any settings that should not be publicly available.

// Make Jekyll metadata available to Liquid
{% include metadata %}

// Create default settings object
var settings = {
    site: {
        baseurl: '',
        output: 'web',
        docs: false
    },
    dynamicIndexing: true,
    web: {
        images: {
            lazyload: true
        },
        bookmarks: {
            enabled: true,
            elements: {
                include: '.content [id]',
                exclude: ''
            }
        },
        accordion: {
            enabled: true,
            level: 'h2'
        },
        search: {
            jumpBoxLocation: 'mainHeading'
        }
    },
    app: {
        bookmarks: {
            enabled: true,
            elements: {
                include: '.content [id]',
                exclude: ''
            }
        },
        accordion: {
            enabled: true,
            level: 'h2',
            autoClose: false
        },
        search: {
            jumpBoxLocation: 'mainHeading'
        }
    }
};

// Override default settings from Jekyll config

// Web settings

{% if site.baseurl %}
settings.site.baseurl = '{{ site.baseurl }}'
{% endif %}

{% if site.output %}
settings.site.output = '{{ site.output }}'
{% endif %}

{% if site.data.settings.dynamic-indexing != nil %}
settings.dynamicIndexing = {{ site.data.settings.dynamic-indexing }}
{% endif %}

// Override default settings from settings.yml
{% if site.data.settings.web.images.lazyload != nil %}
settings.web.images.lazyload = {{ site.data.settings.web.images.lazyload }}
{% endif %}

{% if site.data.settings.web.bookmarks != nil %}
settings.web.bookmarks.enabled = {{ site.data.settings.web.bookmarks }}
{% endif %}

{% if site.data.settings.web.accordion != nil %}
settings.web.accordion.enabled = {{ site.data.settings.web.accordion }}
{% endif %}

{% if site.data.settings.web.accordion-level != nil %}
settings.web.accordion.level = '{{ site.data.settings.web.accordion-level }}'
{% endif %}

{% if site.data.settings.web.accordion-auto-close != nil %}
settings.web.accordion.autoClose = {{ site.data.settings.web.accordion-auto-close }}
{% endif %}

{% if site.data.settings.web.search.jump-box-location != nil %}
settings.web.search.jumpBoxLocation = '{{ site.data.settings.web.search.jump-box-location }}'
{% endif %}

// App settings

{% if site.data.settings.app.accordion != nil %}
settings.app.accordion.enabled = {{ site.data.settings.app.accordion }}
{% endif %}

{% if site.data.settings.app.accordion-level != nil %}
settings.app.accordion.level = '{{ site.data.settings.app.accordion-level }}'
{% endif %}

{% if site.data.settings.app.accordion-auto-close != nil %}
settings.app.accordion.autoClose = {{ site.data.settings.app.accordion-auto-close }}
{% endif %}

{% if site.data.settings.app.search.jump-box-location != nil %}
settings.app.search.jumpBoxLocation = '{{ site.data.settings.app.search.jump-box-location }}'
{% endif %}

{% if output-docs %}
settings.site.docs = true
{% endif %}
