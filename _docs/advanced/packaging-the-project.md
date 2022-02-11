---
title: Packaging the project
categories: advanced
---

# Packaging the project
{:.no_toc}

You may need to package your project without its Git history and non-version-controlled (`.gitignore`d) files. For instance, we might include an `electric-book.zip` package, containing the Electric Book template, in a release. This zip file contains the entire template without its Git history, so that it's the blank slate you need to start a new project.

To create a package, from the command line run this:

``` sh
npm run electric-book -- package
```

A zip file of your project will be saved to the `_output` folder.
