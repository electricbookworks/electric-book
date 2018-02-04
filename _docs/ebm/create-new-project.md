---
title: Create a new project
categories:
  - Electric Book Manager
order: 3
---

# Create a new project
{:.no_toc}

* Page contents
{:toc}

A project can contain one or more books, such as a series or collection. It will be stored on GitHub as a single repository.

To create a brand new project (that is, not contributing to an existing project or creating an adaptation or translation):

1. Once signed in, from the dashboard click:
   
    - 'Add a project'
    - 'Start a new project'
    - 'Next'.

1. Enter the details of your new project:
    
    - Give your project a name. Use only lowercase letters and dashes, and no spaces.
    - If the project should belong to an organisation, enter the organisation's GitHub username. (You may first have to [create a new organisation on GitHub](https://github.com/account/organizations/new.)
    
        Note that to set an organisation as the owner, you must have write access to that organisation, which is set in that organisation's GitHub settings.

    - Choose whether to make your project private.

        By default, a new GitHub repository is public. That is, it is read-only for the general public, and only invited collaborators can write to it. Also, anyone can make and edit their own copy of your public repository. 

        If you have a [paid GitHub account](https://github.com/settings/billing), you can make your repository private. Then no one can see it unless they are invited. If you create a public project on the Electric Book Manager, and then want to make it private, you can make that change in the settings for the repository on GitHub.

    - Click 'New project'.

It will take a few seconds for the Electric Book Manager to set up your new project for you, ready for adding content. 

> Technical note: Creating a new project creates a new repository on GitHub, copies the current Electric Book template to it, and clones the repository to the EBM. The copy of the template is not a fork or clone: it has a clean Git history.

# Create an adaptation

When you want to create a new project, but starting with another project as your template, you are creating an adaptation. Once created, an adaptation has no ongoing link to its parent, and does not share any version-control history with its parent. It is a completely separate project.

To create an adaptation:

1. Log into the Electric Book Manager.
2. Click 'Add a new project'.
3. Click 'Create an adaptation of an existing project'
4. Enter a name for the project. The name does not need to be related to the parent project's name. The name should use only lowercase letters, numbers, and dashes, with no spaces.
5. Enter the username of the GitHub organization the project should belong to, or leave this field blank if you, as an individual, will be the owner of this project.

    Note that to set an organisation as the owner, you must have write access to that organisation, which is set in that organisation's GitHub settings.

6. Enter the GitHub path for the project that you will be adapting. This is the name of the owner of the parent project, a forward slash, and the parent project's name, using only lowercase letters and without spaces. For example, 'hogarthpress/the-waste-land'.

    **Warning**: Be careful when creating an adaptation of a private project! If you do not tick 'Make this project private', the adaptation will *not* be private.
