---
title: File lists
categories: setup
order: 40
---

# File lists

You should define which markdown files to include in a given output in the `files:` section of your book's YAML file in `_data/works`.

If you don't include a `files:` section in your book's YAML file, some outputs will still work. For example, PDF outputs with no `files` specified will include all the markdown files in your book's folder (with any `index.md` file first, and the rest in alphabetical order).

For example, to add files to include in a print PDF, you can follow the example of the template: under `files:`, add a hyphen followed by the filename in straight double quotes. This filename is the exact name of the file as it is in your project, but *without* a file extension. 

``` yaml
        files:
          - "0-1-titlepage"
          - "0-2-copyright"
          - "0-3-contents"
          - "01"
          - "02"
```

Epub file lists should also contain values that describe book parts [as defined by the IDPF here](http://www.idpf.org/epub/20/spec/OPF_2.0.1_draft.htm#Section2.6). E.g.:

``` yaml
        files:
          - "0-0-cover": "cover"
          - "0-1-titlepage": "title-page"
          - "0-2-copyright": "copyright-page"
          - "0-3-contents": "toc"
          - "01": "text"
          - "02"
```

