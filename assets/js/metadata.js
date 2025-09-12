// Load _data/works into an object.

// Load _data/works data as a Javascript object called metadata.

// {% include metadata %}

let metadata = {}
metadata.works = {{ site.data.works | jsonify | safe }}
// in absence of module dependencies, safest for now is to attach to window for use by other scripts
window.metadata = metadata