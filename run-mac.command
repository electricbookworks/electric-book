#!/bin/bash
cd -- "$(dirname "$0")"
# That tells the system to use a Bourne shell interpreter,
# and then tells OSX to run this script from the current directory.
# Don't echo these commands:
set +v

# Set initial variables.
process=0
bookfolder="book"
config=""
repeat=""
baseurl=""
location=""
firstfile=""

# Keep some options open for the user.
while [ "$process" = "0" ]
    do
    echo -n "
Electric Book options
---------------------

1. Create a print PDF
2. Create a screen PDF
3. Run as a website
4. Create EPUB-ready files
5. Install or update dependencies
6. Exit

Enter a number and hit enter. "
    read process
    ##################
    # PRINT PDF      #
    ##################
    if [ "$process" = "1" ]
        then
        # Ask user which folder to process
        echo -n "Which book folder are we processing? "
        read bookfolder
        echo "Okay, let's make a print-ready PDF using $bookfolder..."
        # Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
        echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
        read config
        # We're going to let users run this over and over by pressing enter
        while [ "$repeat" = "" ]
        do
            # let the user know we're on it!
            echo "Generating HTML..."
            # ...and run Jekyll to build new HTML
            bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,$config"
            # Navigate into the book's folder in _html output
            cd _html/$bookfolder/text
            # Let the user know we're now going to make the PDF
            echo Creating PDF...
            # Run prince, showing progress (-v), printing the docs in file-list
            # and saving the resulting PDF to the _output folder
            prince -v -l file-list -o ../../../_output/$bookfolder.pdf
            # Navigate back to where we began.
            cd ../../..
            # Tell the user we're done
            echo Done! Opening PDF...
            # Navigate to the _output folder...
            cd _output
            # and open the PDF we just created
            # (for Linux, this will need to be xdg-open, not open)
            open $bookfolder.pdf
            # Navigate back to where we began.
            cd ../
            # Ask the user if they want to refresh the PDF by running Jekyll and Prince again
            repeat=""
            echo "Enter to run again, or any other key and enter to stop."
            read repeat
        done
        # Head back to the Electric Book options
        process=0
    ##################
    # SCREEN PDF     #
    ##################
    elif [ "$process" = 2 ]
        then
        # Ask user which folder to process
        echo -n "Which book folder are we processing? "
        read bookfolder
        echo "Okay, let's make a screen PDF using $bookfolder..."
        # Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
        echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
        read config
        # We're going to let users run this over and over by pressing enter
        while [ "$repeat" = "" ]
        do
            # let the user know we're on it!
            echo "Generating HTML..."
            # ...and run Jekyll to build new HTML
            bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,$config"
            # Navigate into the book's folder in _html output
            cd _html/$bookfolder/text
            # Let the user know we're now going to make the PDF
            echo Creating PDF...
            # Run prince, showing progress (-v), printing the docs in file-list
            # and saving the resulting PDF to the _output folder
            prince -v -l file-list -o ../../../_output/$bookfolder.pdf
            # Navigate back to where we began.
            cd ../../..
            # Tell the user we're done
            echo Done! Opening PDF...
            # Navigate to the _output folder...
            cd _output
            # and open the PDF we just created
            # (for Linux, this will need to be xdg-open, not open)
            open $bookfolder.pdf
            # Navigate back to where we began.
            cd ../
            # Ask the user if they want to refresh the PDF by running Jekyll and Prince again
            repeat=""
            echo "Enter to run again, or any other key and enter to stop."
            read repeat
        done
        # Head back to the Electric Book options
        process=0
    ##################
    # WEBSITE        #
    ##################
    elif [ "$process" = 3 ]
        then
        # We're going to let users run this over and over by pressing enter
        while [ "$repeat" = "" ]
        do
            echo "Okay, let's make a website..."
            # Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
            echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
            read config
            # Ask the user to set a baseurl if needed
            echo -n "Do you need a baseurl?
If yes, enter it with no slashes at the start or end, e.g.
my/base
"
            read baseurl
            # let the user know we're on it!
            echo "Getting your site ready...
You may need to reload the web page once this server is running."
            # Open the web browser, withour or, then, with the baseurl
            # (This is before jekyll s, because jekyll s pauses the script.)
            if [ "$baseurl" = "" ]
            then
                open "http://127.0.0.1:4000/"
            else
                open "http://127.0.0.1:4000/$baseurl/"
            fi
            # ...and run Jekyll
            bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,$config" --baseurl="/$baseurl"
            # Ask the user if they want to rebuild the site
            # TO DO: Not sure this works because Jekyll owns the terminal and Ctrl+C will kill it entirely?
            repeat=""
            echo "Enter to run again, or any other key and enter to stop."
            read repeat
        done
        # Head back to the Electric Book options
        process=0
    ##################
    # EPUB           #
    ##################
    elif [ "$process" = 4 ]
        then
        # Ask user which folder to process
        echo -n "Which book folder are we processing? "
        read bookfolder
        echo -n "What is the first file in your book? usually the cover.
(Don't include the file extension. Default is 0-0-cover.) "
        read firstfile
        if [ "$firstfile" = "" ]
            then
            firstfile="0-0-cover"
        fi
        # Remember the current folder
        location=$(pwd)
        # Ask the user to add any extra Jekyll config files, e.g. _config.myconfig.yml
        echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
        read config
        echo "Okay, let's make epub-ready files using $bookfolder..."
        # We're going to let users run this over and over by pressing enter
        while [ "$repeat" = "" ]
        do
            # let the user know we're on it!
            echo "Generating HTML..."
            # ...and run Jekyll to build new HTML
            bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,$config"
            # Navigate into the book's folder in _html output
            cd _html/$bookfolder/text
            # Navigate back to where we began.
            cd $location
            # Navigate to the _output folder...
            cd _output/$bookfolder/text
            # and open the first epub file
            # Let the user know we're now going to open Sigil
            # NOTE: Sigil is not supported on Linux, so many users won't have it.
            echo "Opening Sigil..."
            sigil "$firstfile.html"
            # Navigate back to where we began.
            cd $location
            # Got into HTML-output folder
            cd _html/$bookfolder
            # Open file browser to see epub-ready HTML files
            open .
            # Navigate back to where we started
            cd $location
            # Ask the user if they want to refresh the PDF by running Jekyll and Prince again
            repeat=""
            echo "Enter to run again, or any other key and enter to stop."
            read repeat
        done
        # Head back to the Electric Book options
        process=0
    ##################
    # INSTALL        #
    ##################
    elif [ "$process" = 5 ]
        then
        echo "Running Bundler to update and install dependencies.
If Bundler is not already installed, exit and run
gem install bundler
from the command line."
        # Update gems
        bundle update
        # Install gems
        bundler install
        # Head back to the Electric Book options
        process=0
    ##################
    # EXIT           #
    ##################
    fi
done
