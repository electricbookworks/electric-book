---
title: Translations
categories: editing
---

# Translations

In the Electric Book workflow, a translation is a subfolder of the original book. Text files go into a subfolder of `/text`, e.g. `/text/fr`. The translation folder's name must be the language code.

This structure assumes that the translation and its parent will be kept in sync for the most part, the translation always being a faithful reproduction of the parent. 

## Translations vs adaptations

If the translating team works independently, and especially if they want to make content changes that diverge from the parent, their translation is actually an adaptation. For instance, adding a new image or page-design feature, or changing design elements like fonts and colours.

An adaptation should be a completely separate repository, which starts out as copy of the parent book (or series, for multi-work repos), but from that point on is treated as a new book, overwriting the original files in the repository with the new language.

## Setting up a translation

To make a translation:

- Add a `translations` node to the `meta.yml` with `directory` and `language`. They can optionally include their own work-level metadata such as `title`. Any metadata not added to a translation will be inherited from the original language. See [Metadata](#metadata) below.
- Add the files in a new folder inside `book/text`, named for the translation language code. (Remember sometimes `book` has been renamed for each book in a series).

## Text

The text files of each translation are saved in a subdirectory of `text` named for the language code. So all text files of a French translation live in `book/text/fr`, and all text files of a Xhosa translation in `book/text/xh`.

All translations share `fonts` and `styles`.

## Images

By default, translations share the same `images` folders as the original language. This works only if your images contain no text, and all the images are the same in both languages.

If any images are different, then the translated images should also be in a sub-folder of each image set, e.g. `/images/epub/fr`. This is most often the case, because cover images almost always need to be translated, and are therefore different.

When linking to images, remember to always use the `{{ images }}` tag in the path, e.g.:

```
![Dog chases bus]({{ images }}/dogbus.jpg)
```

The `{{ images }}` tag is smart enough to know the path to your images, whether you're in a translation or an original language, and whether your images are the same as the original language or in a translated images subfolder.

This means that you can keep the same image filenames for translations, as long as they are in a translation subfolder.

You must also include the `{% include metadata %}` tag once earlier in each markdown file to load the `{{ images }}` tag, along with a range of other useful tags.

## Metadata

Each translation must be added to the `meta.yml` file. All `translations` are a subset of `works`, alongside work-level metadata like `title`. Within `translations`, you list each language. Each language inherits the parent language's metadata unless overridden with its own metadata.

The `translations` node is equivalent to `works`, but for translations. The key feature that tells the system that it is a translation is that the `directory` and `language` fields are identical. For instance, for a French translation we would say:

```
  translations
    -
      directory: fr
      language: fr
```

Here is an example of the translation section of the `meta.yml` file that includes translations into Xhosa and French. Note how the translations can, but don't have to, include their own work-level metadata. Where it is included, it overrides the parent language's metadata. This means each translation can even have its own `files` list.

```
    translations:
      -
        directory: xh
        language: xh
        title: Title in Xhosa
        products:
          epub:
            date: "2016-05-07"
            format: "Digital download"
            identifier: "" # e.g. ISBN or UUID
            image: "cover.jpg"
            files:
              - "0-0-cover"
              - "0-1-titlepage"
              - "0-2-copyright"
              - "0-3-contents"
              - "01"
              - "02"
              - "03"
      -
        directory: fr
        language: fr
        title: Title in French
```
