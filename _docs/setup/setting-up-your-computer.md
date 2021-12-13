---
title: Setting up your computer
categories: setup
order: 5
---

# Setting up your computer

If you want to edit and output books on your own computer (as opposed to using a hosted, online service like the Electric Book Manager), you need to get it set up first.

The Electric Book workflow is like a toolkit: it uses a range of great open-source projects. So setting it up involves installing this software.

We recommend installing this software in this order (since some of these applications depend on others):

| Software                                                                                                                                      | Reason                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| A Ruby version manager (e.g. [Homebrew](https://brew.sh/) on Mac or [Chocolatey](https://chocolatey.org/) for Windows)                        | Ensures you're using the right version of Ruby                        |
| [Ruby 2.4 or later](https://www.ruby-lang.org/en/)                                                                                            | The language that Jekyll runs in                                      |
| [Jekyll](https://jekyllrb.com/)                                                                                                               | Builds finished HTML from your content and the Electric Book template |
| [Bundler](https://bundler.io/)                                                                                                                | Manages other Ruby applications ('gems') that Jekyll depends on       |
| [Pandoc](https://pandoc.org/)                                                                                                                 | Used for converting books to MS Word                                  |
| [Git](https://git-scm.com/) (or a Git desktop app like [GitHub Desktop](https://desktop.github.com/))                                         | Used for version control                                              |
| A code editor (e.g. [Sublime Text](https://www.sublimetext.com/), [VS Code](https://code.visualstudio.com/), [Brackets](https://brackets.io/)) | The best way to edit markdown and other content and style files       |
| [Node.js](https://nodejs.org/en/)                                                                                                             | Required to run Gulp                                                  |
| [Gulp](https://gulpjs.com/)                                                                                                                   | Used for processing image files in bulk                               |
| [Graphicsmagick](http://www.graphicsmagick.org/)                                                                                              | Used for multi-format image conversions                               |

We also use one proprietary, commercial application called PrinceXML, which is for creating PDFs. (If you're only making ebooks, websites and apps, you don't need Prince.) See ['PrinceXML settings'](princexml.html) for more detail.

If you also want to create apps, you will need to install:

1. [Apache Cordova](https://cordova.apache.org/)
1. [Android Studio](https://developer.android.com/studio/) for Android apps
1. [X-Code](https://developer.apple.com/xcode/) for Apple apps
1. [Visual Studio](https://visualstudio.microsoft.com/) for Windows apps

## Detailed guides

Each of the tools listed above have their own installation guides. Nonetheless, sometimes you need extra guidance for the tricky bits or options specific to the Electric Book workflow.

### Mac

For a detailed guide on installing all dependencies on a Mac, see [this guide](https://gist.github.com/arthurattwell/88be57cc2f660e35ebade4d098d67e4b).

### Windows

See these detailed guides on setting up a Windows machine:

- [installing Jekyll on Windows (including Chocolatey, Ruby, and Bundler)](https://gist.github.com/arthurattwell/281a5e1888ffd89b08b4861a2e3c1b35)
- [installing the remaining Electric Book dependencies](https://gist.github.com/arthurattwell/0ada06e8398e4180cd985d1cb91309ad).

### Linux

We don't have a detailed guide for setting up on Linux yet. Ubuntu users who are familiar with shell scripts will find [this script](https://gist.github.com/arthurattwell/2684d50c286f3b005ea84eb61954458f) useful. It installs all the dependencies in one go. Don't run it as-is unless you know what you're doing. It may be better to read it as a guide to the commands you might run to install each Electric Book dependency in turn.

### Suggestions

If you know of other good guides to setting up these applications, especially for Ubuntu Linux, please let us know. We have successfully installed all of these tools on Ubuntu, using each project's own installation guides and various online fora.

You can add suggestions on the [Electric Book issues tracker](https://github.com/electricbookworks/electric-book/issues/).
