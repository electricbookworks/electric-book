#!/bin/bash
# That tells Linux to use a Bourne shell interpreter.
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

1  Create a print PDF
2  Create a screen PDF
3  Run as a website
4  Create an epub
5  Create an app
6  Export to Word
7  Convert source images to output formats
8  Install or update dependencies
x  Exit

Enter a number and hit enter. "
	read process
	#############
	# PRINT PDF #
	#############
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
		echo "Any extra config files?"
		echo "Enter filenames (including any relative path), comma separated, no spaces. E.g."
		echo "_configs/_config.myconfig.yml"
		echo "If not, just hit return."
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
			# (for OSX, this is open, not xdg-open)
			xdg-open $bookfolder.pdf
			# Navigate back to where we began.
			cd ../
			# Ask the user if they want to refresh the PDF by running Jekyll and Prince again
			repeat=""
			echo "Enter to run again, or any other key and enter to stop."
			read repeat
		done
		# Head back to the Electric Book options
		process=0
	##############
	# SCREEN PDF #
	##############
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
		echo "Any extra config files?"
		echo "Enter filenames (including any relative path), comma separated, no spaces. E.g."
		echo "_configs/_config.myconfig.yml"
		echo "If not, just hit return."
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
			# (for OSX, this is open, not xdg-open)
			xdg-open $bookfolder.pdf
			# Navigate back to where we began.
			cd ../
			# Ask the user if they want to refresh the PDF by running Jekyll and Prince again
			repeat=""
			echo "Enter to run again, or any other key and enter to stop."
			read repeat
		done
		# Head back to the Electric Book options
		process=0
	###########
	# WEBSITE #
	###########
	elif [ "$process" = 3 ]
		then
		echo "Okay, let's make a website..."
		# Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
		echo "Any extra config files?"
		echo "Enter filenames (including any relative path), comma separated, no spaces. E.g."
		echo "_configs/_config.myconfig.yml"
		echo "If not, just hit return."
		read config
		# Ask the user to set a baseurl if needed
		echo "Do you need a baseurl?"
		echo "If yes, enter it with no slashes at the start or end, e.g."
		echo "my/base"
		read baseurl
		# let the user know we're on it!
		echo "Getting your site ready...
