---
title: Poetry
---

# Poetry
{:.no_toc}

* toc
{:toc}

## Basic poetry markdown

Encoding poetry can be tricky. Usually, poetry in HTML is structured by tagging each stanza as a paragraph, with line breaks after each line. You can do this by adding markdown line breaks (with double spaces or `\\` at the end of each line) and tagging the paragraph with `{:.verse}`. However, this structure meaks it impossible to have browsers, ereaders and PDF engines correctly indent runover lines (because there is no [`nth-line` selector](https://css-tricks.com/a-call-for-nth-everything/) in CSS, unless you resort to [a Javascript method](https://github.com/davatron5000/Lettering.js#letters-words-lines-and-more) that will bloat your code and won't run on many ereaders).

> Tech note: Some text and code editors (e.g. Atom) strip out spaces at the ends of lines automatically. So use `\\` for line breaks, not double-spaces.
{:.box}

We prefer another approach: the poem is an unordered list (`ul`) and each line (including each blank line between stanzas) is a list item (`li`). We just hide any list markers (bullets) with `list-style-type: none`. This way, we can control indents on runover lines. This is a non-semantic use of HTML, since a poem is technically not a list. But it's a healthy hack with universal browser and ereader support.

Our convention is to mark each line of a stanza with a hyphen `-`, and tag the list with `{:.verse}`:

~~~
-	I wandered lonely as a cloud
-	That floats on high o'er vales and hills,
-	When all at once I saw a crowd,
-	A host, of golden daffodils;
-	Beside the lake, beneath the trees,
-	Fluttering and dancing in the breeze.
{:.verse}
~~~

We can also indent individual lines, where the poet wanted indents, by tagging individual list items.

~~~
-	Alas for man! day after day may rise,
-	{:.indent-3}Night may shade his thankless head,
-	He sees no God in the bright, morning skies
-	{:.indent-3}He sings no praises from his guarded bed.
{:.verse}
~~~

The `2` in `{:.indent-2}` refers to the number of em spaces to indent by. Our CSS allows for indents from 1 (`{:.indent-1}`) to 30 (`{:.indent-30}`).

(Big gaps between words in a line must be created with `&emsp;` in the poem text.)

## Advanced poetry markdown

But wait, there's more! Best practice for poetry layout is that – in print – a poem should be centered on its longest line. That is *not* centering the lines of poetry, but placing the left-justified poem in the horizontal middle of the page. Put another way, the poem should be indented till its longest line is centered on the page.

To achieve this, put the entire poem, including its title, in a blockquote, by adding `> ` to the start of each line. Tag the whole blockquote as {:.verse}, too. Finally, decide how wide you want the poem to be in multiple of 10 per cent. That is, if you reckon this poem's longest line reaches across 90 per cent of the page, use `.width-90`.

~~~
> -	### To One Who Has Been Long in City Pent
> -	To one who has been long in city pent,
> -	{:.indent-2}'Tis very sweet to look into the fair
> -	{:.indent-2}And open face of heaven,—to breathe a prayer
> -	Full in the smile of the blue firmament.
> -	Who is more happy, when, with heart's content,
> -	{:.indent-2}Fatigued he sinks into some pleasant lair
> -	{:.indent-2}Of wavy grass, and reads a debonair
> -	And gentle tale of love and languishment?
> -    
> -	Returning home at evening, with an ear
> -	{:.indent-2}Catching the notes of Philomel,—an eye
> -	Watching the sailing cloudlet's bright career,
> -	{:.indent-2}He mourns that day so soon has glided by:
> -	E'en like the passage of an angel's tear
> -	{:.indent-2}That falls through the clear ether silently.
> {:.verse}
{:.verse .width-90}
~~~

In verse structured as a list like this, our CSS preserves white space. That is, if you type, say, three spaces you get three spaces. Normally, HTML collapses multiple spaces into one – which is great *except* when you want to deliberately use extra spaces, as some poets do. However, this doesn't work at the start of lines, where markdown strips leading spaces. There you must use HTML space entities (like `&emsp;`) or our indent tags explained above.

**However**, the `whitespace: pre-wrap` CSS we use for this is not currently supported on Kindle. If that's important, it's best to stick to using HTML space entities like `&emsp;`.
