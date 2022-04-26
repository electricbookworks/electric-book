# Includes

Includes are files that can be inserted in other files with the Liquid `include` tag. E.g. where the tag `{% include share.html %}` appears, Jekyll will insert the contents of the file `_includes/share.html`.

Files in this folder without file extensions are intended for use in markdown. This keeps their syntax neat and intuitive, as if the filename is just a keyword. E.g.

``` liquid
{% include metadata %}
```

Files in this folder with file extensions tend to be customised per project, or are code templates used in rendering processes. The file extension makes it easier for code editors to apply useful syntax highlighting.

E.g. `end-elements.html` and `footer.html` are often customised. And `head.html` is rarely customised, and is used in building the `<head>` element of almost all pages.

Subfolders can be used to organise groups of files, such as `icons`. When including a file from a subfolder, include the subfolder in the include tag, e.g.

``` liquid
{% include icons/email.svg %}
```
