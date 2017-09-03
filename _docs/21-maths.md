---
title: Mathematics
---

# Mathematics

To enable LaTeX syntax for maths:

1. Set `mathjax-enabled: true` in `_config.yml`. It is off (`false`) by default to avoid loading unnecessary scripts in books without maths.
2. For PDF output, you must have [PhantomJS](http://phantomjs.org/) installed. (PhantomJS must render the maths before Prince can include it in PDF output.)

The LaTeX is turned into displayed maths by [MathJax](http://docs.mathjax.org/en/latest/index.html). Surround your LaTeX with `$$` … `$$` to have MathJax process it.

## MathJax in HTML blocks

Sometimes you have to use actual HTML code in your markdown, for instance when adding an HTML table to a figure include. In that case, surround LaTeX with `$$` … `$$` for displayed maths (centered, with blank space above and below), and `\(` … `\)` for inline maths.

## Avoid using LaTeX for content layout

LaTeX syntax can store two different kinds of info:

1. mathematics, delimited in our markdown with `$$`
2. content layout, which must not be used with MathJax.

MathJax can only display the mathematics, and does not understand content layout. (More detail [here](http://docs.mathjax.org/en/latest/tex.html).)
