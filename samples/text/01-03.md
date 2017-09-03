---
title: "Quotes"
---

## Quotes

Everyone loves a good quotation. Good themes should support blockquotes, and might support pullquotes as a class of blockquote. Ideally, the source of a quotation should have a style, too.

### Blockquotes

Generally, blockquotes are set off from body text with line spaces above and below, and an indent left and right. What does this theme do with a blockquote? Thanks to [The Quote Garden](http://www.quotegarden.com/quotations.html) for these quotes about quotes.

> Next to the originator of a good sentence is the first quoter of it. Many will read the book before one thinks of quoting a passage. As soon as he has done this, that line will be quoted east and west.

That's from Ralph Waldo Emerson's "Quotation and Originality" in *Letters and Social Aims*. How about blockquotes with two or three paragraphs?

> While reading writers of great formulatory power — Henry James, Santayana, Proust — I find I can scarcely get through a page without having to stop to record some lapidary sentence. 
> 
> Reading Henry James, for example, I have muttered to myself, "C’mon, Henry, turn down the brilliance a notch, so I can get some reading done." I may be one of a very small number of people who have developed writer’s cramp while reading.

That's from Joseph Epstein's "Quotatious" in *A Line Out for a Walk*.

> Whatever is felicitously expressed risks being worse expressed: it is a wretched taste to be gratified with mediocrity when the excellent lies before us.
> 
> We quote, to save proving what has been demonstrated, referring to where the proofs may be found.
> 
> We quote, to screen ourselves from the odium of doubtful opinions, which the world would not willingly accept from ourselves; and we may quote from the curiosity which only a quotation itself can give, when in our own words it would be divested of that tint of ancient phrase, that detail of narrative, and that naïveté, which we have for ever lost, and which we like to recollect once had an existence.

That's from Isaac D’Israeli's 'Quotation' in *A Second Series of Curiosities of Literature, Volume&nbsp;I*.

How about two separate but consecutive blockquotes?

> I love quotations because it is a joy to find thoughts one might have, beautifully expressed with much authority by someone recognized wiser than oneself.

> The quoting of an aphorism, like the angry barking of a dog or the smell of overcooked broccoli, rarely indicates that something helpful is about to happen. 

Those are, respectively, Marlene Dietrich and Lemony Snicket (*The Vile Village*).

And just to be thorough, what about two separate, consecutive blockquotes each with more than one paragraph?

> My readers, who may at first be apt to consider Quotation as downright pedantry, will be surprised when I assure them, that next to the simple imitation of sounds and gestures, Quotation is the most natural and most frequent habitude of human nature.
> 
> For, Quotation must not be confined to passages adduced out of authors. He who cites the opinion, or remark, or saying of another, whether it has been written or spoken, is certainly one who quotes; and this we shall find to be universally practiced.

> What is all wisdom save a collection of platitudes? Take fifty of our current proverbial sayings—they are so trite, so threadbare, that we can hardly bring our lips to utter them. None the less they embody the concentrated experience of the race, and the man who orders his life according to their teaching cannot go far wrong.
> 
> How easy that seems! Has any one ever done so?
> 
> Never. Has any man ever attained to inner harmony by pondering the experience of others? Not since the world began! He must pass through the fire.

The first there is James Boswell in 'The Hypochondriack' (*The London Magazine: Or, Gentleman’s Monthly Intelligencer*, June 1779). The second, Norman Douglas in *South Wind* (1921).

### Pullquotes

Pull quotes are generally very short, punchy quotes from the surrounding text. They give readers a teasing hint at what's inside. There isn't an HTML element for pullquote, so we use a blockquote with a `pullquote` class.

> Short, punchy … a teasing hint at what's inside.
{:.pullquote}

Some publications use pullquotes as part of the flowing text, rather than phrases extracted from the body. That may or may not be a good idea.

### Quote sources

Sometimes the source of a quote is included with the quote, and needs to be styled specially. For that, we use a `source` class. That might be applied to an inline or a block element. Here as a paragraph class (block element):

> Collecting quotations is an insidious, even embarrassing habit, like ragpicking or hoarding rocks or trying on other people’s laundry. I got into it originally while trying to break an addiction to candy. I kicked candy and now seem to be stuck with quotations, which are attacking my brain instead of my teeth.

Robert Byrne, 'Sources, References, and Notes' in *The Other 637 Best Things Anybody Ever Said*, 1984
{:.source}

And here as an inline `<em>` element:

> The multiplicity of facts and writings is become so great that every thing must soon be reduced to extracts and dictionaries. *Voltaire*{:.source}

And after these two quotations, just to see how consecutive quotations with block-element sources behave:

> I enjoy collecting quotations. When I find a choice one I pounce on it like a lepidopterist. My day is made. When I lose one because I did not copy it out at once I feel bereft.

R.I. Fitzhenry, preface to The David & Charles Book of Quotations, September 1981
{:.source}

> Books are the beehives of thought; laconics, the honey taken from them.

James Ellis, quoted in Edge-Tools of Speech by Maturin M. Ballou, 1899
{:.source}
