---
title: Collaborate
categories:
  - Electric Book Manager
order: 6
---

# Collaborating
{:.no_toc}

* Page contents
{:toc}

## Overview

When you work with others on a project, you each work in your own copy of the project. One (or more) of your team manage the original version of the project. We call that person the *managing editor*: a managing editor is someone with write access to the original project repository.

Everyone else is a contributor, and they work in their own copies. They submit the changes in their copy to the managing editor for review. And the managing editor decides which changes are accepted into the original.

Most of the guidance on this page is for contributors.

## Create a copy of a project

In order to collaborate on a project, you need to make a copy of it that is ‘forked’ from the parent version. This allows you to send submissions to the parent, while working in your own version.

If you want to make a copy of a project but do not ever want to send submissions to the parent (in other words, you want an independent adaptation of a project), see the 'Create an adaptation' section of ['Create a new project'](create-new-project.html).
{:.sidenote}

1. Sign in to the Electric Book Manager.
2. From the dashboard, click ‘Add a project’.
3. Choose ‘Contribute to an existing project’. This will prompt you to enter the GitHub owner and repo for the project you will contribute to. To do this:

    Add the parent project owner’s name (which may be an individual's GitHub username or an organisation's GitHub username), followed by a forward slash and the name of the parent project. This path should not contain any spaces. For instance: `hogarthpress/the-waste-land`.

    You also have the option here to ‘Make this project private’. When you contribute to a private project, your copy will always be private, too. When you contribute to a public project, your copy will be public by default.

4. Click ‘Copy project’. It can take a few moments for your project to be ready.
5. You should then be redirected to the project detail page for your copy of the project.

    If this fails, you may be trying to contribute to a private project to which you have not been given access. Make sure that the parent project’s owner has invited you to collaborate on the book. They must do this on GitHub in the repository settings.

    Once they have invited you, you can accept this invitation in the EBM, and then follow the process from step 1 above to make your own copy of the project to work in.

## Contribute translations

To create a translation of a book, follow the [Electric Book guidelines on Translations](../setup/translations.html).

## Update from the parent project

While collaborating on a book by editing your own copy of it, it is essential to keep your copy up to date with any changes made to the parent version, especially if there are many people contributing to it. When you updating from the original, you get any new changes and content from the parent version of your project in your own copy.

When there are changes in the parent project, you will see a notification on your project's page in the EBM, and a button to click to update from the original. When you click it, changes in the parent will be merged automatically with your changes.

You will not be able to update from the parent version if you have made changes that you haven’t committed. This is because updating before committing your work would make it impossible for Git, the software running int he background, to merge the parent files with yours. So save and commit your work first.

Once you have committed your project, go to the project page (from the dashboard, click on the name of your project).

If there is content in the parent version that is not yet in your copy, you will see an ‘Update my copy from the original’ button. 

Click this button to merge changes from the parent into your version. If the parent version and your version include changes to the same lines of text or to images, you will be asked to resolve these conflicts in an editor. Manually edit your version, then click 'Mark resolved' and 'Accept update'.

If you click ‘View Edit History’, you will be able to see the latest changes to your copy, including the work that hasbeen merged in from the parent version.

While you must save and commit before updating, you can submit your changes for review before or after updating from the parent version.

## Submit changes for review 

Once you have added new files, edited files, or added images to your version of the project, you will need to save and commit your work before submitting it to the managing editor for review.

To send your work to the parent project:

1. Go to the project detail page by clicking on the name of the project from the dashboard or from the editor.
2. If you have new content in your copy (saved and committed) that is not yet in the parent version, you will see a ‘Submit your changes for review’ button. 

    You do not have to do this immediately, but you should click this to submit your changes for review when you have a significant change that you’d like to contribute to the parent version of your project.

3. Once you have clicked ‘Submit your changes for review’, enter a message describing your changes.
4. You may receive an email from GitHub notifying you that your submission has been ‘merged’ and ‘closed’, meaning your work has been reviewed by the parent project’s owner.

## View change history

To see the history of all the changes to your project:

- On the project detail page (which you reach by clicking on the project name from the dashboard), click the GitHub logo at the top of the page.
- You can also click ‘View Edit History’ to see the changes which you’ve made and included in your version of the project.
- You can also click the GitHub logo next to your project’s name on the editing page.

To see the history of a particular file:

1. On the editing page, open the particular file that you’re interested in by clicking on its name in the sidebar.
2. Click the GitHub logo next to that particular file’s name.

## Manage collaborators

For private projects, in order to invite someone to collaborate on your version of the project the owner of the original project (which might be your parent or grandparent project) will need to grant that person read access to the original project before they can collaborate on your version by making their own copy.

To manage who can collaborate on your version of the project:

1. From the dashboard, clicking on the name of your project will take you to the detail page for that project.
2. You will see a ‘Collaboration’ button on that page. Click this button to open a new tab in your browser (if a new tab doesn't open, make sure your browser isn’t preventing new popups), which will prompt you to sign into GitHub.
3. This will redirect you to repository settings page on GitHub.
4. To add a collaborator on GitHub, go to the ‘Collaborators’ tab, and add their username (note that each collaborator must have a GitHub account).
5. If you are managing a private repository inan organisation that can provide read or write access, be careful to set whether you want the collaborator to have read or write access. If they have write access, they can act as a managing editor on the project: they can edit the original directly and review incoming submissions.

    If you are working in a public repository, when you invite a someone to collaborate they always have write access to your project, making them a managing editor of your version, and not simply a contributor.

For good version control, collaborators should not be able to write into your version of the project; but should work in their own copy. It is therefore essential that after accepting your invitation, if collaborators do not see *their own version* of the project on their dashboard, they should click ‘Add a project’ and ‘Contribute to an existing project.’

See the 'Create a copy...' section above for more information on how to set up your own version of a project as a collaborator.

## Review submissions

If you are a managing editor (you are a managing editor on any project you can write to), you may receive submissions of changes from contributors.

When you invite someone to collaborate on a project, they need to accept this invitation, and should work into *their own version* of the project. Once a contributor has made changes to their version, saved and committed their changes, and submitted their changes for review, you will see submissions for review available from your EBM dashboard.

1. From the dashboard, under the ‘Manage’ button for the particular project, a button that says ‘Review Submissions (n)’ will display when there is a contribution to your version from someone downstream.
2. Click this button to review all submission descriptions on the project page.
3. Click on a submission description to review it. This will open a merge editor. (In the merge editor, changes you need to reivew are called 'conflicts', but this scary term should not make you worry.)
4. Click on the file that displays a conflict, and then make sure your version (shown on the left) and the incoming version (shown on the right) contain the same content. You are essentially deciding which changes should be final across all versions.

    You may edit the text on either side. You can click the arrows in the left pane to push your content to the incoming version. Or click the arrows in the right pane to push the incoming content into your version. The end result should be to have *exactly* the same content on both sides.

4. Click ‘Mark as resolved’ when both sides match (this automatically saves your changes).
5. Click ‘Okay accept update’.
6. Enter a message describing the changes you are including in the project.
7. Click ‘Commit’.
8. Once returned to the project page, you can click the GitHub logo at the top of the page or ‘View Edit History’ to see the changes that you’ve made and included in your version of the project, as stored on GitHub.
