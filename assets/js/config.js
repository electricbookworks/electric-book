// Load _config items into an object.

const config = {}

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

config.activeVariant = 'default'
{% if site.data.settings.active-variant and site.data.settings.active-variant != "" %}
config.activeVariant = {{ site.data.settings.active-variant | jsonify | safe }}
{% endif %}
{% if site.active-variant and site.active-variant != "" %}
config.activeVariant = {{ site.active-variant | jsonify | safe }}
{% endif %}
