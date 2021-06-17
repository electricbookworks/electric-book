---
title: Hyphenation
categories:
  - editing
order: 7
---

# Hyphenation

There are various techniques for managing hyphenation in PDF output.

You can change the basic hyphenation settings (variables) in your book's `print-pdf.scss` or `screen-pdf.scss` files. Our default stylesheets can ask Prince to hyphenate paragraphs and lists (`p, ul, ol, dl`), with a few exceptions (such as text on the title and contents pages). Prince includes a range of hyphenation dictionaries for major languages by default, which do a good job. However, you might need to add dictionaries or lists of specific words that Prince doesn't support.

You can find `.dic` files online for [various languages](https://www.ctan.org/tex-archive/language/hyph-utf8/tex/generic/hyph-utf8/patterns/txt) and specialities, or you can compile your own.

A `.dic` file is a plain-text file with one word or word-fragment on each line. Each one is called a pattern.

*	If the pattern starts with a `.`, it will apply to, or match, any word that starts with that pattern. E.g. `.foo` will match the words 'food' and 'foobar' but not 'fastfood'.
*	If the pattern ends with a `.`, it will apply to any word that ends with that pattern. E.g. `port.` will match 'port' and 'sport' but not 'portico'.
*	Thus, if the pattern starts *and* ends with a `.`, it will apply to only that pattern exactly. E.g. `.port.` will only ever match 'port'.

To show where a word or word-fragment can hyphenate, you add digits (1 to 9) to the pattern. The digits have special meanings:

*	Insert odd digits (1, 3, 5, 7, 9) where the word may hyphenate.
*	Insert even digits (2, 4, 6, 8) where the word should not hyphenate.
*	The higher the number, the more important the rule. That is, a `1` says 'hyphenate here if you must', but a `9` says 'this is the best place to hyphenate'. A 2 says 'don't hyphenate here if you can help it', but an `8` says 'Do not, not, not hyphenate here.'

For user discussion, see [the Prince forums here](https://www.princexml.com/forum/topic/542/prince-hyphenate-patterns-none-url-patterns-url): If you need to hack Prince's built-in hyphenation dictionaries more deeply, see [this forum post](https://www.princexml.com/forum/topic/1474/prince-and-hyphenation).

## Use a custom dictionary

To use a custom dictionary, save the dictionary file to your `styles` folder, and insert its filename in your book's `print-pdf.scss` and/or `screen-pdf.scss` files as the value of the `$hyphenation-dictionary` variable. For example:

``` scss
$hyphenation-dictionary: "hyphenation.dic";
```

In `hyphenation.dic`, you can add patterns as described above. If your `hyphenation.doc` starts with three-hyphen YAML frontmatter, Jekyll will process it, and you can use Liquid tags for extra power. For example, you can include other hyphenation pattern files saved alongside `hyphenation.dic`:

{% raw %}
``` md
---
# This YAML frontmatter makes Jekyll process this file.
# So you can use Liquid tags to include files such as
# other hyphenation dictionaries, e.g.
# `{% include_relative hyph-en-gb.pat %}`
# or to use hyphenation in certain cases, e.g. variants.
---

{% include_relative hyph-en-gb.pat %}
```
{% endraw %}

Or you can use custom hyphenation only in specific [variants](../setup/variants.html) of your book:

{% raw %}
``` md
{% if variant == "fantabulous" %}
.fan3tab5ulous.
{% endif %}
```
{% endraw %}

Also see the guidance on styles in [translations](../setup/translations.html).
