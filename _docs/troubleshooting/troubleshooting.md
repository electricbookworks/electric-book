---
title: Troubleshooting and tips
categories: troubleshooting
---

# Troubleshooting and tips
{:.no_toc}

* Page contents
{:toc}

Here are some common issues we've encountered, especially when we're new to the Electric Book workflow.

## Checking markdown syntax

Use a good text editor that colour-codes markdown as you work. We like [Sublime Text](https://www.sublimetext.com/) (with [MarkdownEditing](https://github.com/SublimeText-Markdown/MarkdownEditing) installed and set to MultiMarkdown) or [Notepad++](https://notepad-plus-plus.org/) (with [this markdown highlighter](https://github.com/Edditoria/markdown_npp_zenburn)).

*   If you're working on Windows, set your default character encoding for your documents to 'UTF-8 without BOM', aka UTF-8, and *not* a 'UTF-with-BOM' option. (Jekyll will break if you don't.)
*   To check how your markdown converts to HTML while you work, you can use [this Online Kramdown Editor](https://kramdown.herokuapp.com/) by [Daniel Perez Alvarez](https://github.com/unindented/online-kramdown-sinatra).
*   Keep the [kramdown quick reference](https://kramdown.gettalong.org/quickref.html) handy.
*   In lists, kramdown lets you use a space *or* a tab between the list marker (e.g. `*` or `1.` etc.) and the list text. If only to solve an issue with nesting blockquotes in lists, *use a tab* between the list marker and the start of the list text, and the same tab at the start of the blockquote line. That is, the indentation (the tab) must be exactly the same for the blockquote to nest correctly in the list. (A local Jekyll instance may correctly parse nested lists even with a space after the list marker and a tab before the blockquote `>`. But GitHub Pages is much stricter and requires exactly the same indentation.)
*   Keep spans within block elements. For instance, if you have two paragraphs in italic, don't start the italics with `*` in the first paragraph and end the span with a second `*` in the next paragraph. The HTML needs one span (e.g. `<em>` span) in the first para, and another in the second para. The converter isn't smart enough to split your intended italics into two spans. Rather end the first span in the first para, and start another one in the second.

## Jekyll and GitHub

*	When running Jekyll locally, and *if* your repo is a project using GitHub Pages (not an organisation or user site), you'll need to add `--baseurl ''` when running Jekyll at the command line. [Here's how and why](https://jekyllrb.com/docs/github-pages/#project-page-url-structure).
*	You may get different results between a local Jekyll install and GitHub Pages, even if both are using kramdown. Always check (at least spot check) both places.
*	Jekyll may break if you use a colon (`:`) in YAML frontmatter like a title. For instance, `title: Beans: The musical fruit`. While you can either use another character (e.g. `title: Beans—The musical fruit` or the HTML `&#58;` for the colon, `title: Beans&#58; The musical fruit`), it's easier to just wrap your title in double quotes: `title: "Beans: The musical fruit"`.
*	We recommend setting `.gitignore` to ignore the `_site` folder, where Jekyll will store HTML output locally. If you choose *not* to `.gitignore` your `_site` folder, it'll contain (and sync to GitHub) your local machine's most recent Jekyll HTML output. (The `_site` folder has nothing to do with what GitHub Pages publishes.) In theory, committing the `_site` folder makes it easy for collaborators without Jekyll to grab a book's output HTML from the repo. But it comes with problems: committers have a responsibility to make sure their Jekyll instance does a good job, and that their `_site` output is up-to-date with the latest changes to the underlying markdown. Importantly, if you have more than one committer on a book, you'll get lots of merge conflicts in the `_site` folder, and this will make your head hurt.

## Using includes inside blockquotes

{% raw %}

If you use `{% include figure %}` inside a markdown blockquote, for instance if you're creating a box, the figure breaks the box. This is because the Liquid tag itself, when processed, adds a blank line in the markdown. To kramdown, it looks like your `>` blockquote is finished. And at the next `>` after the include, a new blockquote starts – where you wanted one continuous blockquote.

Issues with newlines at Liquid tags is a [widespread PITA](https://github.com/Shopify/liquid/issues/216). It's possible that this will be simpler to solve when Jekyll uses Liquid 4, which seems to provide [special syntax for removing whitespace](https://help.shopify.com/themes/liquid/basics/whitespace). Till then, this workaround works well: `capture` the `include` and output the captured result with the `strip_newlines` filter. Here is an example.

This will *not* work:

``` md
> This figure shows the different paths taken by these economies. 
> 
> {% include figure image="fig.jpg" %}
> 
> Notice that West Germany started from a more favourable position in 1950 than East Germany. Yet in 1936, before the war began, the two parts of Germany had virtually identical living standards. 
{:.box}
```

And this does work:

``` md
> This figure shows the different paths taken by these economies. 
> 
> {% capture myfigure %}
{% include figure image="fig.jpg" %}
{% endcapture %}{{ myfigure | strip_newlines }}
> 
> Notice that West Germany started from a more favourable position in 1950 than East Germany. Yet in 1936, before the war began, the two parts of Germany had virtually identical living standards. 
{:.box}
```

Thanks to [Clemens Tolboom and Nathan Arthur](https://stackoverflow.com/a/25803493/1781075) for the tip.

Another approach – which is actually easier if you know a little HTML – is to use an HTML blockquote rather than a markdown one. In that case, you'd do this:

``` md
<blockquote class="box" markdown=1">

This figure shows the different paths taken by these economies. 

{% include figure image="fig.jpg" %}

Notice that West Germany started from a more favourable position in 1950 than East Germany. Yet in 1936, before the war began, the two parts of Germany had virtually identical living standards. 

</blockquote>
```

Note that you need `markdown="1"` to tell kramdown to process the content of your HTML `blockquote` as markdown.

{% endraw %}
