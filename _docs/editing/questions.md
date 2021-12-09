---
title: "Questions and quizzes"
categories: editing
order: 12
---

# Questions and quizzes
{:.no_toc}

* Page contents
{:toc}

## Basic usage

If you want to manage your questions independently of the main book text, and make your multiple-choice questions interactive and self-marking, then each question should be its own file. Questions should be separate files in the book's folder.

Include a question in your book file with the `include question` tag:

{% raw %}
```
{% include question file="question-01" %}
```
{% endraw %}

## Multiple-choice questions

If your question file includes a `correct` value in its YAML frontmatter, it will be rendered as an interactive multiple-choice question.

MCQ files must include the correct answer option(s) in their YAML frontmatter to be rendered as interactive MCQs in web and app output. They should include feedback for each answer option. Here is an example of an MCQ markdown file:

``` md
---
correct: 1, 4
---

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

Your question can have more than one correct answer.

Note:

* The list of answer options has the class `.mcq-options`.
* The list of feedback, in order to relate the the answer options, has the class `.mcq-feedback`.
* If you have a regular list, too, immediately before one of these lists, separate it with a `^`, which is a [kramdown end-of-block marker](https://kramdown.gettalong.org/syntax.html#eob-marker). It tells kramdown the two lists above and below it are not one list.

## Quizzes

You can gather several questions into a quiz using the `include quiz` tag:

{% raw %}
```
{% include quiz questions="question-01, question-02, question-03" %}
```
{% endraw %}

If each question file has a `marks` value in its YAML frontmatter, a quiz will add up those marks and show the total.

### Applying classes to quizzes

You can apply a class to a quiz in the `include quiz` tag. For example, to make a quiz your 'featured quiz', you might use a `featured-quiz` class:

{% raw %}
``` liquid
{% include quiz questions="question-01, question-02, question-03" class="featured-quiz" %}
```
{% endraw %}

Also, if you want all the *questions* inside a quiz to have a particular class, you can set that, too, like this:

{% raw %}
``` liquid
{% include quiz questions="question-01, question-02, question-03" question-class="my-featured-questions" %}
```
{% endraw %}

## Quiz groups

You can collect quizzes into quiz-groups, for instance to create exam papers. To create a quiz-group, wrap quizzes in a `<div class="quiz-group"></div>`. A quiz group treats each quiz as a section, and numbers their questions consecutively across all quizzes in the quiz-group. This is useful for creating exam papers, where questions must numbered consecutively across sections (which are quiz-groups).

You can create a quiz group in one of two ways:

1. If an entire markdown file represents a quiz group (e.g. it's a single exam paper), add `quiz-group` to the `style: ` values in the file's YAML frontmatter. For instance:

   ``` md
   ---
   style: quiz-group
   ---
   ```

   (Technically, the values in `style` become classes of your output HTML's `body` element.)

2. If only a part of a markdown file represents a quiz-group, wrap the quizzes in a `div` element with a `quiz-group` class. Also add a `markdown="1"` attribute so that markdown in the `div` is processed into HTML as usual:

   {% raw %}
   ``` html
   <div class="quiz-group" markdown="1">

   ## Section 1

   {% include quiz questions="question-01, question-02, question-03" %}

   ## Section 2

   {% include quiz questions="question-04, question-05, question-06" %}
   
   </div>
    ```
    {% endraw %}

## Fill-in-the-blanks

A simple kind of question is a fill-in-the-blank or gap-fill, where users can select an answer from options in a dropdown list. You can add one anywhere with the `include select` tag, like this:

{% raw %}
``` liquid
{% include select options="apples | pears | oranges" correct="apples" %}
```
{% endraw %}

By default, in web and app outputs, users will get feedback on whether their selections are correct or not. In PDF, you will see an underlined space to represent the blank. In epub, the options should be visible (depending on the ereader) but will not get feedback unless you add the `select-list.js` script to your [epub scripts](../advanced/javascript.html#adding-scripts-to-epubs).
