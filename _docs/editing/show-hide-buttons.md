---
title: Show-hide buttons
categories: editing
order: 16
---

# Show-hide buttons

Sometimes you want to hide some content until a user clicks a button. For instance, you might want to hide the answer to a question until the user clicks a 'Show answer' button.

To hide any element, add a `.show-hide` class to it, For instance:

```md
The answer is 42.
{:.box .show-hide}
```

The answer is 42.
{:.box .show-hide}

You can set the default text on the button in `_data/locales.yml` at `input` > `show` and `input` > `hide`. And you can override this text for a specific button by adding a `data-show-text` and/or `data-hide-text` attribute to the element you're hiding. For example:

```md
The answer is 42.
{:.box .show-hide data-show-text="The answer to everything is..." data-hide-text="Thanks for all the fish."}
```

The answer is 42.
{:.box .show-hide data-show-text="The answer to everything is..." data-hide-text="Thanks for all the fish."}

This works in web and app formats by default. The `show-hide` class has no effect in PDF and epub outputs. To enable this behaviour in epub output, you will need to copy the `assets/js/show-hide.js` to your [epub scripts](../advanced/javascript.html#adding-scripts-to-epubs).
