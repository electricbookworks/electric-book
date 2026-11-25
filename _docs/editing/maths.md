---
title: Mathematics
categories: editing
order: 11
---

# Mathematics
{:.no_toc}

* Page contents
{:toc}

To enable LaTeX syntax for maths:

1. Make sure `mathjax-enabled: true` is set in `_config.yml`. It may be off (`false`) to avoid loading unnecessary scripts in books without maths.
2. For PDF output, you must have installed [Node](https://nodejs.org/), and have run the 'Install and update dependencies' option in the output script. (This is because the maths must be rendered before Prince can include it in PDF output.)

The LaTeX is turned into displayed maths by [MathJax](https://docs.mathjax.org/en/latest/index.html). Surround your LaTeX with `$$` … `$$` to have MathJax process it.

## MathJax in HTML blocks

Sometimes you have to use actual HTML code in your markdown, for instance when adding an HTML table to a figure include. In that case, surround LaTeX with `$$` … `$$` for displayed maths (centered, with blank space above and below), and `\(` … `\)` for inline maths.

## Preventing line breaks in maths

MathJax can break a line at some operators, such as `\times`, even if there is a non-breaking space before the operator. To keep an operator on the same line as the content before it, put `\nobreak` immediately before the operator:

```latex
$$\varepsilon=-\frac{P}{Q}\nobreak\times \text{slope}$$
```

Do not use `&nbsp;` inside `$$` … `$$` for this. It does not prevent the break, and it can stop the maths from rendering correctly.

## Avoid using LaTeX for content layout

LaTeX syntax can store two different kinds of info:

1. mathematics, delimited in our markdown with `$$`
2. content layout, which must not be used with MathJax.

MathJax can only display the mathematics, and does not understand content layout. (More detail [here](https://docs.mathjax.org/en/latest/tex.html).)
