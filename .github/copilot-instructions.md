# Electric Book Template

This project is built on the [Electric Book template](https://github.com/electricbookworks/electric-book) (EBT), a Jekyll-based system for producing books in multiple formats: web, print PDF, screen PDF, EPUB, and app.

## Commands

Run `npm run eb` to see all available commands. Common ones:

- `npm run eb -- output` — serve website locally
- `npm run eb -- output -f print-pdf` — build print PDF
- `npm run eb -- output -f epub` — build EPUB
- `npm run eb -- images` — process images

## Essential conventions

- Books live in top-level folders. Check `_data/works/` to discover which books exist — each subfolder corresponds to a book directory.
- Content files use numbered prefixes for reading order (`0-0-cover.md`, `01.md`). Alphabetical sort = reading order.
- Every content file needs `title` and `style` in its YAML frontmatter.
- `permalink: none` is set globally — do not add `permalink` to any page's frontmatter.
- The `site.output` Liquid variable (`web`, `print-pdf`, `screen-pdf`, `epub`, `app`) controls format-specific rendering in templates.
- Includes that need book metadata must call `{% include metadata %}` first.
- Any `.scss` file processed by Jekyll must start with empty YAML front matter (`---` / `---`).
- Do not edit files in `_sass/template/` or `node_modules/` — those come from the [electric-book-modules](https://github.com/electricbookworks/electric-book-modules) package.

## Standards

Javascript should follow Standard JS syntax.

## More AI context

For comprehensive AI agents, file-specific instructions, and prompts, see [context-ebt](https://github.com/electricbookworks/electric-book-template-context). Clone it and symlink or copy its `.github/` contents into your project.
