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
4. Create an epub
5. Export to Word
6. Install or update dependencies
7. Exit

Enter a number and hit enter. "
	read process
	##################
	# PRINT PDF      #
	##################
	if [ "$process" = "1" ]
		then
		# Remember the current folder
		location=$(pwd)
		# Ask user which folder to process
		echo -n "Which book folder are we processing? (Hit enter for default 'book'.) "
		read bookfolder
		if [ "$bookfolder" = "" ]
			then
			bookfolder="book"
		fi
		echo "Okay, let's make a print-ready PDF using $bookfolder..."
		# Ask if we're outputting the files from a subdirectory (e.g. a translation)
		echo "If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. "
		read printpdfsubdirectory
		# Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
		echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
		read config
		# Ask whether we're processing MathJax, to know whether to send the HTML via PhantomJS
		echo "Does this book use MathJax? If no, hit enter. If yes, type any key then enter."
		read printpdfmathjax
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			# with MathJax enabled if necessary
			if [ "$printpdfmathjax" = "" ]
				then
				bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi
			# If using, MathJax, let PhantomJS render the HTML
			if [ "$printpdfmathjax" = "" ]
				then
				echo "No MathJax, skipping PhantomJS."
			else
				echo "Rendering MathJax in HTML with PhantomJS. If you get an error, check that PhantomJS is installed."
				# We have to go to the folder for Phantom to work
				cd _site/assets/js
				phantomjs render-mathjax.js
				cd "$location"
			fi
			# Navigate into the book's folder in _site output
			cd _site/$bookfolder/text/$printpdfsubdirectory
			# Let the user know we're now going to make the PDF
			echo Creating PDF...
			# Set the PDF's filename
			if [ "$printpdfsubdirectory"="" ]
				then
				printpdffilename="$bookfolder"
			else
				printpdffilename="$bookfolder-$printpdfsubdirectory.pdf"
			fi
			# Run prince, showing progress (-v), printing the docs in file-list
			# and saving the resulting PDF to the _output folder
			prince -v -l file-list -o ../../../_output/$printpdffilename.pdf --javascript
			# Navigate back to where we began.
			cd "$location"
			# Tell the user we're done
			echo Done! Opening PDF...
			# Navigate to the _output folder...
			cd _output
			# and open the PDF we just created
			# (for Linux, this is xdg-open, not open)
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
		# Remember the current folder
		location=$(pwd)
		# Ask user which folder to process
		echo -n "Which book folder are we processing? (Hit enter for default 'book'.) "
		read bookfolder
		if [ "$bookfolder" = "" ]
			then
			bookfolder="book"
		fi
		echo "Okay, let's make a screen PDF using $bookfolder..."
		# Ask if we're outputting the files from a subdirectory (e.g. a translation)
		echo "If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. "
		read screenpdfsubdirectory
		# Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
		echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
		read config
		# Ask whether we're processing MathJax, to know whether to send the HTML via PhantomJS
		echo "Does this book use MathJax? If no, hit enter. If yes, type any key then enter."
		read screenpdfmathjax
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			# with MathJax enabled if necessary
			if [ "$screenpdfmathjax" = "" ]
				then
				bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi
			# If using, MathJax, let PhantomJS render the HTML
			if [ "$screenpdfmathjax" = "" ]
				then
				echo "No MathJax, skipping PhantomJS."
			else
				echo "Rendering MathJax in HTML with PhantomJS. If you get an error, check that PhantomJS is installed."
				# We have to go to the folder for Phantom to work
				cd _site/assets/js
				phantomjs render-mathjax.js
				cd "$location"
			fi
			# Navigate into the book's folder in _site output
			cd _site/$bookfolder/text/$screenpdfsubdirectory
			# Let the user know we're now going to make the PDF
			echo Creating PDF...
			# Set the PDF's filename
			if [ "$screenpdfsubdirectory"="" ]
				then
				screenpdffilename="$bookfolder"
			else
				screenpdffilename="$bookfolder-$screenpdfsubdirectory.pdf"
			fi
			# Run prince, showing progress (-v), printing the docs in file-list
			# and saving the resulting PDF to the _output folder
			prince -v -l file-list -o ../../../_output/$screenpdffilename.pdf --javascript
			# Navigate back to where we began.
			cd "$location"
			# Tell the user we're done
			echo Done! Opening PDF...
			# Navigate to the _output folder...
			cd _output
			# and open the PDF we just created
			# (for Linux, this is xdg-open, not open)
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
		# Open the web browser, without or, then, with the baseurl
		# (This is before jekyll s, because jekyll s pauses the script.)
		if [ "$baseurl" = "" ]
		then
			open "http://127.0.0.1:4000/"
		else
			open "http://127.0.0.1:4000/$baseurl/"
		fi
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# ...and run Jekyll
			if [ "$baseurl" = "" ]
				then
				bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,$config" --baseurl=""
			else
				bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,$config" --baseurl="/$baseurl"
			fi
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
		# Remember the current folder
		location=$(pwd)
		# Ask user which folder to process
		echo -n "Which book folder are we processing? (Hit enter for default 'book'.) "
		read bookfolder
		if [ "$bookfolder" = "" ]
			then
			bookfolder="book"
		fi
		echo "Okay, let's make epub-ready files using $bookfolder..."
		# Ask if we're outputting the files from a subdirectory (e.g. a translation)
		echo "If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. "
		read epubsubdirectory
		# Ask the user to add any extra Jekyll config files, e.g. _config.myconfig.yml
		echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
		read config
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,$config"
			# Now to aessmble the epub
			echo "Assembling epub..."
			# Copy text, images, fonts, styles and package.opf to epub
			cd _site/"$bookfolder"
			ls
			mkdir ../epub/$bookfolder
			if [ "$epubsubdirectory" = "" ]; then
				mkdir ../epub/$bookfolder/text && cp -a text/. ../epub/$bookfolder/text/
			else
				mkdir ../epub/$bookfolder/text && cp -a text/$epubsubdirectory/. ../epub/$bookfolder/text/
			fi
			if [ -d images ]; then
				mkdir ../epub/$bookfolder/images && cp -a images/. ../epub/$bookfolder/images/
			fi
			if [ -d fonts ]; then
				mkdir ../epub/$bookfolder/fonts && cp -a fonts/. ../epub/$bookfolder/fonts/
			fi
			if [ -d styles ]; then
				mkdir ../epub/$bookfolder/styles && cp -a styles/. ../epub/$bookfolder/styles/
			fi
			if [ -e package.opf ]; then
				cp package.opf ../epub/package.opf
			fi
			# Now to compress the epub files
			echo "Compressing epub..."
		    # First, though, if they exist, remove previous .zip and .epub files that we will replace.
			if [ -e "$location/_output/$bookfolder.zip" ]; then
				rm "$location/_output/$bookfolder.zip"
			fi
			if [ -e "$location/_output/$bookfolder.epub" ]; then
				rm "$location/_output/$bookfolder.epub"
			fi
			# Go into _site/epub to zip it to _output
			cd ../epub
			# Add the mimetype first, with no compression and no extra fields (-X)
			zip --compression-method store -0 -X --quiet "$location/_output/$bookfolder.zip" mimetype
			if [ -d "$bookfolder"/images ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "$bookfolder/images"
			fi
			if [ -d "$bookfolder"/fonts ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "$bookfolder/fonts"
			fi
			if [ -d "$bookfolder"/styles ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "$bookfolder/styles"
			fi
			if [ -d "$bookfolder"/text ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "$bookfolder/text"
			fi
			if [ -d META-INF ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" META-INF
			fi
			if [ -e package.opf ]; then
				zip --quiet "$location/_output/$bookfolder.zip" package.opf
			fi
	    	# Change file extension .zip to .epub
    		cd $location/_output
    		if [ -e "$bookfolder".zip ]; then
				mv "$bookfolder".zip "$bookfolder".epub
			fi
			# Validation
			echo "To run validation now, enter the path to the EpubCheck folder on your machine. E.g. /usr/bin/local/epubcheck-4.0.1"
			echo "Or hit enter to skip EpubCheck validation."
			echo "(You can get EpubCheck from https://github.com/IDPF/epubcheck/releases)"
			read pathtoepubcheck
			if ! [ "$pathtoepubcheck" = "" ]; then
				java -jar "$pathtoepubcheck"/epubcheck.jar "$bookfolder".epub
			fi
			# Open file browser to see epub-ready HTML files
			# (for Linux, this is xdg-open, not open)
			open .
			# Navigate back to where we started
			cd "$location"
			# Ask the user if they want to refresh the PDF by running Jekyll and Prince again
			repeat=""
			echo "Enter to run again, or any other key and enter to stop."
			read repeat
		done
		# Head back to the Electric Book options
		process=0
	##################
	# EXPORT TO WORD #
	##################
	elif [ "$process" = 5 ]
		then
		echo "Okay, let's export to Word. You must have Pandoc installed for this to work."
		# Remember current location
		location=$(pwd)
		# Ask user which folder to process
		echo -n "Which book folder are we processing? (Hit enter for default 'book'.) "
		read bookfolder
		if [ "$bookfolder" = "" ]
			then
			bookfolder="book"
		fi
		echo "Okay, let's make Word files for $bookfolder..."
		# Ask user which output format to work from
		echo "Which format are we converting from? Enter a number or hit enter for the default 'print-pdf'. "
		echo -n "
1. Print PDF (default)
2. Screen PDF
3. Web
4. Epub

Enter a number and/or hit enter. "
		read fromformat
		# Turn that choice into a variable named for the format
		wordformatchoice=""
		while [ "$wordformatchoice" = "" ]
		do
			if [ "$fromformat" = "" ]
				then
				fromformat="print-pdf"
				wordformatchoice="1"
			elif [ "$fromformat" = "1" ]
				then
				fromformat="print-pdf"
				wordformatchoice="1"
			elif [ "$fromformat" = "2" ]
				then
				fromformat="screen-pdf"
				wordformatchoice="1"
			elif [ "$fromformat" = "3" ]
				then
				fromformat="web"
				wordformatchoice="1"
			elif [ "$fromformat" = "4" ]
				then
				fromformat="epub"
				wordformatchoice="1"
			else				
				wordformatchoice=""
			fi
		done
		# Ask the user to add any extra Jekyll config files, e.g. _config.myconfig.yml
		echo -n "
Any extra config files?
Enter filenames (including any relative path), comma separated, no spaces. E.g.
_configs/_config.myconfig.yml
If not, just hit return."
		read config
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			bundle exec jekyll build --config="_config.yml,_configs/_config.$fromformat.yml,$config"
			# Navigate into the book's folder in _site output
			cd _site/$bookfolder/text
			# Update user
			echo "Converting $bookfolder HTML to Word..."
			# Loop through the list of files in file-list
			# and convert them each from .html to .docx.
			# We end up with the same filenames,
			# with .docx extensions appended.
# [Two loop methods to try here. This one:]
			while read -r file
			do
				pandoc "$file" -f html -t docx -s -o $file.docx
			done < file-list
# [And this one:]
#			for file in file-list
#			do
#				pandoc "$file" -f html -t docx -s -o $file.docx
#			done
			# Now we fix those file extensions
			echo "Fixing file extensions..."
			for file in *.html.docx
			do
				mv "${file}" "${file/.html.docx/.docx}"
			done
			# Tell the user we're done
			echo Done! Opening file explorer...
			# Open file explorer to show the docx files
			# (for Linux, this is xdg-open, not open)
			open .
			# Navigate back to where we began.
			cd "$location"
			# Ask the user if they want to run that again
			repeat=""
			echo "Enter to run again, or any other key and enter to stop."
			read repeat
		done
		# Head back to the Electric Book options
		process=0
	##################
	# INSTALL        #
	##################
	elif [ "$process" = 6 ]
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
