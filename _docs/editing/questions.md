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

If you want to manage your questions independently of the main book text, and make your multiple-choice questions interactive and self-marking, then each question should be its own file. Questions should be separate files in either the book's `text` folder [or in `_items`](../setup/repeatable-items.html).

Include a question in your book file with the `include question` tag:

{% raw %}
```
{% include question file="question-01" %}
```
{% endraw %}

## Multiple-choice questions

You can add MCQs to your book like this:

{% raw %}
```
{% include mcq file="question-01" %}
```
{% endraw %}

You can also just use the usual `question` include like this:

{% raw %}
```
{% include question file="question-01" %}
```
{% endraw %}

and if the question file includes a `correct` value its its YAML frontmatter, it will be rendered as an interactive multiple-choice question.

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

You can have more than one correct answer.

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

If each question file has a `marks` value its its YAML frontmatter, a quiz will add up those marks and show the total.

## Exam papers

You can create exam papers by collecting quizzes in an exam `div`. An exam treats each quiz as a section of the exam, and numbers questions consecutively across quizzes (aka exam sections, in this situation).

You can collect quizzes in an exam `div` in one of two ways:

1. If an entire markdown file represents an exam, add `exam` to the `style: ` values in the file's YAML frontmatter. For instance:

   ``` md
   ---
   style: exam
   ---
   ```

2. If only a part of a markdown file represents an exam, wrap the quizzes in a `div` element with an `exam` class. Also add a `markdown="1"` attribute so that markdown in the `div` is processed into HTML as usual:

   {% raw %}
   ``` html
   <div class="exam" markdown="1">

   ## Section 1

   {% include quiz questions="question-01, question-02, question-03" %}

   ## Section 2

   {% include quiz questions="question-04, question-05, question-06" %}
   
   </div>
    ```
    {% endraw %}
