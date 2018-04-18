---
title: "Multiple-choice questions"
categories: editing
order: 12
---

# Multiple-choice questions

Each questions is stored in its own file (alongside the book's other content files), and added to the body text with an `include` tag:

{% raw %}
`{% include question file="question-03-04" %}`
{% endraw %}

The question file should have this layout:

```
---
correct: 1, 4
---

### A question title

Which of the following is true?

- You should not pick a fight with a Wookiee.
- Picking fights with Wookiees is safe.
- Wookiees love being laughed at.
- Wookiees make loyal companions.
{:.mcq-options}

* Wookiees can tear your arm off.
* Wookiees don't shy away from a fight.
* Wookiees are proud and sensitive.
* Wookiees have been known to stick by their friends even in the worst circumstances.
{:.mcq-feedback}
```

You can have more than one correct answer.

Note:

* The list of answer options has the class `.mcq-options`.
* The list of feedback, in order to relate the the answer options, has the class `.mcq-feedback`.
* If you have a regular list, too, immediately before one of these lists, separate it with a `^`, which is a [kramdown end-of-block marker](https://kramdown.gettalong.org/syntax.html#eob-marker). It tells kramdown the two lists above and below it are not one list.
