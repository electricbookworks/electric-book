:: Don't show these commands to the user
@ECHO off
:: Remember where we are by assigning a vairable to the current directory
SET location=%~dp0
:: Set the title of the window
TITLE Preparing EPUB files...
:: Ask user which folder to process
:choosefolder
SET /p book=Which book folder are we processing? 
IF "%book%"=="" GOTO choosefolder
:: Ask the user to add any extra Jekyll config files, e.g. _config.foo.bar.yml
SET /p config=Any extra config files? (in addition to _config.epub.yml; use full filename, comma-separated, no spaces) 
:: Loop back to this point to refresh the build again
:refresh
:: let the user know we're on it!
ECHO Generating HTML...
:: ...and run Jekyll to build new HTML
CALL jekyll build --config="_config.yml,_config.epub.yml,%config%"
:: Navigate into the book's folder in _site output
CD _site\%book%
:: Let the user know we're now going to open Sigil
ECHO Opening Sigil...
:: Temporarily put Sigil in the PATH, whether x86 or not
PATH=%PATH%;C:\Program Files\Sigil;C:\Program Files (x86)\Sigil
:: and open the cover HTML file in it, to load metadata into Sigil
START "" sigil.exe "0-0-cover.html"
:: Open file explorer to make it easy to see the HTML to assemble
%SystemRoot%\explorer.exe "%location%_site\%book%\"
:: Navigate back to where we began
CD "%location%"
:: Tell the user we're done
ECHO Done! You can now assemble your EPUB in Sigil.
:: Let the user easily run that again by running jekyll b and prince again
SET repeat=
SET /p repeat=Enter to run again, or any other key and enter to stop. 
IF "%repeat%"=="" GOTO refresh
