// Load _config items into an object.

let config = {}

config.baseUrl = ''

{% if site.baseurl %}
// Override from Jekyll config
config.baseUrl = '{{ site.baseurl }}'
{% endif %}

config.format = 'web'

{% if site.output %}
// Override from Jekyll config
config.format = '{{ site.output }}'
{% endif %}

// Alias
config.output = config.format

// in absence of module dependencies, safest for now
// is to attach to window for use by other scripts
window.config = config