You may need to reload the web page once this server is running."
		# Open the web browser, without or, then, with the baseurl
		# (This is before jekyll s, because jekyll s pauses the script.)
		if [ "$baseurl" = "" ]
		then
			xdg-open "http://127.0.0.1:4000/"
		else
			xdg-open "http://127.0.0.1:4000/$baseurl/"
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
	########
	# EPUB #
	########
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
		# Ask whether to keep the boilerplate epub mathjax directory
		echo "Include mathjax? Enter y for yes (or enter for no)."
		read epubmathjax
		# Ask the user to add any extra Jekyll config files, e.g. _config.myconfig.yml
		echo "Any extra config files?"
		echo "Enter filenames (including any relative path), comma separated, no spaces. E.g."
		echo "_configs/_config.myconfig.yml"
		echo "If not, just hit return."
		read config
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			if [ $epubmathjax = "y" ]; then
				bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,_configs/_config.mathjax-enabled.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,$config"
			fi
			# Now to assemble the epub
			echo "Assembling epub..."
			# Check if there are fonts to include
			echo "Checking for fonts to include..."
			epubfonts=""
			countttf=`ls -1 fonts/*.ttf 2>/dev/null | wc -l`
			if [ $countttf != 0 ]; then 
				epubfonts="y"
			fi
			countotf=`ls -1 fonts/*.otf 2>/dev/null | wc -l`
			if [ $countotf != 0 ]; then 
				epubfonts="y"
			fi
			countwoff=`ls -1 fonts/*.woff 2>/dev/null | wc -l`
			if [ $countwoff != 0 ]; then 
				epubfonts="y"
			fi
			countwoff2=`ls -1 fonts/*.woff2 2>/dev/null | wc -l`
			if [ $countwoff2 != 0 ]; then 
				epubfonts="y"
			fi
			# Check if there are scripts to include
			echo "Checking for scripts to include..."
			epubscripts=""
			countjs=`ls -1 js/*.js 2>/dev/null | wc -l`
			if [ $countjs != 0 ]; then 
				epubscripts="y"
			fi
			# Copy text (files in file-list only), images, fonts, styles and package.opf to epub
			cd _site/"$bookfolder"
			if [ "$epubsubdirectory" = "" ]; then
				mkdir ../epub/text && cd text && cp `cat file-list` ../../epub/text/
				cd ..
			else
				mkdir ../epub/text && cd $epubsubdirectory/text && cp `cat file-list` ../../../epub/text/
				cd .. && cd ..
			fi
			if [ -d images ]; then
				mkdir ../epub/images && cp -a images/. ../epub/images/
			fi
			if [ "$epubfonts" = "y" ]; then
				mkdir ../epub/fonts && cp -a fonts/. ../epub/fonts/
			fi
			if [ -d styles ]; then
				mkdir ../epub/styles && cp -a styles/. ../epub/styles/
			fi
			if [ "$epubmathjax" = "y" ]; then
				mkdir ../epub/mathjax && cp -a ../assets/js/mathjax/. ../epub/mathjax/
			fi
			if [ "$epubscripts" = "y" ]; then
				mkdir ../epub/js && cp -a js/. ../epub/js/
			fi
			if [ -e package.opf ]; then
				cp package.opf ../epub/package.opf
			fi
			# First, though, if they exist, remove previous .zip and .epub files that we will replace.
			echo "Removing previous zips or epubs..."
			if [ -e "$location/_output/$bookfolder.zip" ]; then
				rm "$location/_output/$bookfolder.zip"
			fi
			if [ -e "$location/_output/$bookfolder.epub" ]; then
				rm "$location/_output/$bookfolder.epub"
			fi
			# Go into _site/epub to zip it to _output
			cd ../epub
			# First, though, remove the fonts folder if we dont' want it
			if [ "$epubfonts" = "" ]; then
				rm -r fonts
			fi
			# And remove the mathjax dir if we don't need it
			if [ "$epubmathjax" = "" ]; then
				rm -r mathjax
			fi
			# Now to compress the epub files
			echo "Compressing epub..."
			# Add the mimetype first, with no compression and no extra fields (-X)
			zip --compression-method store -0 -X --quiet "$location/_output/$bookfolder.zip" mimetype
			if [ -d images ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "images"
			fi
			if [ -d fonts ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "fonts"
			fi
			if [ -d styles ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "styles"
			fi
			if [ -d text ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "text"
			fi
			if [ -d mathjax ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "mathjax"
			fi
			if [ -d js ]; then
				zip --recurse-paths --quiet "$location/_output/$bookfolder.zip" "js"
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
			echo "Epub created!"
			# Validation
			echo "To run validation now, enter the path to the EpubCheck folder on your machine. E.g. /usr/bin/local/epubcheck-4.0.1"
			echo "Or hit enter to skip EpubCheck validation."
			echo "(You can get EpubCheck from https://github.com/IDPF/epubcheck/releases)"
			read pathtoepubcheck
			if [ "$pathtoepubcheck" = "" ]; then
				echo "Okay, skipping EpubCheck. Try http://validator.idpf.org to validate separately."
			else
				java -jar "$pathtoepubcheck"/epubcheck.jar "$bookfolder".epub
			fi
			# Open file browser to see epub
			# (for OSX, this is open, not xdg-open)
			xdg-open .
			# Navigate back to where we started
			cd "$location"
			# Ask the user if they want to refresh the PDF by running Jekyll and Prince again
			repeat=""
			echo "Enter to run again, or any other key and enter to stop."
			read repeat
		done
		# Head back to the Electric Book options
		process=0
	###############
	# CREATE APPS #
	###############
	elif [ "$process" = 5 ]
		then
		# Remember the current folder
		location=$(pwd)
		# Encouraging message
		# (Building iOS not available on Linux, only newish Macs)
		echo "Okay, let's make apps. First we'll generate the HTML, then we'll build Android and iOS apps."
		echo "For the build, you need to have installed:"
		echo "- Cordova"
		echo "- Android Studio for the Android app"
		echo "- XCode for the iOS app."
		echo "Shall we build the apps, or just generate the HTML? Enter:"
		echo "'a' to build only the Android app,"
		echo "'i' to build only the iOs app,"
		echo "'ai' to build both Android and iOS apps, or"
		echo "'n' or just hit enter to skip building finished apps. "
		appbuildgenerateapp=""
		read appbuildgenerateapp
		# Are we building a release?
		echo "Are you creating an app for release, or just for testing?"
		echo "Enter y for a release, otherwise just hit enter."
		apprelease=
		read apprelease
		# Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
		echo "Any extra config files?"
		echo "Enter filenames (including any relative path), comma separated, no spaces. E.g."
		echo "_configs/_config.myconfig.yml"
		echo "If not, just hit return."
		read appconfig
		# Ask whether we're enabling and including MathJax
		echo "Do these books use MathJax? If yes, enter y. If no, hit enter."
		read appmathjax
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			# with MathJax enabled if necessary
			if [ "$appmathjax" = "" ]
				then
				bundle exec jekyll build --config="_config.yml,_configs/_config.app.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.app.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi
			# Put HTML into _site/app/www by moving everything in _site
			# excluding the _site/app folder itself, into _site/app/www.
			# (rsync lets us exclude, where cp does not)
			# Suppress the console output.
			echo "Copying files to app directory..."
			mkdir _site/app/www
			rsync -r _site/. _site/app/www --exclude="/app"
			# Build the apps if required
			if [ "$appbuildgenerateapp" = "a" ]
				then
				echo "Building Android app..."
				cd _site/app
				if [ "$apprelease" = "y" ]
					then
						cordova build android --release
					else
						cordova build android
				fi
				cd .. && cd ..
				echo "Done. Opening folder containing Android app..."
				# (On OSX, this will be open, not xdg-open.)
				xdg-open _site/app/platforms/android/build/outputs/apk/
			# Building iOS not available on Linux, only newish Macs
			elif [ "$appbuildgenerateapp" = "i" ]
				then
				echo "Building iOS app..."
				cd _site/app
				if [ "$apprelease" = "y" ]
					then
						cordova build ios --release
					else
						cordova build ios
				fi
				cd .. && cd ..
				echo "Done. Opening folder containing iOS app..."
				# (On OSX, this will be open, not xdg-open.)
				xdg-open _site/app/platforms/ios/build/emulator/
			elif [ "$appbuildgenerateapp" = "ai" ]
				then
				echo "Building Android app first, then iOS app."
				echo "Building Android app..."
				if [ "$apprelease" = "y" ]
					then
						cordova build android --release
					else
						cordova build android
				fi
				echo "Done. Opening folder containing Android app..."
				# (On OSX, this will be open, not xdg-open.)
				xdg-open _site/app/platforms/android/build/outputs/apk/
				echo "Building iOS app..."
				if [ "$apprelease" = "y" ]
					then
						cordova build ios --release
					else
						cordova build ios
				fi
				echo "Done. Opening folder containing iOS app..."
				# (On OSX, this will be open, not xdg-open.)
				xdg-open _site/app/platforms/ios/build/emulator/
			elif [ "$appbuildgenerateapp" = "" ] || [ "$appbuildgenerateapp" = "n" ]
				then
				echo "Skipping building apps. Opening app-ready files..."
				# (On OSX, this will be open, not xdg-open.)
				xdg-open _site
			fi
			# Ask the user if they want to rebuild
			repeat=""
			echo "Enter to run again, or any other key and enter to stop."
			read repeat
		done
		# Head back to the Electric Book options
		process=0
	##################
	# EXPORT TO WORD #
	##################
	elif [ "$process" = 6 ]
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
		echo "1. Print PDF (default)"
		echo "2. Screen PDF"
		echo "3. Web"
		echo "4. Epub"
		echo "Enter a number and/or hit enter. "
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
		echo "Any extra config files?"
		echo "Enter filenames (including any relative path), comma separated, no spaces. E.g."
		echo "_configs/_config.myconfig.yml"
		echo "If not, just hit return."
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
			# Before looping through file-list, remove blank lines.
			# Why .bak? see https://stackoverflow.com/a/14570580/1781075
			sed -i.bak '/^[[:space:]]*$/d' file-list
			rm file-list.bak
			# Loop through the list of files in file-list
			# and convert them each from .html to .docx.
			while read -r file
			do
				pandoc "$file" -f html -t docx -s -o $file.docx
			done < file-list
			# We end up with the same filenames,
			# with .docx extensions appended.
			# Now we fix those file extensions
			echo "Fixing file extensions..."
			for file in *.html.docx
			do
				mv "${file}" "${file/.html.docx/.docx}"
			done
			# Tell the user we're done
			echo "Done! Opening file explorer..."
			# Open file explorer to show the docx files
			# (for OSX, this is open, not xdg-open)
			xdg-open .
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
	# PROCESS IMAGES #
	##################
	elif [ "$process" = 7 ]
		then
	    echo "Let's convert your source images."
	    echo "This process will optimise the images in a book's _source folder"
	    echo "and copy them to the print-pdf, screen-pdf, web and epub image folders."
	    echo "You need to have run 'Install or update dependencies' at least once,"
	    echo "and have GraphicsMagick installed (http://www.graphicsmagick.org, or try"
	    echo "brew install graphicsmagick"

    	# Select which book to convert images for
    	echo "Which book's images are you converting? Hit enter for the default 'book'."
	    bookimagestoconvert=""
	    read bookimagestoconvert
	    if [ "$bookimagestoconvert" = "" ]
	    	then
	    	bookimagestoconvert="book"
	    fi
	    while [ ! -d $bookimagestoconvert ]
	    do
	    	echo "Sorry, there is no $bookimagestoconvert folder. Please try again."
	    	read bookimagestoconvert
	    done

	    # Select whether we're converting images for a translation
	    echo "Are we converting books in a translation? If not, hit enter."
    	echo "Otherwise, enter the language code/translation directory name. "
	    read convertimageslanguage

	    # Only proceed if no language is set or the language folder exists
	    while [[ ! -d "$bookimagestoconvert/$convertimageslanguage" && "$convertimageslanguage" != "" ]]
	    do
	    	echo "Sorry, there is no $bookimagestoconvert/$convertimageslanguage folder. Please try again."
	    	read convertimageslanguage
	    done

		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
		    # Run default gulp task
		    gulp --book "$bookimagestoconvert" --language "$convertimageslanguage"

			# Ask the user if they want to run that again
			repeat=""
			echo "Enter to run again, or any other key and enter to stop."
			read repeat
		done
		# Head back to the Electric Book options
		process=0

	###########
	# INSTALL #
	###########
	elif [ "$process" = 8 ]
		then
		echo "Running Bundler to update and install dependencies."
		echo "If Bundler is not already installed, exit and run"
		echo "gem install bundler"
		echo "from the command line."
		# Update gems
		bundle update
		# Install gems
		bundler install
		# Head back to the Electric Book options
		process=0
	########
	# EXIT #
	########
	fi
done
