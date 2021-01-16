---
title: Repeatable items
categories: setup
order: 35
---

# Repeatable items
{:.no_toc}

* Page contents
{:toc}

## Usage

Sometimes across a book or a collection of books, you want to repeat snippets of content. For instance, you may have a standard introduction to all your books, or 'About the author' text that you want to add to the ends of certain chapters. Or you might want several books to [draw questions or create quizzes](../editing/questions.html) from the same set of possible questions.

You can create repeatable items like this by saving them as standalone files in the `_items` folder. The contents of the `_items` folder should be structured in the same way as a book folder. That is, markdown files should be in `_items/text`, and markdown files for a French translation would be in `_items/fr/text`.

To include an item in your book, use the `include item` tag, and specify in the tag which file you want to include. For example:

{% raw %}
```
{% include item file="about-charles-dickens.md" %}
```
{% endraw %}

In your output, the content in `_items/text/about-charles-dickens.md` will appear where you placed that tag.

Note that the file extension is optional. So you can also use:

{% raw %}
```
{% include item file="about-charles-dickens" %}
```
{% endraw %}

This is convenient, but also means that you shouldn't use the same file name for different files with different extensions. If you had both `about-charles-dickens.md` and `about-charles-dickens.html` in `_items/text`, your output will include the second one alphabetically: `about-charles-dickens.md`.

> Note that `include` tags (or other Liquid tags) *inside* items may not regnerate when you're running an incremental build with Jekyll, because of the sequence in which Jekyll processes Liquid tags and content.
{:.box}

## YAML frontmatter in items

An item must start with YAML frontmatter, just like your book's text files, even if it's blank. At a minimum, blank YAML frontmatter is two lines of three hyphens at the top of the document:

```
---
---
```

This tells Jekyll to process the file, which ensures that Jekyll knows about it when you include it somewhere.

You can also add YAML frontmatter data to each item. This is important for multiple-choice questions, for example, which must include the correct answer options in their frontmatter:

```
---
correct: 1, 4
---
```

## Overriding items per book

Items in a book's text folder will override the ones in the main `_items` folder, if they have the same file name.

Let's say you have five books in your project that use the 'About Charles Dickens' item; but, in one of your books, you want that item to say something different. Just copy the item to that book's `/text` folder, and edit it there.

When you use {% raw %}`{% include item file="about-charles-dickens" %}`{% endraw %} in that book, you'll get the version in the book's `/text` folder, and not the one from `_items`.

## Translated items

When you need to create translations of items in the `_items` folder, save those in a subfolder of `_items` that has the same name as the book's translation folder. 

For instance, if your book's French translation is in `book/fr`, save your French items to `_items/fr`, in relevant `text` or `images` subfolders.

Then in the French book text, use the `include item` tag as usual:

{% raw %}
```
{% include item file="about-charles-dickens.md" %}
```
{% endraw %}

This way, you can use exactly the same tags across translations, and your output will include the relevant item from the relevant translation folder automatically. No need to rename files.

## Images

Images stored in `_items/images` follow the same conventions as in books. That is, place master images in `_items/images/_source` and process them using the output script (or `gulp --book _items`).

Translated images should go into language subfolders of `_items`, such as `_items/fr/images/_source` for French images.

> ### Notes
> 
> Unlike book directories, items may not inherit their parent-language's images. This ability is still in development. All images in the `_items` parent folder may need to be copied to (or translated in) each translation's images folder in `_items`, such as `_items/fr/images`.
> 
> Using `include figure` with images in items is also a feature in development.
{:.box}

## Creating new item-based includes (advanced)

The YAML metadata in an item can be very useful, especially if you want to create your own include tags that use items.

The `mcq` include is an example: it uses the `item` include to get the item as a programming object, and then outputs the parts of that object that it needs. Each of the item's YAML-frontmatter fields is accessible in the item object.

To get an item as an object, rather than as generated output, add `return="object"` when you `include item` in your new include. For example:

{% raw %}
```
{% include item file=include.file return="object" %}
```
{% endraw %}

For instance, let's say you're creating an include that outputs the title and reading-grade of a poem stored in `_items`. You might create an include called `poem-grade`, which uses the `item` include to fetch an item object. 

This YAML in the item

```
---
title: "The Tiger"
grades: 10, 11, 12
---
```

would be accessible in your `poem` include as {% raw %}`{{ item-file-object.grades }}`{% endraw %} and {% raw %}`{{ item-file-object.title }}`{% endraw %}.

Your `poem-grade` include might look like this:

{% raw %}
```
{% include item file=include.file return="object" %}
'{{ item-file-object.title }}': grades {{ item-file-object.grades }}
```
{% endraw %}

And when you use that include in your book's text, you'd use:

{% raw %}
```
{% include poem-grade file="the-tiger" %}
```
{% endraw %}

assuming that you'd saved the poem in `_items/text` as `the-tiger.md`.
