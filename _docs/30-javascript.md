---
title: Using Javascript
---

# Using Javascript

Wherever possible, we like to create books without Javascript. Printing and ebooks is simpler without it, and it can quickly bloat websites. That said, if you need to use Javascript, it may be best to place scripts in each book's own `js` folder. 

To add them to your `<head>` elements, link to them by adding `<script>` tags to `_includes/head-elements`. You can also link to remote scripts here, without the need to place the actual scripts in the `js` folder.

Keep in mind that anything you add to `head-elements` will be added to all books in the series folder. If necessary, advanced Jekyll users can try applying different scripts to different books by using Liquid logic tags. For instance, `if page.path contains book`, where book is your book's folder.
