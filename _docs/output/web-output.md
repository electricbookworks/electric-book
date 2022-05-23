---
title: Web output
categories: output
order: 1
---

# Web output
{:.no_toc}

* Page contents
{:toc}

You can run the website version of your project by running:

```shell
npm run electric-book -- output
```


## Using GitHub Pages

If you activate GitHub Pages in your repository settings on [GitHub.com](https://github.com), GitHub will host your built site for free. GitHub will assign the site a URL by default that looks like `username.github.io/reponame`. You can then set up a custom domain name by pointing your own domain at GitHub's servers, and putting a CNAME file containing that domain name in your project's root directory.

See GitHub's help docs for [guidance](https://help.github.com/articles/using-a-custom-domain-with-github-pages/) on how to do this.

In your Electric Book project, you must update the `baseurl` in `_config.yml` for this to work.

- If you are using a custom domain, the `baseurl` should be empty: `baseurl: ""`
- If you are using the `username.github.io/reponame` URL that GitHub provides automatically, you must set the `baseurl` to the name of your repo, with a slash in front of it. E.g.: `baseurl: "/superpotatoes"`.

This is because your site is being served at a subdirectory-like URL, and all links in your book must be relative to that full URL. For instance, it must know that your website's CSS is at `farmerjane.github.io/superpotatoes/book/styles/web.css`, and not `farmerjane.github.io/book/styles/web.css`.
