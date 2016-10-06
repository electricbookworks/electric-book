:: Don't show these commands to the user
@ECHO off
:: Set the title of the window
TITLE Electric Book

:: Start and reset a bunch of variables
:begin
SET process=0
SET bookfolder=
SET config=
SET repeat=
SET baseurl=
SET location=
SET firstfile=

:: Ask what we're going to be doing.
ECHO Electric Book options
ECHO ---------------------
ECHO.
ECHO 1. Create a print PDF
ECHO 2. Create a screen PDF
ECHO 3. Run as a website
ECHO 4. Create EPUB-ready files
ECHO 5. Install or update dependencies
ECHO 6. Exit
ECHO.
SET /p process=Enter a number and hit return. 
    IF "%process%"=="1" GOTO printpdf
    IF "%process%"=="2" GOTO screenpdf
    IF "%process%"=="3" GOTO website
    IF "%process%"=="4" GOTO epub
    IF "%process%"=="5" GOTO install
    IF "%process%"=="6" GOTO:EOF
    GOTO choose

    :: :: :: :: :: ::
    :: PRINT PDF   ::
    :: :: :: :: :: ::

    :printpdf
    :: Encouraging message
    ECHO.
    ECHO Okay, let's make a print-ready PDF.
    ECHO.
    :: Ask user which folder to process
    SET /p bookfolder=Which book folder are we processing? 
    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    ECHO.
    ECHO Any extra config files?
    ECHO Enter filenames (including any relative path), comma separated, no spaces. E.g.
    ECHO _configs/_config.myconfig.yml
    ECHO If not, just hit return.
    ECHO.
    SET /p config=
    ECHO.
    :: Loop back to this point to refresh the build and PDF
    :printpdfrefresh
    :: let the user know we're on it!
    ECHO Generating HTML...
    :: ...and run Jekyll to build new HTML
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,%config%"
    :: Navigate into the book's folder in _html output
    CD _html\%bookfolder%\text
    :: Let the user know we're now going to make the PDF
    ECHO Creating PDF...
    :: Check if the _output folder exists, or create it if not.
    IF not exist ..\..\..\_output\NUL
    MKDIR ..\..\..\_output
    :: Run prince, showing progress (-v), printing the docs in file-list
    :: and saving the resulting PDF to the _output folder
    :: (For some reason this has to be run with CALL)
    CALL prince -v -l file-list -o ..\..\..\_output\%bookfolder%.pdf
    :: Navigate back to where we began.
    CD ..\..\..
    :: Tell the user we're done
    ECHO Done! Opening PDF...
    :: Navigate to the _output folder...
    CD _output
    :: and open the PDF we just created 
    :: (`start` so the PDF app opens as a separate process, doesn't hold up this script)
    start %bookfolder%.pdf
    :: Navigate back to where we began.
    CD ..\
    :: Let the user easily refresh the PDF by running jekyll b and prince again
    SET repeat=
    SET /p repeat=Enter to run again, or any other key and enter to stop. 
    IF "%repeat%"=="" GOTO printpdfrefresh
    ECHO.
    GOTO begin


    :: :: :: :: :: ::
    :: SCREEN PDF  ::
    :: :: :: :: :: ::

    :screenpdf
    :: Encouraging message
    ECHO.
    ECHO Okay, let's make a screen PDF.
    ECHO.
    :: Ask user which folder to process
    :choosefolder
    SET /p bookfolder=Which book folder are we processing? 
    IF "%bookfolder%"=="" GOTO choosefolder
    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    ECHO.
    ECHO Any extra config files?
    ECHO Enter filenames (including any relative path), comma separated, no spaces. E.g.
    ECHO _configs/_config.myconfig.yml
    ECHO If not, just hit return.
    ECHO.
    SET /p config=
    ECHO.
    :: Loop back to this point to refresh the build and PDF
    :screenpdfrefresh
    :: let the user know we're on it!
    ECHO Generating HTML...
    :: ...and run Jekyll to build new HTML
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,%config%"
    :: Navigate into the book's folder in _html output
    CD _html\%bookfolder%\text
    :: Let the user know we're now going to make the PDF
    ECHO Creating PDF...
    :: Run prince, showing progress (-v), printing the docs in file-list
    :: and saving the resulting PDF to the _output folder
    :: (For some reason this has to be run with CALL)
    CALL prince -v -l file-list -o ..\..\..\_output\%bookfolder%.pdf
    :: Navigate back to where we began.
    CD ..\..\..
    :: Tell the user we're done
    ECHO Done! Opening PDF...
    :: Navigate to the _output folder...
    CD _output
    :: and open the PDF we just created 
    :: (`start` so the PDF app opens as a separate process, doesn't hold up this script)
    start %bookfolder%.pdf
    :: Navigate back to where we began.
    CD ..\
    :: Let the user easily refresh the PDF by running jekyll b and prince again
    SET repeat=
    SET /p repeat=Enter to run again, or any other key and enter to stop. 
    IF "%repeat%"=="" GOTO screenpdfrefresh
    ECHO.
    GOTO begin


    :: :: :: :: :: ::
    :: WEBSITE     ::
    :: :: :: :: :: ::

    :website
    :: Encouraging message
    ECHO Okay, let's make a website.
    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    ECHO.
    ECHO Any extra config files?
    ECHO Enter filenames (including any relative path), comma separated, no spaces. E.g.
    ECHO _configs/_config.myconfig.yml
    ECHO If not, just hit return.
    ECHO.
    SET /p config=
    ECHO.
    :: Ask the user to set a baseurl if needed
    ECHO Do you need a baseurl?
    ECHO If yes, enter it with no slashes at the start or end, e.g.
    ECHO my/base
    ECHO.
    SET /p baseurl=
    ECHO.
    :: let the user know we're on it!
    ECHO Getting your site ready...
    ECHO You may need to reload the web page once this server is running.
    :: Open the web browser
    :: (This is before jekyll s, because jekyll s pauses the script.)
    START "" "http://127.0.0.1:4000/"
    :: Two routes to go with or without a baseurl
    IF "%baseurl%"=="" GOTO servewithoutbaseurl
        :: Route 1, for serving with a baseurl
        :servewithbaseurl
        :: Run Jekyll
        CALL bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,%config%" --baseurl="/%baseurl%"
        :: Open the web browser
        START "" "http://127.0.0.1:4000/%baseurl%/"
        :: And we're done here
        GOTO websiterepeat
        :: Route 2, for serving without a baseurl
        :servewithoutbaseurl
        :: Run Jekyll
        CALL bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,%config%" --baseurl=""
    :: Let the user rebuild and restart
    :: 
    :: TO DO: This is not yet working. The script ends when you Ctrl-C to stop the website.
    :: 
    :websiterepeat
    SET repeat=
    SET /p repeat=Enter to restart the website process, or any other key and enter to stop. 
    IF "%repeat%"=="" GOTO website
    ECHO.
    GOTO begin


    :: :: :: :: :: ::
    :: EPUB        ::
    :: :: :: :: :: ::

    :epub
    :: Encouraging message
    ECHO.
    ECHO Okay, let's make epub-ready files.
    ECHO.
    :: Remember where we are by assigning a variable to the current directory
    SET location=%~dp0
    :: Ask user which folder to process
    :choosefolder
    SET /p bookfolder=Which book folder are we processing? 
    ECHO.
    ECHO What is the first file in your book? Usually the cover.
    ECHO (Don't include the .html file extension.)
    ECHO.
    SET /p firstfile=
    IF "%bookfolder%"=="" GOTO choosefolder
    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    ECHO.
    ECHO Any extra config files?
    ECHO Enter filenames (including any relative path), comma separated, no spaces. E.g.
    ECHO _configs/_config.myconfig.yml
    ECHO If not, just hit return.
    ECHO.
    SET /p config=
    ECHO.
    :: Loop back to this point to refresh the build again
    :epubrefresh
    :: let the user know we're on it!
    ECHO Generating HTML...
    :: ...and run Jekyll to build new HTML
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,%config%"
    :: Navigate into the book's folder in _html output
    CD _html\%bookfolder%\text
    :: Let the user know we're now going to open Sigil
    ECHO Opening Sigil...
    :: Temporarily put Sigil in the PATH, whether x86 or not
    PATH=%PATH%;C:\Program Files\Sigil;C:\Program Files (x86)\Sigil
    :: and open the cover HTML file in it, to load metadata into Sigil
    START "" sigil.exe "$firstfile.html"
    :: Open file explorer to make it easy to see the HTML to assemble
    %SystemRoot%\explorer.exe "%location%_html\%bookfolder%\"
    :: Navigate back to where we began
    CD "%location%"
    :: Tell the user we're done
    ECHO Done! You can now assemble your EPUB in Sigil.
    :: Let the user easily run that again by running jekyll b and prince again
    SET repeat=
    SET /p repeat=Enter to run again, or any other key and enter to stop. 
    IF "%repeat%"=="" GOTO epubrefresh
    ECHO.
    GOTO begin

    :: :: :: :: :: ::
    :: INSTALL     ::
    :: :: :: :: :: ::

    :install
    :: Encouraging message
    ECHO.
    ECHO Running Bundler to update and install dependencies. 
    ECHO If Bundler is not already installed, exit and run
    ECHO gem install bundler
    ECHO from the command line.
    ECHO.
    :: Run bundle update
    CALL bundle update
    :: Run bundle install
    CALL bundle install
    :: Back to the beginning
    ECHO.
    GOTO begin
