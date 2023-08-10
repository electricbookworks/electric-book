---
title: "Figures"
---

## Figures

Also see the [docs on figures](https://electricbookworks.github.io/electric-book/docs/editing/figures.html).

Figures, as we refer to them, are images, or similar visual artifacts (including tables) accompanied by a caption.

To ensure EPUB2 compatibility (which requires valid XHTML 1.1), we don't use the HTML `<figure>` tag, but rather use either:

* for very simple figures, a paragraph with an `image-with-caption` class that starts with an inline image followed by text; or
* a div with a `figure` class containing both an image and its caption, created with our `figure` include.

{% include figure
   image="naples.svg"
   caption="A map of Naples"
   link="https://en.wikipedia.org/wiki/Naples"
   alt-text="A map showing the location of Naples."
   reference="Figure 1"
%}

Old versions of the Electric Book template used a `blockquote` instead of a `div` for the figure, since a blockquote can be created with markdown `>` syntax.

<!-- index:
Fradkin, Chris
-->

To show figures in context, here is an article from *The Comics Grid: Journal of comics scholarship* by Chris Fradkin. The abstract, if you're curious:

> This note explores the notion of comic superheroes as tools for the empowerment of children. The author details interventions in Rwanda and Brazil, and their different usages of superheroes. With a focus on the superhero’s pre-cloak stage—the stage prior to their employing superpowers—the author offers glimpses of current work in progress to help therapists empower orphaned children. While this area of research is at an early stage, its potential among health professionals is growing. Thus the comic superhero may be more than celluloid, as health professionals learn to use his superpowers.

### Pre-Cloak Comic Superheroes: Tools for the Empowerment of Children

Fradkin, C., (2016). [Pre-Cloak Comic Superheroes: Tools for the Empowerment of Children.](https://www.comicsgrid.com/articles/10.16995/cg.85/) The Comics Grid: Journal of Comics Scholarship. 6, p.13. DOI: https://doi.org/10.16995/cg.85. [Creative Commons Attribution](https://creativecommons.org/licenses/by/4.0)
{:.sidenote}

The idea of using pre-cloak comic superheroes as tools for the empowerment of children has drawn notice from a multitude of corners: e.g., documentary filmmakers, a journalist from Forbes, the Joseph Campbell Foundation (2016).[^1] It has predictably drawn interest from adoption networks and support groups, as well as agencies that deal with foster children. I say ‘predictably’ because these groups of at-risk children were the groups a recent study (Fradkin et al. 2016[^2]) aimed to serve. As the findings in the ‘pre-cloak’ study noted: of the top-20 comic superheroes, 86% were orphaned or abandoned, in addition to enduring other woes. My co-authors and I stressed that this shared history has potential for empowerment: When these children hear of hardships overcome by superheroes, that may strengthen their resolve to carry on.

[^1]: Joseph Campbell Foundation (2016).  Available at: [https://www.jcf.org](https://www.jcf.org) (Accessed 26 March 2016).
[^2]: Fradkin, C, Weschenfelder, G V and Yunes, M A M (2016). Shared adversities of children and comic superheroes as resources for promoting resilience: Comic superheroes are an untapped resource for empowering vulnerable children. Child abuse & neglect 51: 407–415, DOI: https://dx.doi.org/10.1016/j.chiabu.2015.10.010

A program that employs the pre-cloak stage of superheroes has been active in Rwanda for some time. At the Rwandan Orphans Project (a center that serves former street children) (2016[^3]), a life-skills group implemented by Lisa Meaney, MFT, has used superhero origin stories to inspire its orphaned boys ([Figure 1](#figure-1)). “For these boys,” Meaney writes (2016, pers comm., 3 May), “childhood trauma can be a catalyst for positive change … Just like it is for superheroes.” For two years Meaney has incorporated superhero origin stories into her group-work with Rwandan boys. On Meaney’s watch, superhero capes were made from old t-shirts, masks from cereal boxes. “Over and over again,” she says, “the boys have made statements such as, ‘If Batman can be an orphan and be a superhero then so can I’” (2016, pers comm., 22 April). When asked about the boys’ openness to the disproportionately large percentage of Caucasian superheroes (~90%), Meaney reassured me that for her boys, the notion of a superhero role model is stronger than the color lines of race.

[^3]: Rwandan Orphans Project (2016).  Available at: https://www.rwandanorphansproject.org/ (Accessed 14 May 2016).

{% include figure
    image="fradkin-1.jpg"
    image-height="15"
    reference="Figure 2"
    caption="The Rwandan Orphans Project (near Kigali, Rwanda) uses comic superheroes to empower orphaned children. Capes from old t-shirts, masks from cereal boxes. Published with permission from The Rwandan Orphans Project. Photo © Lisa Meaney, MFT, [Rwandan Orphans Project](https://www.rwandanorphansproject.org), 2016 (Accessed 14 May 2016)."
    alt-text="Children stand in a line wearing super-hero capes and masks made from cereal boxes, making bold super-hero poses."
    class="fixed"
%}

5,000 miles WSW of Rwanda is a program in São Paulo, Brazil. The ‘Superformula’ program at the A.C. Camargo Cancer Center (2016[^4]), attempts to raise the spirits of its pediatric patients using special comics, videos, and superhero plastic covers for IV bags ([Figure 2](#figure-2)). The children are encouraged to do battle with their cancer, as the comic superheroes battle evil. Their chemo drip is ‘Superformula.’ While this approach may first seem novel, over time it may wear thin, as many patients on the ward will lose their battle. The Superformula program instills hope upon the ward, through the premise of ‘invincibility suggestion.’

[^4]: A. C. Camargo Cancer Center (2016).  Available at: [https://www.accamargo.org.br](https://www.accamargo.org.br) (Accessed 14 May 2016).

{% include figure
    image="fradkin-2.jpg"
    image-height="15"
    reference="Figure 3"
    caption="On the pediatric ward of the A.C. Camargo Cancer Center, superhero IV covers transform children’s chemo drip into _Superformula_. Design & Branding © J. Walter Thompson, Brazil, 2016 (Accessed 15&nbsp;May 2016)."
    alt-text="A poster that describes _Superformula to fight cancer_ covers, which have superhero logos on the covers of chemo drips. There is a batman logo on the cover in the foreground. Photos and text explain how the cover is attached."
%}

So where to go? I pondered on the future of the project; an effort conceived in several stages. The Rwandans were standing in the background. Therapists were asking what to do…. The cart was put in motion; it was rolling down the hill; but still, the next step was elusive. Then, bang! the answer hit me: A compilation! A directory for the therapists; in particular, those who work with high-risk children. I envisioned a sleek database; a gold-foil embossed book. I celebrated, having settled on direction. My compass was following the course.

But in the morning, I felt weary after tallying the workload: a directory of comic superheroes’ pre-empowered woes. Rebuking my resistance, I began. I sent word out to my students: from the past, the present, future: Would you like to gain some credit for your CV? When I mentioned comic superheroes, their eyes lit up like candles; one offered to enroll his aging mother. So, the routine was established: they would toil through DVDs, noting hardships and abuses that the superheroes suffered, in the pre-cloak stage, before empowerment. One student went to _Batman_ (1989[^5]); another to the _Hulk_ (2003[^6]); a third said he would work with _Spider-Man_ (2002[^7]).

[^5]: Batman (1989). Burton, Tim  USA: Warner Bros. [film].
[^6]: Hulk (2003). Lee, Ang  USA: Universal Pictures. [film].
[^7]: Spider-Man (2002). Raimi, Sam  USA: Columbia Pictures. [film].

The gears were grinding slowly. The students, as research assistants, buckled down. A directory was slowly in the works. At this stage we built the format in an Excel spreadsheet, time-coded from main title to the end. The time-code ran from top to bottom on the left-hand column, with adversities and comments to the right. Every hardship from each film was logged: pre-cloak and post. They were coded for the different categories: loss of parents, bullying, poverty, abuse; romance problems, hardships while at school. In the end, we finalized two separate versions for each film: the first in chronological from downbeat to the end; the second chronological by hardship (e.g., bullying: from main title through the scroll; then hardships while at school in the same format). We opted for this doubling to allow the therapist quick access to focus on one specific hardship. The students worked in shifts, scene-to-scene they chugged along. Assistant Chua logged bullying (00:03:55–00:04:26), in _Spider-Man 3_ (2007[^8]): ‘During lecture, Parker’s classmates are shooting spitballs at him … [then they’re] shining light into his eyes.’ Assistant Sullivan logged loss of parents (01:30:15–01:32:10), in a flashback from _Batman_ (1989[^9]): He notes Bruce Wayne and his parents walking from a movie theatre … He then describes the details of their murder.

[^8]: Spider-Man 3 (2007). Raimi, Sam  USA: Columbia Pictures. [film].
[^9]: Batman (1989). Burton, Tim  USA: Warner Bros. [film].

As progress inches forward, challenges arise. In terms of presentation … Should the pre-cloak stage be separate from the post-? Should categories meld into each other? Should the series of the films (e.g., _Spider-Man_ [2002[^10]], _Spider-Man 2_ [2004[^11]], _Spider-Man 3_ [2007[^12]]) be listed one-after-the-other, or stand-alone—independently? Decisions will be made; options will be weighed. And opinions gathered from disparate sources. The directory, when whole, will be reviewed by focus groups: by critics, colleagues, friends and foes alike.

[^10]: Spider-Man (2002). Raimi, Sam  USA: Columbia Pictures. [film].
[^11]: Spider-Man 2 (2004). Raimi, Sam  USA: Columbia Pictures. [film].
[^12]: Spider-Man 3 (2007). Raimi, Sam  USA: Columbia Pictures. [film].

So here I sit. Contemplating the potential of pre-cloak comic superheroes. While _Deadpool_ (2016[^13]) slaughters the box office; the _Force Awakens_ (2015[^14]) breaks the roof; _X-Men: Apocalypse_ (2016[^15]) has come and gone; likewise _Independence Day: Resurgence_ (2016[^16]). _Doctor Strange_ (2016[^17]) is coming soon; while next year: _Wonder Woman_ (2017[^18]); _Spider-Man_ (_Spider-Man: Homecoming_ 2017[^19]). On this planet of consumers, we can never get our fill: our addiction is to heroes on the screen. Make them larger than we are; give me guidance like a star; and in the process show the path my feet should go.

[^13]: Deadpool (2016). Miller, Tim  USA: 20th Century Fox. [film].
[^14]: Star Wars: The Force Awakens (2015). Abrams, J. J.  USA: Walt Disney Studios Motion Pictures. [film].
[^15]: X-Men: Apocalypse (2016). Singer, Bryan  USA: 20th Century Fox. [film].
[^16]: Independence Day: Resurgence (2016). Emmerich, Roland  USA: 20th Century Fox. [film].
[^17]: Doctor Strange (2016). Derrickson, Scott  USA: Walt Disney Studios Motion Pictures. [film].
[^18]: Wonder Woman (2017). Jenkins, Patty  USA: Warner Bros. Pictures. [film].
[^19]: Spider-Man: Homecoming (2017). Watts, Jon  USA: Columbia Pictures. [film].

### Endnotes
