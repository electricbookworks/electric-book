:: Don't show these commands to the user
@ECHO off
:: Keep variables local, and expand at execution time not parse time
SETLOCAL enabledelayedexpansion
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
set epubIncludeMathJax=

:: Ask what we're going to be doing.
ECHO Electric Book options
ECHO ---------------------
ECHO.
ECHO 1. Create a print PDF
ECHO 2. Create a screen PDF
ECHO 3. Run as a website
ECHO 4. Create an epub
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
    :printpdfchoosefolder
    SET /p bookfolder=Which book folder are we processing? (Hit enter for default 'book' folder.) 
    IF "%bookfolder%"=="" SET bookfolder=book
    if not exist "%bookfolder%\*.*" echo Sorry, %bookfolder% doesn't exist. Try again. && goto printpdfchoosefolder
    echo.
    :: Ask if we're outputting the files from a subdirectory
    :printpdfwhatsubdirectory
    SET /p subdirectory=If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. 
    if not exist "%bookfolder%\%subdirectory%\*.*" echo Sorry, Sorry, %bookfolder%\%subdirectory% doesn't exist. Try again. doesn't exist. && goto printpdfwhatsubdirectory
    echo.
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
    :screenpdfchoosefolder
    SET /p bookfolder=Which book folder are we processing? (Hit enter for default 'book' folder.) 
    IF "%bookfolder%"=="" SET bookfolder=book
    if not exist "%bookfolder%\*.*" echo Sorry, %bookfolder% doesn't exist. Try again. && goto screenpdfchoosefolder
    echo.
    :: Ask if we're outputting the files from a subdirectory
    :screenpdfwhatsubdirectory
    SET /p subdirectory=If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. 
    if not exist "%bookfolder%\%subdirectory%\*.*" echo Sorry, Sorry, %bookfolder%\%subdirectory% doesn't exist. Try again. doesn't exist. && goto screenpdfwhatsubdirectory
    echo.
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
    echo Okay, let's make an epub.
    :: Remember where we are by assigning a variable to the current directory
    set location=%~dp0
    
    :: Ask user which folder to process
    :epubchoosefolder
    set /p bookfolder=Which book folder are we processing? (Hit enter for default 'book' folder.) 
    if "%bookfolder%"=="" SET bookfolder=book
    if not exist "%bookfolder%\*.*" echo Sorry, %bookfolder% doesn't exist. Try again. && goto epubchoosefolder
    
    :: Ask if we're outputting the files from a subdirectory
    :epubwhatsubdirectory
    echo If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. 
    set /p subdirectory=
    if not exist "%bookfolder%\%subdirectory%\*.*" echo Sorry, %bookfolder%\%subdirectory% doesn't exist. Try again. doesn't exist. && goto epubwhatsubdirectory
    
    :: Ask whether to include boilerplate mathjax directory
    :epubAskToIncludeMathJax
    echo Include mathjax? Enter y for yes (or hit enter for no).
    set /p epubIncludeMathJax=
    if "%epubIncludeMathJax%"=="n" set epubIncludeMathJax=
    if not "%epubIncludeMathJax%"=="y" if not "%epubIncludeMathJax%"=="" goto epubAskToIncludeMathJax

    :: Ask the user to add any extra Jekyll config files, e.g. _config.images.print-pdf.yml
    :epubAskForConfigFiles
    echo Any extra config files?
    echo Enter filenames (including any relative path), comma separated, no spaces. E.g.
    echo _configs/_config.myconfig.yml
    echo If not, just hit return.
    set /p config=

    :: Ask about validation
    :epubAskAboutValidation
    echo Shall we try to run EpubCheck when we're done? Hit enter for yes, or any key and enter for no.
    set /p epubValidation=

    :: Loop back to this point to refresh the build again
    :epubrefresh

    :: let the user know we're on it!
    if "%subdirectory%"=="" goto epubGeneratingHTMLNoSubdirectory
    if not "%subdirectory%"=="" goto epubGeneratingHTMLWithSubdirectory

    :epubGeneratingHTMLNoSubdirectory
    echo Generating HTML for %bookfolder%.epub...
    goto epubJekyllBuild

    :epubGeneratingHTMLWithSubdirectory
    echo Generating HTML for %bookfolder%-%subdirectory%.epub...
    goto epubJekyllBuild

    :: ...and run Jekyll to build new HTML
    :epubJekyllBuild
    call bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,%config%"
    echo HTML generated.
    :epubJekyllDone

    :: What's next?
    echo Assembling epub...


    :: Copy styles, images, text and package.opf to epub folder.
    :: The echo f preemptively answers xcopy's question whether 
    :: this is a file (see https://stackoverflow.com/a/3018371).
    :: The > nul supresses command-line feedback (pseudo silent mode)
    cd _site\%bookfolder%


    :: Test copying options
    :epubCopyStyles
    echo Copying styles...
    :: --------------------------
    :: If original language output: copy only files in fonts/epub
    if "%subdirectory%"=="" if not exist %subdirectory%\styles\*.* goto epubOriginalStyles
    :: Translation output, but no translated-styles subdirectory for that translation:
    :: copy the original styles files only
    if not "%subdirectory%"=="" if not exist %subdirectory%\styles\*.* goto epubOriginalStyles
    :: Translation output, and an styles subdir for that translation exists:
    :: create folder structure, and copy only the styles in that translation folder
    if not "%subdirectory%"=="" if exist %subdirectory%\styles\*.* goto epubTranslationStyles

    :: Copy original styles
    :epubOriginalStyles
    xcopy /i /q "styles\*.css" "..\epub\styles" > nul
    :: Done! Move along to moving the text folder
    echo Styles copied.
    goto epubCopyImages
    
    :: Copy translated styles, after deleting original styles
    :epubTranslationStyles
    rd /s /q styles
    mkdir "..\epub\%subdirectory%\styles"
    if exist "%subdirectory%\styles\*.css" xcopy /i /q "%subdirectory%\styles\*.css" "..\epub\%subdirectory%\styles" > nul
    :: Done! Move along to moving the text folder
    echo Styles copied.
    goto epubCopyImages


    :: Test copying options
    :epubCopyImages
    echo Copying images...
    :: --------------------------
    :: If original language output: copy only files in images/epub
    if "%subdirectory%"=="" if not exist %subdirectory%\images\*.* goto epubOriginalImages
    :: Translation output, but no translated-images subdirectory for that translation:
    :: copy the original images files only
    if not "%subdirectory%"=="" if not exist %subdirectory%\images\*.* goto epubOriginalImages
    :: Translation output, and an images subdir for that translation exists:
    :: create folder structure, and copy only the images in that translation folder
    if not "%subdirectory%"=="" if exist %subdirectory%\images\*.* goto epubTranslationImages

    :: Copy original images
    :epubOriginalImages
    xcopy /i /q "images\epub\*.*" "..\epub\images\epub" > nul
    :: Done! Move along to moving the text folder
    echo Images copied.
    goto epubCopyText
    
    :: Copy translated images, after deleting original images
    :epubTranslationImages
    rd /s /q images
    mkdir "..\epub\%subdirectory%\images\epub"
    xcopy /i /q "%subdirectory%\images\epub\*.*" "..\epub\%subdirectory%\images\epub" > nul
    :: Done! Move along to moving the text folder
    echo Images copied.
    goto epubCopyText


    :: Copy contents of text or text/subdirectory to epub/text.
    :: We don't want all the files in text, we only want the ones
    :: in the epub file list.
    :epubCopyText
    echo Copying text...

    :: If this isn't a translation, skip ahead to epubCopyNoSubdirectory 
    if "%subdirectory%"=="" GOTO epubOriginalText

    :: Copy the contents of the subdirectory
    :epubSubdirectoryText
    rd /s /q "text"
    mkdir "..\epub\%subdirectory%\text"
    cd %subdirectory%\text
    for /F "tokens=* skip=1" %%i in (file-list) do xcopy /q %%i "..\..\..\epub\%subdirectory%\text\" > nul
    cd ..
    cd ..
    echo Text copied.
    goto epubCopyOPF

    :: Copy the contents of the original text folder
    :epubOriginalText
    cd text
    for /F "tokens=* skip=1" %%i in (file-list) do xcopy /q %%i "..\..\epub\text\" > nul
    cd ..
    echo Text copied.
    goto epubCopyOPF


    :: Get the right package.opf for the translation we're creating
    :epubCopyOPF
    echo Copying package file...
    if "%subdirectory%"=="" goto epubOriginalOPF
    if not "%subdirectory%"=="" goto epubSubdirectoryOPF

    :: If original language, use the package.opf in the root
    :epubOriginalOPF
    echo f | xcopy /e /q "package.opf" "../epub" > nul
    echo Package file copied.
    goto epubOPFDone

    :: If translation language, use the package.opf in the subdirectory
    :: This will overwrite the original language OPF file
    :epubSubdirectoryOPF
    echo f | xcopy /e /q "%subdirectory%\package.opf" "../epub" > nul
    echo Package file copied.
    goto epubOPFDone

    :epubOPFDone


    :: Go into _site/epub to move some more files and then zip to _output
    CD %location%_site/epub

    :: If there is a js folder, and it has no contents, delete it.
    :: Otherwise, if this is a translation, move the js folder
    :: into the subdirectory alongside text, images, styles.
    :epubMoveJS
    echo Checking for Javascript...
    if exist "js" if not exist "js\*.*" rd /s /q "js"
    if not "%subdirectory%"=="" if exist "js\*.*" move "js" "%subdirectory%\js"
    echo Javascript checked.

    :: If there is a fonts folder, and it has no contents, delete it.
    :: Otherwise, if this is a translation, move the fonts folder
    :: into the subdirectory alongside text, images, styles.
    :epubMoveFonts
    echo Checking for fonts...
    if exist "fonts" if not exist "fonts\*.ttf" if not exist "fonts\*.otf" if not exist "fonts\*.woff" if not exist "fonts\*.woff2" rd /s /q "fonts"
    if not "%subdirectory%"=="" if exist "fonts\*.*" move "fonts" "%subdirectory%\fonts"
    echo Fonts checked.

    :: If no MathJax required, remove boilerplate mathjax directory
    echo Checking for MathJax to move or remove...
    if "%epubIncludeMathJax%"=="y" goto epubKeepMathjax
    rd /s /q "mathjax"
    echo Unnecessary MathJax removed.
    goto epubSetFilename

    :epubKeepMathjax
    :: If this is a translation, move mathjax into the language folder
    if "%epubIncludeMathJax%"=="y" if not "%subdirectory%"=="" move "mathjax" "%subdirectory%\mathjax"
    echo MathJax moved.

    :: Set the filename of the epub, sans extension
    :epubSetFilename
    if "%subdirectory%"=="" set epubFileName=%bookfolder%
    if not "%subdirectory%"=="" set epubFileName=%bookfolder%-%subdirectory%

    :: If they exist, remove previous .zip and .epub files that we will replace.
    echo Removing any previous %epubFileName%.zip and %epubFileName%.epub files...
    if exist "%location%\_output\%epubFileName%.zip" del /q "%location%\_output\%epubFileName%.zip"
    if exist "%location%\_output\%epubFileName%.epub" del /q "%location%\_output\%epubFileName%.epub"
    echo Removed any previous zip and epub files.

    :: Now to zip the epub files. Important: mimetype first.
    :epubCompressing
    echo Compressing files...
    :: Uses Zip 3.0: http://www.info-zip.org/Zip.html
    :: Temporarily put Zip in the PATH
    PATH=%PATH%;%location%_utils\zip
    :: mimetype: create zip, no compression, no extra fields
    zip --compression-method store -0 -X --quiet "%location%_output/%epubFileName%.zip" mimetype
    :: everything else: append to the zip with default compression

    :: Zip root folders, if this is not a translation
    if not "%subdirectory%"=="" goto epubZipSubdirectory
    if exist "images\epub" zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" "images\epub"
    if exist "fonts" zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" "fonts"
    if exist "styles" zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" "styles"
    if exist "text" zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" "text"
    if exist "mathjax" zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" "mathjax"
    if exist "js" zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" "js"

    :: And if it is a translation, just move the language subdirectory
    :epubZipSubdirectory
    if not "%subdirectory%"=="" if exist "%subdirectory%" zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" "%subdirectory%"

    :: Now add these admin files to the zip
    if exist META-INF zip --recurse-paths --quiet "%location%_output/%epubFileName%.zip" META-INF
    if exist package.opf zip --quiet "%location%_output/%epubFileName%.zip" package.opf

    :: Change file extension .zip to .epub
    cd %location%_output
    if exist %epubFileName%.zip ren %epubFileName%.zip %epubFileName%.epub

    :: We're done!
    :epubCreated
    if exist %epubFileName%.epub echo Epub created^^!
    if not exist %epubFileName%.epub echo Sorry, something went wrong.


    :: Check if epubcheck is in the PATH, and run it if it is
    if not "%epubValidation%"=="" goto skipepubValidation
    echo If EpubCheck is in your PATH, we'll run validation now.

    :: Use a batch-file trick to get the location of epubcheck
    :: https://blogs.msdn.microsoft.com/oldnewthing/20120731-00/?p=7003/
    for /f %%i in ('where epubcheck.jar') do set epubchecklocation=%%i
    if "%epubchecklocation%"=="" echo Couldn't find EpubCheck, sorry.
    if "%epubchecklocation%"=="" goto skipEpubValidation

    :: then run it, saving the error stream to a log file
    :: First, create a timestamp
    for /f "tokens=2-8 delims=.:/ " %%a in ("%date% %time%") do set timestamp=%%c-%%a-%%bT%%d-%%e-%%f-%%g
    set epubCheckLogFile=epubcheck-log-%timestamp%
    echo Found EpubCheck, running validation...
    call java -jar %epubchecklocation% %epubFileName%.epub 2>> %epubCheckLogFile%.txt
    echo Opening EpubCheck log...
    start %epubCheckLogFile%.txt

    :: Skip to here if epubcheck wasn't found in the PATH
    :: or the user didn't want validation
    :skipEpubValidation

    :: Open file explorer to show the epub
    echo Opening folder containing your epub...
    %SystemRoot%\explorer.exe "%location%_output"

    :: Navigate back to where we began
    CD "%location%"

    :: Let the user easily run that again
    SET repeat=
    SET /p repeat=Enter to run again, or any other key and enter to stop. 
    IF "%repeat%"=="" GOTO epubrefresh
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
