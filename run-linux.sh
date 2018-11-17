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
8  Refresh search index
9  Install or update dependencies
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
		# Ask whether we're processing MathJax, to know whether to pre-process the HTML
		printpdfmathjax="unknown"
		until [ "$printpdfmathjax" = "" ] || [ "$printpdfmathjax" = "y" ]
		do
			echo "Does this book use MathJax? If no, hit enter. If yes, enter y."
			read printpdfmathjax
		done
		# Set the PDF's filename
		if [ "$printpdfsubdirectory" = "" ]; then
			printpdffilename="$bookfolder-print"
		else
			printpdffilename="$bookfolder-$printpdfsubdirectory-print"
		fi
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			# with MathJax enabled if necessary
			if [ "$printpdfmathjax" = "" ]; then
				bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi
			# If using, MathJax, preprocess the HTML
			if [ "$printpdfmathjax" = "" ]; then
				echo "No MathJax required."
			else
				echo "Processing MathJax in HTML."
				if [ "$printpdfsubdirectory" = "" ]; then
					gulp mathjax --book $bookfolder
				else
					gulp mathjax --book $bookfolder --language $printpdfsubdirectory
				fi
			fi
			# Navigate into the book's text folder in _site
			if [ "$printpdfsubdirectory" = "" ]; then
				cd _site/$bookfolder/text
			else
				cd _site/$bookfolder/$printpdfsubdirectory/text
			fi
			# Let the user know we're now going to make the PDF
			echo Creating PDF...
			# Run prince, showing progress (-v), printing the docs in file-list
			# and saving the resulting PDF to the _output folder
			prince -v -l file-list -o "$location"/_output/$printpdffilename.pdf --javascript
			# Navigate back to where we began.
			cd "$location"
			# Tell the user we're done
			echo Done! Opening PDF...
			# Navigate to the _output folder...
			cd _output
			# and open the PDF we just created
			# (for OSX, this is open, not xdg-open)
			xdg-open $printpdffilename.pdf
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
		# Ask whether we're processing MathJax, to know whether to process the HTML
        screenpdfmathjax="unknown"
		until [ "$screenpdfmathjax" = "" ] || [ "$screenpdfmathjax" = "y" ]
		do
			echo "Does this book use MathJax? If no, hit enter. If yes, enter y."
			read screenpdfmathjax
		done
		# Set the PDF's filename
		if [ "$screenpdfsubdirectory" = "" ]; then
			screenpdffilename="$bookfolder-screen"
		else
			screenpdffilename="$bookfolder-$screenpdfsubdirectory-screen"
		fi
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# let the user know we're on it!
			echo "Generating HTML..."
			# ...and run Jekyll to build new HTML
			# with MathJax enabled if necessary
			if [ "$screenpdfmathjax" = "" ]; then
				bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi
			# If using MathJax, process the HTML
			if [ "$screenpdfmathjax" = "" ]; then
				echo "No MathJax required."
			else
				echo "Processing MathJax in HTML."
				if [ "$printpdfsubdirectory" = "" ]; then
					gulp mathjax --book $bookfolder
				else
					gulp mathjax --book $bookfolder --language $screenpdfsubdirectory
				fi
			fi
			# Navigate into the book's text folder in _site
			if [ "$screenpdfsubdirectory" = "" ]; then
				cd _site/$bookfolder/text
			else
				cd _site/$bookfolder/$screenpdfsubdirectory/text
			fi
			# Let the user know we're now going to make the PDF
			echo Creating PDF...
			# Run prince, showing progress (-v), printing the docs in file-list
			# and saving the resulting PDF to the _output folder
			prince -v -l file-list -o "$location"/_output/$screenpdffilename.pdf --javascript
			# Navigate back to where we began.
			cd "$location"
			# Tell the user we're done
			echo Done! Opening PDF...
			# Navigate to the _output folder...
			cd _output
			# and open the PDF we just created
			# (for OSX, this is open, not xdg-open)
			xdg-open $screenpdffilename.pdf
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
			# (for OSX, this is open, not xdg-open)
			xdg-open "http://127.0.0.1:4000/"
		else
			# (for OSX, this is open, not xdg-open)
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
		# Create the epub's filename
		if [ "$epubsubdirectory" = "" ]
			then
			epubfilename=$bookfolder
		else
			epubfilename=$bookfolder-$epubsubdirectory
		fi
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
			if [ "$epubmathjax" = "y" ]; then
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
			# Copy text (files in file-list only), images, fonts, styles, package.opf and toc.ncx to epub
			cd "$location"/_site/"$bookfolder"
			# If not a translation...
			if [ "$epubsubdirectory" = "" ]; then
				echo "Copying files to epub folder..."
				mkdir "$location"/_site/epub/text && cd "$location"/_site/$bookfolder/text && cp `cat file-list` "$location"/_site/epub/text/
				cd "$location"
				if [ -d "$location"/_site/$bookfolder/images/epub ]; then
					echo "Copying images..."
					mkdir -p "$location"/_site/epub/images/epub && cp -a "$location"/_site/$bookfolder/images/epub/. "$location"/_site/epub/images/epub/
				fi
				if [ -d "$location"/_site/items/images/epub ]; then
					echo "Found images in _items. Copying to epub..."
					mkdir -p "$location"/_site/epub/items/images/epub && cp -a "$location"/_site/items/images/epub/. "$location"/_site/epub/items/images/epub/
				fi
				if [ "$epubfonts" = "y" ]; then
					echo "Copying fonts..."
					mkdir -p "$location"/_site/epub/fonts && cp -a "$location"/_site/$bookfolder/fonts/. "$location"/_site/epub/fonts/
				fi
				if [ -d "$location"/_site/$bookfolder/styles ]; then
					echo "Copying styles..."
					mkdir "$location"/_site/epub/styles && cp -a "$location"/_site/$bookfolder/styles/. "$location"/_site/epub/styles/
				fi
				if [ -e "$location"/_site/$bookfolder/package.opf ]; then
					echo "Copying package.opf..."
					cp "$location"/_site/$bookfolder/package.opf "$location"/_site/epub/package.opf
				fi
				if [ -e "$location"/_site/$bookfolder/toc.ncx ]; then
					echo "Copying toc.ncx..."
					cp "$location"/_site/$bookfolder/toc.ncx "$location"/_site/epub/toc.ncx
				fi
			# If a translation...
			else
				echo "Copying translation files to epub folder..."

				# Copy text folder
				mkdir "$location"/_site/epub/$epubsubdirectory
				mkdir "$location"/_site/epub/$epubsubdirectory/text
				cd "$location"/_site/$bookfolder/$epubsubdirectory/text
				cp `cat file-list` "$location"/_site/epub/$epubsubdirectory/text/

				# Copy translation images if they exist, otherwise
				# copy the parent-language images.
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/images/. ]; then
					mkdir -p "$location"/_site/epub/$epubsubdirectory/images/epub && cp -a "$location"/_site/$bookfolder/$epubsubdirectory/images/epub/. "$location"/_site/epub/$epubsubdirectory/images/epub/
				else
					mkdir -p "$location"/_site/epub/images/epub && cp -a "$location"/_site/$bookfolder/images/epub/. "$location"/_site/epub/images/epub/
				fi
				if [ -d "$location"/_site/items/$epubsubdirectory/images/epub ]; then
					echo "Found translated images in _items. Copying them to epub..."
					mkdir -p "$location"/_site/epub/items/$epubsubdirectory/images/epub && cp -a "$location"/_site/items/$epubsubdirectory/images/epub/. "$location"/_site/epub/items/$epubsubdirectory/images/epub/
				else
					if [ -d "$location"/_site/items/images/epub ]; then
						echo "Found images in _items. Copying them to epub..."
						mkdir -p "$location"/_site/epub/items/images/epub && cp -a "$location"/_site/items/images/epub/. "$location"/_site/epub/items/images/epub/
					fi
				fi
				# Copy translation styles if they exist, and
				# copy the parent-language styles.
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/styles/. ]; then
					mkdir -p "$location"/_site/epub/$epubsubdirectory/styles && cd "$location"/_site/$bookfolder/$epubsubdirectory/styles && cp -a "$location"/_site/$bookfolder/$epubsubdirectory/styles/. "$location"/_site/epub/$epubsubdirectory/styles/
					mkdir -p "$location"/_site/epub/styles && cp -a "$location"/_site/$bookfolder/styles/. "$location"/_site/epub/styles/
				else
					mkdir -p "$location"/_site/epub/styles && cp -a "$location"/_site/$bookfolder/styles/. "$location"/_site/epub/styles/
				fi
				# Copy translation fonts if they exist, otherwise
				# copy the parent-language fonts.
				if [ "$epubfonts" = "y" ]; then
					if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/fonts/. ]; then
						mkdir -p "$location"/_site/epub/$epubsubdirectory/fonts && cd "$location"/_site/$bookfolder/$epubsubdirectory/fonts && cp -a "$location"/_site/$bookfolder/$epubsubdirectory/fonts/. "$location"/_site/epub/$epubsubdirectory/fonts/
					else
						mkdir -p "$location"/_site/epub/fonts && cp -a "$location"/_site/$bookfolder/fonts/. "$location"/_site/epub/fonts/
					fi
				fi
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/package.opf ]; then
					echo "Copying translation package.opf..."
					cp "$location"/_site/$bookfolder/$epubsubdirectory/package.opf "$location"/_site/epub/package.opf
				fi
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/toc.ncx ]; then
					echo "Copying translation toc.ncx..."
					cp "$location"/_site/$bookfolder/$epubsubdirectory/toc.ncx "$location"/_site/epub/toc.ncx
				fi
				cd "$location"
			fi
			# Copy mathjax and other scripts
			if [ "$epubmathjax" = "y" ]; then
				echo "Copying MathJax..."
				mkdir "$location"/_site/epub/mathjax && cp -a "$location"/_site/assets/js/mathjax/. "$location"/_site/epub/mathjax/
			fi
			if [ "$epubscripts" = "y" ]; then
				echo "Copying Javascript..."
				mkdir "$location"/_site/epub/js && cp -a "$location"/_site/js/. "$location"/_site/epub/js/
			fi
			# Now to create a compressed epub.
			# First, though, if they exist, remove previous .zip and .epub files that we will replace.
			echo "Removing previous zips or epubs..."
			if [ -e "$location/_output/$epubfilename.zip" ]; then
				rm "$location/_output/$epubfilename.zip"
			fi
			if [ -e "$location/_output/$epubfilename.epub" ]; then
				rm "$location/_output/$epubfilename.epub"
			fi
			# Go into _site/epub to zip it to _output
			cd "$location"/_site/epub
			# First, though, remove the fonts folder if we don't want it
			if [ "$epubfonts" = "" ]; then
				rm -r fonts
			fi
			# And remove the mathjax dir if we don't need it
			if [ "$epubmathjax" = "" ]; then
				rm -r mathjax
			fi
			# Now to compress the epub files, only selecting the ones we want in the final epub
			echo "Compressing epub..."
			# Add the mimetype first, with no compression and no extra fields (-X)
			zip --compression-method store -0 -X --quiet "$location/_output/$epubfilename.zip" mimetype
			# Add either the text folder or the translation's text folder.
			if [ "$epubsubdirectory" = "" ]; then
					if [ -d text ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "text"
					fi
				else
					if [ -d "$epubsubdirectory/text" ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "$epubsubdirectory/text"
					fi
			fi
			# Add either the parent images folder or the translation's images folder.
			# If the translation has an images folder, use it. Otherwise, use the parent's
			# images for the translation.
			if [ "$epubsubdirectory" = "" ]; then
					if [ -d images ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "images"
					fi
					if [ -e $location/_site/items/images/epub/. ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "items/images"
					fi
				else
					if [ -d "$epubsubdirectory/images" ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "$epubsubdirectory/images"
					else
						if [ -d images ]; then
							zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "images"
						fi
					fi
					if [ -e "$location/_site/items/$epubsubdirectory/images/epub/." ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "items/$epubsubdirectory/images"
					else
						if [ -e "$location/_site/items/images/epub/." ]; then
							zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "items/images"
						fi
					fi
			fi
			# Add either the parent fonts folder or the translation's fonts folder.
			# If the translation has a fonts folder, use it. Otherwise, use the parent's
			# fonts for the translation.
			if [ "$epubsubdirectory" = "" ]; then
					if [ -d fonts ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "fonts"
					fi
				else
					if [ -d "$epubsubdirectory/fonts" ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "$epubsubdirectory/fonts"
					else
						if [ -d fonts ]; then
							zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "fonts"
						fi
					fi
			fi
			# Add the parent styles folder and the translation's styles folder if it exists.
			if [ "$epubsubdirectory" = "" ]; then
					if [ -d styles ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "styles"
					fi
				else
					if [ -d styles ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "styles"
					fi
					if [ -d "$epubsubdirectory/styles" ]; then
						zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "$epubsubdirectory/styles"
					fi
			fi
			# If MathJax is enabled, copy the MathJax folder.
			# MathJax always goes to the same place in the epub root, even in translations.
			if [ "$epubmathjax" = "y" ]; then
				if [ -d mathjax ]; then
					zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "mathjax"
				fi
			fi
			# If there is a Javascript folder, add it to the epub.
			# Scripts always go to the same place in the epub root, even in translations.
			if [ -d js ]; then
				zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" "js"
			fi
			# Add the package metadata files.
			if [ -d META-INF ]; then
				zip --recurse-paths --quiet "$location/_output/$epubfilename.zip" META-INF
			fi
			if [ -e package.opf ]; then
				zip --quiet "$location/_output/$epubfilename.zip" package.opf
			fi
			if [ -e toc.ncx ]; then
				zip --quiet "$location/_output/$epubfilename.zip" toc.ncx
			fi
			# Change file extension .zip to .epub
			cd "$location"/_output
			if [ -e "$epubfilename".zip ]; then
				mv "$epubfilename".zip "$epubfilename".epub
			fi
			echo "Epub created!"
			# Validation
			echo "To run validation, enter the path to the EpubCheck folder on your machine."
			echo "Hit enter for the default: /usr/local/bin/epubcheck-4.0.2"
			echo "(You can get EpubCheck from https://github.com/IDPF/epubcheck/releases"
			echo "Or go to http://validator.idpf.org to validate online.)"
			read pathtoepubcheck
			if [ "$pathtoepubcheck" = "" ]; then
				echo "Okay, using default EpubCheck location. "
				pathtoepubcheck="/usr/local/bin/epubcheck-4.0.2"
			fi
			java -jar "$pathtoepubcheck"/epubcheck.jar "$epubfilename".epub
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
				cd _site/app
	            echo "Removing old Android platform files..."
	            cordova platform remove android
	            echo "Fetching latest Android platform files..."
	            call cordova platform add android
	            echo "Preparing platforms and plugins..."
	            call cordova prepare android
				echo "Building Android app..."
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

				echo "Attempting to run app in emulator..."
				cordova emulate android

			# Building iOS not available on Linux, only newish Macs
			elif [ "$appbuildgenerateapp" = "i" ]
				then
				echo "Building iOS app..."
				cd _site/app
				# Refresh the ios platform
				# e.g. https://stackoverflow.com/a/44051927/1781075
				echo "Refreshing 'ios' platform..."
				cordova plugin save
				cordova platform rm ios
				cordova platform add ios
				# Now we build the app
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
				cd _site/app
	            echo "Removing old Android platform files..."
	            cordova platform remove android
	            echo "Fetching latest Android platform files..."
	            call cordova platform add android
	            echo "Preparing platforms and plugins..."
	            call cordova prepare android
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

				echo "Attempting to run app in emulator..."
				cordova emulate android

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
		# Ask if we're outputting the files from a subdirectory (e.g. a translation)
		echo "If you're outputting files in a subdirectory (e.g. a translation), type its name. Otherwise, hit enter. "
		read wordsubdirectory
		# Ask whether we're processing MathJax, to know whether to pre-process the HTML
		wordmathjax="unknown"
		until [ "$wordmathjax" = "" ] || [ "$wordmathjax" = "y" ]
		do
			echo "Does this book use MathJax? If no, hit enter. If yes, enter y."
			read wordmathjax
		done
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
			# with MathJax enabled if necessary
			if [ "$wordmathjax" = "" ]; then
				bundle exec jekyll build --config="_config.yml,_configs/_config.$fromformat.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.$fromformat.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi
			# If using, MathJax, preprocess the HTML
			if [ "$wordmathjax" = "" ]; then
				echo "No MathJax required."
			else
				echo "Processing MathJax in HTML."
				if [ "$wordsubdirectory" = "" ]; then
					gulp mathjax --book $bookfolder
				else
					gulp mathjax --book $bookfolder --language $wordsubdirectory
				fi
			fi
			# Navigate into the book's text folder in _site
			if [ "$wordsubdirectory" = "" ]; then
				cd _site/$bookfolder/text
			else
				cd _site/$bookfolder/$wordsubdirectory/text
			fi
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
	    echo "have Gulp installed globally (https://gulpjs.com/),"
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

	########################
	# REFRESH SEARCH INDEX #
	########################
	elif [ "$process" = 8 ]
		then
		echo "Let's refresh the search index."
		echo "We'll index the files in your web or app file lists defined in meta.yml"
		echo "You need to have PhantomJS installed for this to work."

		# Check if refreshing web or app index
		echo "To refresh the website search index, press enter."
		echo "To refresh the app search index, type a and press enter."
		searchIndexToRefresh=""
		read searchIndexToRefresh

		# Generate HTML with Jekyll
		echo "Generating HTML with Jekyll..."
		if [ "$searchIndexToRefresh" = "a" ]
			then
			bundle exec jekyll build --config="_config.yml,_configs/_config.app.yml"
		else
			bundle exec jekyll build --config="_config.yml,_configs/_config.web.yml"
		fi

		# Run PhantomJS script from scripts directory
		echo "Generating index with PhantomJS..."
		cd _site/assets/js
		phantomjs render-search-index.js
		cd "$location"

		# Done
		echo "Index refreshed."

		# Head back to the Electric Book options
		process=0

	###########
	# INSTALL #
	###########
	elif [ "$process" = 9 ]
		then
		echo "Running Bundler to update and install dependencies..."
		echo "If Bundler is not already installed, exit and run"
		echo "gem install bundler"
		echo "from the command line."
		# Update gems
		bundle update
		# Install gems
		bundle install
        # Install node modules
        echo "Next, we're going to install or update Node modules."
        echo "You need to have Node.js installed already (https://nodejs.org)."
        echo "Installing Node modules... This may take a few minutes."
        npm install
		# Head back to the Electric Book options
		process=0
	########
	# EXIT #
	########
	fi
done
