# Includes

Includes in this folder without file extensions are intended for use in markdown. This keeps their syntax neat and intuitive, e.g.

``` liquid
{% include metadata %}
```

Includes in this folder with file extensions tend to be customised per project. E.g. `end-elements.html` and `footer.html`.

The `theme` folder is for creating custom includes for a new project. This keeps them neatly distinct from the template's includes. If you use these in markdown, you will need to add `theme/` to the include tag. E.g.

```liquid
{% include theme/elephant %}
```

Includes in `template` are code templates used in rendering processes. We give them appropriate file extensions to make development easier.
