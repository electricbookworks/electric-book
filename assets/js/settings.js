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
    web: {
        images: {
            lazyload: true
        }
    }
};

// Override default settings from settings.yml
settings.web.images.lazyload = {{ site.data.settings.web.images.lazyload }};
