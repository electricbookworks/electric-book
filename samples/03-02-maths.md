---
title: "Mathematics"
---

## Mathematics

Jekyll uses [MathJax](https://docs.mathjax.org/en/latest/), which the Electric Book workflow supports.

{% if site.mathjax-enabled == true %}

LaTeX-style maths via MathJax can be inline ($$E = mc^2$$) or displayed:

$$P_{t+1} - P_t=\frac{b+d}{s}(P_t-\overline{P})$$

The maths above and below is borrowed and adapted from [*The Economy*](https://www.core-econ.org/the-economy/book/text/leibniz-11-08-01.html) by CORE.

$$P_{t+2} - P_{t+1}=\frac{b+d}{s}(P_{t+1}-\overline{P})$$

It follows from $$P_{t} = \overset{\overline{}}{P} - \frac{s}{b + d}E_{t}$$ , $$E_{t} = P_{t + 1} - P_{t}$$ and the equation above that

$$
\begin{align}
\frac{P_{t+2} - P_{t+1}}{P_{t+1} - P_{t}} &= \\
\frac{P_{t+1}-\overline{P}}{ P_{t}-\overline{P}} &= R
\end{align}
$$

{% else %}

In this repo, MathJax is not enabled at the moment. Enable it in `_config.yml` to see a mathematics sample here.

{% endif %}
