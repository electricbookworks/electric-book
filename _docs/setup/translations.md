---
title: Translations
categories: setup
order: 40
---

# Translations
{:.no_toc}

* Page contents
{:toc}

In the Electric Book workflow, a translation is a subfolder of the original book. Text files go into a subfolder of the book, e.g. `/book/fr`. We recommend naming the translation folder with the language code.

This structure assumes that the translation and its parent will be kept in sync for the most part, the translation always being a faithful reproduction of the parent; but this isn't required. A translation can be quite different to its parent.

## Translations vs adaptations

If the translating team works independently, and especially if they want to make content changes that diverge from the parent, their translation is actually an adaptation. For instance, adding a new image or page-design feature, or changing design elements like fonts and colours.

An adaptation could be a completely separate repository, which starts out as copy of the parent project, but from that point on is treated as a new project, overwriting the original files in the repository with the new language.

## Setting up a translation

To make a translation:

- Add a folder to the book's folder in `_data/works` with the same same as the language code. E.g. `_data/works/samples/fr`. In that folder, create a `default.yml` file. In that file, follow the same structure as the parent-language's `default.yml` file, but add only the values that overwrite the parent-language edition. Any metadata not added to a translation's YAML file will be inherited from the parent language. See [Metadata](#metadata) below.
- Add the files in a new folder inside `book` (or your renamed book folder), usually named after the translation language code. (Remember sometimes `book` has been renamed for each book in a project).

## Text

The markdown files of each translation are saved in its folder. So all markdown files for a French translation of `book` live in `book/fr`, and all markdown files for a Xhosa translation in `book/xh`.

## Styles, fonts and images

Translations inherit `styles` and `images` from the parent language, unless files in those folders exist in the translation directory.

### Styles

If you add a stylesheet to a translation's `styles` directory (e.g. `book/fr/styles/print-pdf.scss`), those styles are *added to* the parent CSS. Your pages will load the parent CSS, followed by your translation CSS.

This way, you only need to add to your translation CSS those rules that override parent styles.

You need to create a translation stylesheet for each format that you want to augment, and it must have the same name as its parent: `app.scss`, `epub.scss`, `print-pdf.scss`, `screen-pdf.scss`, and `web.scss`.

For instance, say you've used a large quote mark before all blockquotes in English. In French, you may want to use a guillemet. Your French stylesheets might only contain this:

``` scss
---
---

blockquote:before {
  content: "«";
}

```

Note the three-hyphen YAML frontmatter, which tells Jekyll to process the file.

An important, advanced example is custom [hyphenation](../editing/hyphenation.html). If your book's parent language is English, and you've used auto hyphenation with a custom hyphenation dictionary, you do not want your French translation to use your English hyphenation patterns. You want different custom hyphenation patterns for French. So in `book/fr/styles` you'll add a stylesheet for each output format, and a new custom hyphenation dictionary.

Your new translation stylesheet might have this content:

``` scss
---
# French translation styles
# These override the parent language
---

$hyphenation: auto;
$hyphenation-dictionary: "hyphenation.dic";
@import 'partials/pdf-hyphenation'
```

This snippet:

1. Uses three-hyphen YAML frontmatter so that Jekyll processes the Sass file.
2. Sets new values for Sass variables `$hyphenation` and `$hyphenation-dictionary` that may be different from your parent-language styles. The `$hyphenation-dictionary` value points to a `hyphenation.dic` file saved alongside the translation stylesheet.
3. Imports the relevant Sass partial `_pdf-hyphenation.scss` to override the parent-language version of the same partial.

### Images

This works well if your images contain no text, and all the images are the same in both the parent and translation languages.

If any images are different, then the translated images should also be saved in the translation `images` folder, e.g. `book/fr/images/_source`. This is most often the case, because cover images almost always need to be translated, and are therefore different.

This means that you can keep the same image filenames for translations, as long as they are in a translation subfolder.

## Metadata

Each translation must be added to the book's folder in `_data/works`, e.g. `_data/works/samples/fr/default.yml` defines any metadata for the French edition of the `samples` book that differs from its parent-language edition. E.g.:

```yaml
language: "fr"
title: "Échantillons"
```

Each language inherits the parent language's metadata unless overridden with its own metadata.

### The language selector

When a translation includes the same file names as the parent language, translated web and app pages will include a language-selector icon, to allow users to switch between languages. For this to work:

- The parent-language and translated files must have the same filenames.
- The files must be listed in the parent and translation `files` lists in their `_data/works` YAML files.

### Epub-specific languages

In some situations, you might want the language set in your epub's Dublin Core OPF metadata (`dc:language`) to be different to the language of the translation. For instance, Kindlegen will not convert epubs in languages it does not recognise. In this situation, you might need to set the epub's Dublin Core language tag to, say, English, even though your epub's content files are still in, say, Asanti Twi.

To set this, add a `language` to the `epub` section of your translation's YAML file:

``` yaml
language: "twi"
products:
  epub:
    language: "en"
```

## Localisation

To translate things like the navigation button and bookmarks dialog, edit `_data/locales.yml`.

## Translating the landing page

If your project is translated, it is best to create a landing page for each language. Create a folder in the root directory named after the relevant language code, e.g. `fr`. In that folder, create an `index.md` file. This is the landing page for that language. It's best to copy and then translate the existing `index.md` file in the root directory.

Translated landing pages need their own translated image for open-graph metadata (i.e. social-media cards). The filename of this image is defined globally for all languages in `_data/meta.yml` as the `project` `image`. A file with that name must then be available for each language that has its own translated landing page.

The parent language will use the project image in `assets/images/web`. A French landing page, for instance, will take its project image from `assets/fr/images/web`.

So, for each translation, you need to create a folder in `assets` named for the language code, e.g. `fr`. In there, create an `images` folder, and in there a `web` folder. If you are using the output script (or `gulp`) to process images from `_source` folders into `web` and other image formats, then rather create a `_source` folder in `images`. The automated image-processing script will create the `web` folder and copy your image there from, say, `assets/fr/images/_source` to `assets/fr/images/web`.

> ### Technical details
>
> By default, the home page (aka the landing page) is in the project's parent language. If the landing-page URL contains a query string defining a language (e.g `?lang=fr`), by default the `<title>` element and masthead will be translated by Javascript, using phrases set in `locales.yml`. However, the social-sharing (open graph) data will remain in the parent language, e.g. English.
>
> So for social-sharing purposes especially, it is better to provide fully translated landing pages in each language. To do this, create a folder in the root directory named after the relevant language code. In that folder, create an `index.md` file. This is the landing page for that language. It's best to copy and then translate the existing `index.md` file in the root directory.
>
> If that page exists, and a user navigates to a landing page containing a query string defining the language, they will be redirected to the actual, fully translated landing page for that language.
{:.box}

## Translating project pages

Project pages are pages that are common to your whole project, not just one book. Examples are the landing page, the search page, the contact page, and the about page.

See 'Translating the landing page' above for how to translate that page. Then you can create translated versions of other project pages by adding them to a language directory in the project root in the same way. E.g. the French version of the 'About' page would be in `fr/about.md`.
