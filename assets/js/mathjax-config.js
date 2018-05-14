{% comment %}
Mathjax configuration
Note that configs are different for pdf, epub and web.
{% endcomment %}

{% if site.mathjax-enabled == true %}

    {% if site.output == "print-pdf" or site.output == "screen-pdf" %}

        MathJax.Hub.Config({
            messageStyle: "none",
            "SVG": {
                scale: 75,
                font: "{% if page.mathjax-font %}{{ page.mathjax-font }}{% else %}{{ site.mathjax-font }}{% endif %}",
                matchFontHeight: false,
                styles: {
                    ".MathJax [style*=border-top-width]": {
                        "border-top-width": "0.5pt ! important"
                    }
                }
            }
        });
        MathJax.Hub.Queue(
            // fires after MathJax is done
            function () {
                if (typeof window.callPhantom === 'function') {
                    window.callPhantom({ mathJaxDone: true});
                }
            }
        );

    {% elsif site.output == "epub" %}

        <!--See https://www.peterkrautzberger.org/0129/ -->
        MathJax.Hub.Config({
          jax: ["input/TeX","input/MathML","output/SVG"],
          extensions: ["tex2jax.js","mml2jax.js","MathEvents.js"],
          TeX: {
            extensions: ["noErrors.js","noUndefined.js","autoload-all.js"]
          },
          MathMenu: {
            showRenderer: false
          },
          menuSettings: {
            zoom: "Click"
          },
          messageStyle: "none",
          SVG: {
            scale: 90,
            linebreaks: {
              automatic: true,
              width: "container",
            },
          },
        });

    {% elsif site.output == "app" %}

        <!--See https://www.peterkrautzberger.org/0129/ -->
        MathJax.Hub.Config({
          jax: ["input/TeX","input/MathML","output/SVG"],
          extensions: ["tex2jax.js","mml2jax.js","MathEvents.js"],
          TeX: {
            extensions: ["noErrors.js","noUndefined.js","autoload-all.js"]
          },
          MathMenu: {
            showRenderer: false
          },
          menuSettings: {
            zoom: "Click"
          },
          messageStyle: "none",
          SVG: {
            scale: 90,
            linebreaks: {
              automatic: true,
              width: "container",
            },
          },
        });

    {% else %}

        MathJax.Hub.Config({
            "HTML-CSS": {
                availableFonts: [], // force use of webFont
                webFont: "{% if page.mathjax-font %}{{ page.mathjax-font }}{% else %}{{ site.mathjax-font }}{% endif %}",
                scale: 90,
                styles: {
                    ".MathJax [style*=border-top-width]": {
                        "border-top-width": "0.5pt ! important"
                    }
                }
            }
        });

    {% endif %}

{% endif %}
