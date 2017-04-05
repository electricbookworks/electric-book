:: Don't show these commands to the user
@ECHO off
:: Keep variables local, and expand at execution time not parse time
Setlocal enabledelayedexpansion
:: Set the title of the window
TITLE Electric Book

:: Start and reset a bunch of variables
:begin
SET process=0
SET bookfolder=
SET config=
SET imageset=
SET imageconfig=
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
ECHO 5. Export to Word
ECHO 6. Install or update dependencies
ECHO 7. Exit
ECHO.
SET /p process=Enter a number and hit return. 
    IF "%process%"=="1" GOTO printpdf
    IF "%process%"=="2" GOTO screenpdf
    IF "%process%"=="3" GOTO website
    IF "%process%"=="4" GOTO epub
    IF "%process%"=="5" GOTO word
    IF "%process%"=="6" GOTO install
    IF "%process%"=="7" GOTO:EOF
    GOTO choose

    :: :: :: :: :: ::
    :: PRINT PDF   ::
    :: :: :: :: :: ::

    :printpdf
    :: Encouraging message
    ECHO.
    ECHO Okay, let's make a print-ready PDF.
    ECHO.
    :: Remember where we are by assigning a variable to the current directory
    SET location=%~dp0
    :: Ask user which folder to process
    SET /p bookfolder=Which book folder are we processing? (Hit enter for default 'book' folder.) 
    IF "%bookfolder%"=="" SET bookfolder=book
    :: Ask if we're outputting the files from a subdirectory
    SET /p subdirectory=If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. 
    :print-pdf-otherconfigs
    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    ECHO.
    ECHO Any extra config files?
    ECHO Enter filenames (including any relative path), comma separated, no spaces. E.g.
    ECHO _configs/_config.myconfig.yml
    ECHO If not, just hit return.
    ECHO.
    SET /p config=
    ECHO.
    :: Ask if we're processing MathJax, so we know whether to pass the HTML through PhantomJS first
    ECHO Does this book use MathJax? If no, hit enter. If yes, hit any key then enter.
    SET /p print-pdf-mathjax=
    :: Loop back to this point to refresh the build and PDF
    :printpdfrefresh
    :: let the user know we're on it!
    ECHO Generating HTML...
    :: ...and run Jekyll to build new HTML
    :: with MathJax enabled if necessary
    IF "%print-pdf-mathjax%"=="" GOTO printpdfnomathjax
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,_configs/_config.mathjax-enabled.yml,%config%"
    GOTO printpdfjekylldone
    :printpdfnomathjax
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,%config%"
    :printpdfjekylldone
    :: Skip PhantomJS if we're not using MathJax.
    IF "%print-pdf-mathjax%"=="" GOTO printpdfafterphantom
    :: Run this through phantom for extra magic,
    :: We have to run the PhantomJS script from the folder it's in
    :: for the directory paths to work.
    CD _site\assets\js
    CALL phantomjs render-mathjax.js
    CD "%location%"
    :printpdfafterphantom
    :: Navigate into the book's folder in _site output
    CD _site\%bookfolder%\text\"%subdirectory%"
    :: Let the user know we're now going to make the PDF
    ECHO Creating PDF...
    :: Check if the _output folder exists, or create it if not.
    :: (this check is currently not working in some setups, disabling it)
    rem IF not exist ..\..\..\_output\NUL
    rem MKDIR ..\..\..\_output
    :: Run prince, showing progress (-v), printing the docs in file-list
    :: and saving the resulting PDF to the _output folder
    :: (For some reason this has to be run with CALL)
    SET print-pdf-filename=%bookfolder%-%subdirectory%
    IF "%subdirectory%"=="" SET print-pdf-filename=%bookfolder%
    CALL prince -v -l file-list -o "%location%_output\%print-pdf-filename%.pdf" --javascript
    :: Navigate back to where we began.
    CD "%location%"
    :: Tell the user we're done
    ECHO Done! Opening PDF...
    :: Navigate to the _output folder...
    CD _output
    :: and open the PDF we just created 
    :: (`start` so the PDF app opens as a separate process, doesn't hold up this script)
    start %print-pdf-filename%.pdf
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
    :: Remember where we are by assigning a variable to the current directory
    SET location=%~dp0
    :: Ask user which folder to process
    SET /p bookfolder=Which book folder are we processing? (Hit enter for default 'book' folder.) 
    IF "%bookfolder%"=="" SET bookfolder=book
    :: Ask if we're outputting the files from a subdirectory
    SET /p subdirectory=If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. 
    :screen-pdf-otherconfigs
    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    ECHO.
    ECHO Any extra config files?
    ECHO Enter filenames (including any relative path), comma separated, no spaces. E.g.
    ECHO _configs/_config.myconfig.yml
    ECHO If not, just hit return.
    ECHO.
    SET /p config=
    ECHO.
    :: Ask if we're processing MathJax, so we know whether to pass the HTML through PhantomJS first
    ECHO Does this book use MathJax? If no, hit enter. If yes, hit any key then enter.
    SET /p screen-pdf-mathjax=
    :: Loop back to this point to refresh the build and PDF
    :screenpdfrefresh
    :: let the user know we're on it!
    ECHO Generating HTML...
    :: ...and run Jekyll to build new HTML
    :: with MathJax enabled if necessary
    IF "%screen-pdf-mathjax%"=="" GOTO screenpdfnomathjax
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,_configs/_config.mathjax-enabled.yml,%config%"
    GOTO screenpdfjekylldone
    :screenpdfnomathjax
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,%config%"
    :screenpdfjekylldone
    :: Skip PhantomJS if we're not using MathJax.
    IF "%screen-pdf-mathjax%"=="" GOTO screenpdfafterphantom
    :: Run this through phantom for extra magic,
    :: We have to run the PhantomJS script from the folder it's in
    :: for the directory paths to work.
    CD _site\assets\js
    CALL phantomjs render-mathjax.js
    CD "%location%"
    :screenpdfafterphantom
    :: Navigate into the book's folder in _site output
    CD _site\%bookfolder%\text\"%subdirectory%"
    :: Let the user know we're now going to make the PDF
    ECHO Creating PDF...
    :: Run prince, showing progress (-v), printing the docs in file-list
    :: and saving the resulting PDF to the _output folder
    :: (For some reason this has to be run with CALL)
    SET screen-pdf-filename=%bookfolder%-%subdirectory%
    IF "%subdirectory%"=="" SET screen-pdf-filename=%bookfolder%
    CALL prince -v -l file-list -o "%location%_output\%screen-pdf-filename%.pdf" --javascript
    :: Navigate back to where we began.
    CD "%location%"
    :: Tell the user we're done
    ECHO Done! Opening PDF...
    :: Navigate to the _output folder...
    CD _output
    :: and open the PDF we just created 
    :: (`start` so the PDF app opens as a separate process, doesn't hold up this script)
    start %screen-pdf-filename%.pdf
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
    :: Ask if MathJax should be enabled.
    ECHO Do these books use MathJax? If no, hit enter. If yes, enter any key then enter.
    SET /p webmathjax=
    :: let the user know we're on it!
    ECHO Getting your site ready...
    ECHO You may need to reload the web page once this server is running.
    :: Two routes to go with or without a baseurl
    IF "%baseurl%"=="" GOTO servewithoutbaseurl
        :: Route 1, for serving with a baseurl
        :servewithbaseurl
        :: Open the web browser
        :: (This is before jekyll s, because jekyll s pauses the script.)
        START "" "http://127.0.0.1:4000/%baseurl%/"
        :: Run Jekyll, with MathJax enabled if necessary
        IF "%webmathjax%"=="" GOTO webnomathjax
        CALL bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,_configs/_config.mathjax-enabled.yml,%config%" --baseurl="/%baseurl%"
        GOTO webjekyllserved
        :webnomathjax
        CALL bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,%config%" --baseurl="/%baseurl%"
        :webjekyllserved
        :: And we're done here
        GOTO websiterepeat
        :: Route 2, for serving without a baseurl
        :servewithoutbaseurl
        :: Open the web browser
        :: (This is before jekyll s, because jekyll s pauses the script.)
        START "" "http://127.0.0.1:4000/"
        :: Run Jekyll, with MathJax enabled if necessary
        IF "%webmathjax%"=="" GOTO webnomathjax
        CALL bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,_configs/_config.mathjax-enabled.yml,%config%" --baseurl=""
        GOTO webjekyllserved
        :webnomathjax
        CALL bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,%config%" --baseurl=""
        :webjekyllserved
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
    SET /p bookfolder=Which book folder are we processing? (Hit enter for default 'book' folder.) 
    IF "%bookfolder%"=="" SET bookfolder=book
    ECHO.
    ECHO What is the first file in your book? Usually the cover.
    ECHO Just hit return for the default "0-0-cover"
    ECHO.
    SET /p firstfile=
    IF "%firstfile%"=="" SET firstfile=0-0-cover
    :: Ask if we're outputting the files from a subdirectory
    ECHO If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. 
    SET /p subdirectory=
    :epub-otherconfigs
    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    ECHO.
    ECHO Any extra config files?
    ECHO Enter filenames (including any relative path), comma separated, no spaces. E.g.
    ECHO _configs/_config.myconfig.yml
    ECHO If not, just hit return.
    ECHO.
    SET /p config=
    ECHO.
    :: Ask if we're processing MathJax, so we know whether to pass the HTML through PhantomJS first
    ECHO Does this book use MathJax? If no, hit enter. If yes, hit any key then enter.
    SET /p epub-mathjax=
    :: Loop back to this point to refresh the build again
    :epubrefresh
    :: let the user know we're on it!
    ECHO Generating HTML...
    :: ...and run Jekyll to build new HTML
    :: with MathJax enabled if necessary
    IF "%epub-mathjax%"=="" GOTO epubnomathjax
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,_configs/_config.mathjax-enabled.yml,%config%"
    GOTO epubjekylldone
    :epubnomathjax
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,%config%"
    :epubjekylldone
    :: Skip PhantomJS if we're not using MathJax.
    IF "%epub-mathjax%"=="" GOTO epubafterphantom
    :: Run this through phantom for extra magic
    CALL phantomjs _site\assets\js\render-mathjax.js
    :epubafterphantom
    :: Navigate into the book's folder in _site output
    CD _site\%bookfolder%\text\"%subdirectory%"
    :: Let the user know we're now going to open Sigil
    ECHO Opening Sigil...
    :: Temporarily put Sigil in the PATH, whether x86 or not
    PATH=%PATH%;C:\Program Files\Sigil;C:\Program Files (x86)\Sigil
    :: and open the cover HTML file in it, to load metadata into Sigil
    START "" sigil.exe "%firstfile%.html"
    :: Open file explorer to make it easy to see the HTML to assemble
    %SystemRoot%\explorer.exe "%location%_site\%bookfolder%\text\%subdirectory%"
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
    :: WORD EXPORT ::
    :: :: :: :: :: ::

    :word
    :: Encouraging message
    ECHO.
    ECHO Okay, let's export to Word.
    ECHO.
    :: Remember where we are by assigning a variable to the current directory
    SET location=%~dp0
    :: Ask user which folder to process
    SET /p bookfolder=Which book folder are we processing? (Hit enter for default 'book' folder.) 
    IF "%bookfolder%"=="" SET bookfolder=book
    :: Ask user which output type to work from
    ECHO Which format are we converting from? Enter a number or hit enter for the default:
    ECHO 1. Print PDF (default)
    ECHO 2. Screen PDF
    ECHO 3. Web
    ECHO 4. Epub
    SET /p fromformat=
    :: Turn that choice into the name of an output format for our config
    IF "%fromformat%"=="" SET fromformat=print-pdf
    IF "%fromformat%"=="1" SET fromformat=print-pdf
    IF "%fromformat%"=="2" SET fromformat=screen-pdf
    IF "%fromformat%"=="3" SET fromformat=web
    IF "%fromformat%"=="4" SET fromformat=epub
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
    :wordrefresh
    :: let the user know we're on it!
    ECHO Generating HTML...
    :: ...and run Jekyll to build new HTML
    CALL bundle exec jekyll build --config="_config.yml,_configs/_config.%fromformat%.yml,_configs/_config.image-set.%fromformat%.yml,%config%"
    :: Navigate to the HTML we just generated
    CD _site\%bookfolder%\text
    :: What're we doing?
    ECHO Converting %bookfolder% HTML to Word...
    :: Loop through the list of files in file-list
    :: and convert them each from .html to .docx.
    :: We end up with the same filenames, 
    :: with .docx extensions appended.
    FOR /F "tokens=*" %%F IN (file-list) DO (
        pandoc %%F -f html -t docx -s -o %%F.docx
        )
    :: What are we doing next?
    ECHO Fixing file extensions...
    :: What are we finding and replacing?
    SET find=.html
    SET replace=
    :: Loop through all .docx files and remove the .html
    :: from those filenames pandoc created.
    FOR %%# in (.\*.docx) DO (
        Set "File=%%~nx#"
        Ren "%%#" "!File:%find%=%replace%!"
    )
    :: Whassup?
    ECHO Done, opening folder...
    :: Open file explorer to show the docx files.
    %SystemRoot%\explorer.exe "%location%_site\%bookfolder%\text"
    :: Navigate back to where we began
    CD "%location%"
    :: Let the user easily run that again
    SET repeat=
    SET /p repeat=Enter to try again, or any other key and enter to stop. 
    IF "%repeat%"=="" GOTO word
    ECHO.
    GOTO begin

    :: :: :: :: :: ::
    :: INSTALL     ::
    :: :: :: :: :: ::

    :install
    :: Encouraging message
    ECHO.
    ECHO We're going to run Bundler to update and install dependencies. 
    ECHO If Bundler is not already installed, we'll install it first.
    ECHO If you get a rubygems error about SSL certificate failure, see
    ECHO http://guides.rubygems.org/ssl-certificate-update/
    ECHO.
    ECHO This may take a few minutes.
    :: Check if Bundler is installed. If not, install it.
    :: (Thanks http://stackoverflow.com/a/4781795/1781075)
    set FOUND=
    for %%e in (%PATHEXT%) do (
      for %%X in (bundler%%e) do (
        if not defined FOUND (
          set FOUND=%%~$PATH:X
        )
      )
    )
    IF NOT "%FOUND%"=="" goto bundlerinstalled
    IF "%FOUND%"=="" echo Installing Bundler...
    gem install bundler
    :bundlerinstalled
    ECHO.
    ECHO Running Bundler...
    ECHO.
    :: Run bundle update
    CALL bundle update
    :: Run bundle install
    CALL bundle install
    :: Back to the beginning
    ECHO.
    GOTO begin
