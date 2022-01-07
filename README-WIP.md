# Work-in-progress

This `restructure-meta-text` branch is a major restructuring of the EBT.

Its primary aims are:

1. Remove the `/text` folder, moving markdown files up into the book folder, alongside the images, styles and fonts folders. This is better for SEP and simpler for editing. It's also intuitive because markdown files are the foundation of the book, onto which we add images, styles and fonts.

2. Split book metadata into book-specific files. That is, replace the `meta.yml` file with separate metadata files, where each book gets its own file. This will make it easier to maintain projects with several books.

3. Replace the output scripts with a cross-platform Node script designed to be run with a single command, so that it can be automated from a web- or Electron-based GUI. Creating this here is more efficient than refactoring the existing OS-specific shell scripts to handle the new file structure.

4. Add checks for basic project structure and installed dependencies (e.g. pandoc, jekyll)?

## To do

1. Replace `file-list` file with JS-driven way to fetch the file list for Prince [done]
1. Handle all output in run.js (cross-platform)
1. Create output tests (possibly in a separate project after this one)
