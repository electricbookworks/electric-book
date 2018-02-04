---
title: Edit, add, and save files
categories:
  - Electric Book Manager
order: 4
---

# Editing, adding, and saving files
{:.no_toc}

* Page contents
{:toc}

## Editing text

1. Once signed in, click on the name of your project (or click ‘Manage’ next to the name) to open the project-details page.
2. On the details page, click ‘Edit’ to load the editor.
3. In the sidebar on the left, click on the file you want to edit. For instance, to edit Chapter 1 in the ‘book’ folder, you might open `book/text/01.md`.
4. Edit the text in markdown. (See the [guidelines on markdown](../editing/markdown.html).)

### Searching in files

You can search for text in the file you are editing.

1. From the editing page, open the file you would like to search in. 
2. Click anywhere in the text of that file.
3. Click Ctrl F on Windows or Linux, or Cmd F on Mac, to bring up a search bar within that file.
4. Enter your search term and hit Enter.
5. To do regular expression (regex) search, put your search between forward slashes. E.g. `/Americani[sz]e/` will find `Americanise` and `Americanize`.

## Adding new files

If you need to add a new file (for a new chapter, for example):

1. In the editor view, click ‘New file’.
2. Enter the full path to the file. Note that these paths have very strict requirements. A valid path for a chapter in the book folder would look like this: `book/text/filename.md`. Do not use spaces in filenames. We recommend using only lowercase letters and numbers, optionally separated with hyphens. Remember ot include the `.md` file extension for markdown files (the filetype for text).
3. Click ‘Create file’. Your file will now appear at the bottom of the sidebar.
4. Every markdown file in a book must start with two rows of three hyphens:

    ```
    ---
    ---
    ```

    Between these, you can include 'YAML frontmatter', which is information about the file. Usually, this is just a title for the file. For example:

    ```
    ---
    title: "Chapter One"
    ---
    ```

    After this frontmatter section, add your text content.

## Saving and version-control

Storing your content is done in two steps:

1. Saving your work on the EBM server (by saving).
2. Taking a snapshot of the project for version control (by committing after saving).

To save, click 'Save' while you work as often as you like. At least, when you’re done making changes and before you close a file, click ‘Save’.

When you are ready to create a snapshot of your project for version-control, click 'Commit' and enter a short note that describes the changes you've made. Committing does two important things:

1. It takes a snapshot of the entire project.
2. It sends that snapshot to your GitHub account.

Once you have clicked ‘Commit’ and entered a description of your change, you can click ‘View Edit History’ to go to GitHub and see the changes stored in your commit. This will open in a new tab. If you click on the commit description on GitHub, you will see a diff (for 'difference') of your contributions, with additions in green and deletions in red.

If your project has a parent repository, where you can send your changes to be reviewed by a managing editor, on the EBM you can click ‘Submit these changes for review’, and enter a short description of your submission. If you do not see this button, it means that there is no parent repository, or that you have not made any changes that the managing editor of the parent repository doesn’t already have.

You do not have to submit your changes after every commit. Try to group similar changes into one commit. And try to group similar commits into one submission. This will make your project history easier for you and others to understand.

Also keep in mind that sensible batches of commits and submissions makes it easier for a managing editor to review.

For more detail on collaborating, see [Collaboration](collaborate.html).
