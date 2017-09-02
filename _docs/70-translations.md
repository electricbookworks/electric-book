---
title: Translations
---

# Translations

The Electric Book workflow allows for two different approaches to managing translations. A translation can be either

1. a subfolder of the main project's `text` folder, named for the language code, or 
2. a completely separate repository, which starts out as copy of the parent book (or series, for multi-work repos), but from that point on is treated as a new book, overwriting the original files in the repository with the new language. This is technically the same as an adaptation of the book (e.g. a separate edition of a textbook where content is changed for local needs).

Option 1 is best if the translation is managed by the central team that also manages the parent edition. It assumes that the translation and its parent will be kept in sync for the most part, the translation always being a faithful reproduction of the parent. 

Option 2 is best for when the translating team works independently, and especially if they want to make content changes that diverge from the parent. For instance, adding a new image or page-design feature, or changing design elements like fonts and colours.

## Option 1

To make a translation using Option 1, you need to

- Add the files in a new folder (usually inside `book/text`).
- Add a `translations` node to the `meta.yml` with `directory` and `language`. They can optionally include their own work-level metadata such as title.

### The files

All translations live inside the `book` folder (remember sometimes `book` is renamed for each book in a series).

The text files of each translation are saved in a subdirectory of `text` named for the language code. So all text files of a French translation live in `book/text/fr`, and all text files of a Xhosa translation in `book/text/xh`.

All translations share the `fonts`, `images` and `styles` folders. So all images from all translations live in `book/images` – images that are themselves translated (e.g. text in the image has been translated) are given different file names to be used in image references in the translated text files. For instance, `figure-1-2.jpg` when translated might be `figure-1-2-fr.jpg` for a French translation.

### Metadata

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
