/*jslint node */

// This is a sample file included in the Electric Book Template
// for demonstration purposes.

// This function makes fonts display correctly, by doing three things:
// - adding a style element that imports Google fonts
// - replacing 'Asap-Medium' with 'Asap', font-weight 600
// - replacing 'Asap-Regular' with 'Asap'

function samplesFigure0102ASvg(xml) {

    xml.svg.defs = {
        style: '@import url("https://fonts.googleapis.com/css?family=Asap:400,400i,600,600i");'
    };

    // Get text element children of the SVG
    var svgTextElements = xml.svg.text;

    // Add text elements in g elements`recursively
    // to the svgTextElements array.
    function addGText(element) {
        var gElements = element.g;

        gElements.forEach(function (g) {
            var gTextElements = g.text;
            if (gTextElements) {
                gTextElements.forEach(function (gTextElement) {
                    svgTextElements.push(gTextElement);
                });
            }

            // If g contains another g, recur
            if (g.g) {
                addGText(g);
            }
        });
    }
    addGText(xml.svg);

    svgTextElements.forEach(function (element) {

        if (element.$['font-family'] === 'Asap-Regular') {
            element.$['font-family'] = 'Asap';
        }

        if (element.$['font-family'] === 'Asap-Medium') {
            element.$['font-family'] = 'Asap';
            element.$['font-weight'] = '600';
        }
    });

    return xml;
}

exports.samplesFigure0102ASvg = samplesFigure0102ASvg;
