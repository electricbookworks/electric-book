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
8  Refresh search and book-index databases
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

			# Exit if the Jekyll build fails
			set -e

			if [ "$printpdfmathjax" = "" ]; then
				bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi

			# Return to default error handling
			set +e

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

			echo "Creating targets for book index references..."
			if [ "$printpdfsubdirectory" = "" ]; then
				gulp renderIndexCommentsAsTargets --book $bookfolder
			else
				gulp renderIndexCommentsAsTargets --book $bookfolder --language $printpdfsubdirectory
			fi

			echo "Adding link references to book indexes..."
			if [ "$printpdfsubdirectory" = "" ]; then
				gulp renderIndexListReferences --book $bookfolder --output printpdf
			else
				gulp renderIndexListReferences --book $bookfolder --language $printpdfsubdirectory --output printpdf
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

			# Exit if the Jekyll build fails
			set -e

			if [ "$screenpdfmathjax" = "" ]; then
				bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi

			# Return to default error handling
			set +e

			# If using MathJax, process the HTML
			if [ "$screenpdfmathjax" = "" ]; then
				echo "No MathJax required."
			else
				echo "Processing MathJax in HTML."
				if [ "$screenpdfsubdirectory" = "" ]; then
					gulp mathjax --book $bookfolder
				else
					gulp mathjax --book $bookfolder --language $screenpdfsubdirectory
				fi
			fi

			echo "Creating targets for book index references..."
			if [ "$screenpdfsubdirectory" = "" ]; then
				gulp renderIndexCommentsAsTargets --book $bookfolder
			else
				gulp renderIndexCommentsAsTargets --book $bookfolder --language $screenpdfsubdirectory
			fi

			echo "Adding link references to book indexes..."
			if [ "$screenpdfsubdirectory" = "" ]; then
				gulp renderIndexListReferences --book $bookfolder --output screenpdf
			else
				gulp renderIndexListReferences --book $bookfolder --language $screenpdfsubdirectory --output screenpdf
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
		echo "Do you need to set a baseurl?"
		echo "If yes, enter it with no slashes at the start or end, e.g."
		echo "my/base"
		read baseurl
		# let the user know we're on it!
		echo "Getting your site ready..."
		# We're going to let users run this over and over by pressing enter
		repeat=""
		while [ "$repeat" = "" ]
		do
			# ...and run Jekyll
			if [ "$baseurl" = "" ]
				then
				bundle exec jekyll serve --config="_config.yml,_configs/_config.web.yml,$config"
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
		echo "Okay, let's make an epub of $bookfolder..."
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

			# Exit if the Jekyll build fails
			set -e

			if [ "$epubmathjax" = "y" ]; then
				bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,_configs/_config.mathjax-enabled.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,$config"
			fi

			# Return to default error handling
			set +e

			echo "Creating targets for book index references..."
			if [ "$epubsubdirectory" = "" ]; then
				gulp renderIndexCommentsAsTargets --book $bookfolder
			else
				gulp renderIndexCommentsAsTargets --book $bookfolder --language $epubsubdirectory
			fi

			echo "Adding link references to book indexes..."
			if [ "$epubsubdirectory" = "" ]; then
				gulp renderIndexListReferences --book $bookfolder --output epub
			else
				gulp renderIndexListReferences --book $bookfolder --language $epubsubdirectory --output epub
			fi

			# Now to assemble the epub
			echo "Assembling epub..."
			# Check if there are fonts to include.
			# We check for font extensions to avoid false positives
			# from files like .gitignore and font licences.
			echo "Checking for fonts to include..."
			epubfonts=""
			countttf=`ls -1 _epub/fonts/*.ttf 2>/dev/null | wc -l`
			if [ $countttf != 0 ]; then
				epubfonts="y"
			fi
			countotf=`ls -1 _epub/fonts/*.otf 2>/dev/null | wc -l`
			if [ $countotf != 0 ]; then
				epubfonts="y"
			fi
			countwoff=`ls -1 _epub/fonts/*.woff 2>/dev/null | wc -l`
			if [ $countwoff != 0 ]; then
				epubfonts="y"
			fi
			countwoff2=`ls -1 _epub/fonts/*.woff2 2>/dev/null | wc -l`
			if [ $countwoff2 != 0 ]; then
				epubfonts="y"
			fi
			# Check if there are scripts to include
			echo "Checking for scripts to include..."
			epubscripts="y"
			countjs=`ls -1 "$location"/_site/assets/js/bundle.js 2>/dev/null | wc -l`
			if [ $countjs = 0 ]; then
				epubscripts=""
			fi
			# Copy text (files in file-list only), images, fonts, styles, package.opf and toc.ncx to epub
			cd "$location"/_site/"$bookfolder"
			# Make a folder for the book
			mkdir "$location"/_site/epub/"$bookfolder"
			# If not a translation...
			if [ "$epubsubdirectory" = "" ]; then
				echo "Copying files to epub folder..."
				mkdir -p "$location"/_site/epub/"$bookfolder"/text
				cd "$location"/_site/$bookfolder/text
				cp `cat file-list` "$location"/_site/epub/"$bookfolder"/text/
				cd "$location"
				if [ -d "$location"/_site/$bookfolder/images/epub ]; then
					echo "Copying images..."
					mkdir -p "$location"/_site/epub/"$bookfolder"/images/epub
					cp -a "$location"/_site/$bookfolder/images/epub/. "$location"/_site/epub/"$bookfolder"/images/epub/
				fi
				if [ -d "$location"/_site/items/images/epub ]; then
					echo "Found images in _items. Copying to epub..."
					mkdir -p "$location"/_site/epub/items/images/epub
					cp -a "$location"/_site/items/images/epub/. "$location"/_site/epub/items/images/epub/
				fi
				if [ -d "$location"/_site/$bookfolder/styles ]; then
					echo "Copying styles..."
					mkdir -p "$location"/_site/epub/"$bookfolder"/styles
					cp -a "$location"/_site/$bookfolder/styles/. "$location"/_site/epub/"$bookfolder"/styles/
				fi
				if [ -e "$location"/_site/$bookfolder/package.opf ]; then
					echo "Copying package.opf..."
					# package.opf is best placed in the epub root directory,
					# because we don't try to populate the link to it in
					# container.xml with the book path.
					cp "$location"/_site/$bookfolder/package.opf "$location"/_site/epub/package.opf
				fi
				if [ -e "$location"/_site/$bookfolder/toc.ncx ]; then
					echo "Copying toc.ncx..."
					# As with package.opf, we place this in the epub root.
					cp "$location"/_site/$bookfolder/toc.ncx "$location"/_site/epub/toc.ncx
				fi
			# If a translation...
			else
				echo "Copying translation files to epub folder..."

				# Copy text folder
				mkdir -p "$location"/_site/epub/$bookfolder/$epubsubdirectory/text
				cd "$location"/_site/$bookfolder/$epubsubdirectory/text
				cp `cat file-list` "$location"/_site/epub/"$bookfolder"/$epubsubdirectory/text/

				# Copy translation images if they exist, otherwise
				# copy the parent-language images.
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/images/. ]; then
					mkdir -p "$location"/_site/epub/$bookfolder/$epubsubdirectory/images/epub
					cp -a "$location"/_site/$bookfolder/$epubsubdirectory/images/epub/. "$location"/_site/epub/$bookfolder/$epubsubdirectory/images/epub/
				else
					mkdir -p "$location"/_site/epub/$bookfolder/images/epub
					cp -a "$location"/_site/$bookfolder/images/epub/. "$location"/_site/epub/$bookfolder/images/epub/
				fi
				if [ -d "$location"/_site/items/$epubsubdirectory/images/epub ]; then
					echo "Found translated images in _items. Copying them to epub..."
					mkdir -p "$location"/_site/epub/items/$epubsubdirectory/images/epub
					cp -a "$location"/_site/items/$epubsubdirectory/images/epub/. "$location"/_site/epub/items/$epubsubdirectory/images/epub/
				else
					if [ -d "$location"/_site/items/images/epub ]; then
						echo "Found images in _items. Copying them to epub..."
						mkdir -p "$location"/_site/epub/items/images/epub
						cp -a "$location"/_site/items/images/epub/. "$location"/_site/epub/items/images/epub/
					fi
				fi
				# Copy translation styles if they exist, and
				# copy the parent-language styles.
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/styles/. ]; then
					mkdir -p "$location"/_site/epub/$bookfolder/$epubsubdirectory/styles
					cd "$location"/_site/$bookfolder/$epubsubdirectory/styles
					cp -a "$location"/_site/$bookfolder/$epubsubdirectory/styles/. "$location"/_site/epub/$bookfolder/$epubsubdirectory/styles/
					mkdir -p "$location"/_site/epub/$bookfolder/styles
					cp -a "$location"/_site/$bookfolder/styles/. "$location"/_site/epub/$bookfolder/styles/
				else
					mkdir -p "$location"/_site/epub/$bookfolder/styles
					cp -a "$location"/_site/$bookfolder/styles/. "$location"/_site/epub/$bookfolder/styles/
				fi
				# Copy translation fonts if they exist, otherwise
				# copy the parent-language fonts.
				if [ "$epubfonts" = "y" ]; then
					if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/fonts/. ]; then
						mkdir -p "$location"/_site/epub/$bookfolder/$epubsubdirectory/fonts
						cd "$location"/_site/$bookfolder/$epubsubdirectory/fonts
						cp -a "$location"/_site/$bookfolder/$epubsubdirectory/fonts/. "$location"/_site/epub/$bookfolder/$epubsubdirectory/fonts/
					else
						mkdir -p "$location"/_site/epub/$bookfolder/fonts
						cp -a "$location"/_site/$bookfolder/fonts/. "$location"/_site/epub/$bookfolder/fonts/
					fi
				fi
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/package.opf ]; then
					echo "Copying translation package.opf..."
					# package.opf goes in epub root (see note above)
					cp "$location"/_site/$bookfolder/$epubsubdirectory/package.opf "$location"/_site/epub/package.opf
				fi
				if [ -e "$location"/_site/$bookfolder/$epubsubdirectory/toc.ncx ]; then
					echo "Copying translation toc.ncx..."
					# toc.ncx goes in epub root (see note above)
					cp "$location"/_site/$bookfolder/$epubsubdirectory/toc.ncx "$location"/_site/epub/toc.ncx
				fi
				cd "$location"
			fi
			# Copy mathjax and other scripts
			if [ "$epubmathjax" = "y" ]; then
				echo "Copying MathJax..."
				mkdir -p "$location"/_site/epub/assets/js/mathjax
				cp -a "$location"/_site/assets/js/mathjax/. "$location"/_site/epub/assets/js/mathjax/
			fi
			if [ "$epubscripts" = "y" ]; then
				echo "Copying Javascript..."
				if [ ! -d "$location"/_site/epub/assets/js ]; then
					mkdir -p "$location"/_site/epub/assets/js
				fi
				cp -a "$location"/_site/assets/js/bundle.js "$location"/_site/epub/assets/js/bundle.js
			fi
			# Convert all .html files and internal links to .xhtml
			echo "Renaming .html to .xhtml..."
			cd "$location"
			if [ "$epubsubdirectory" = "" ]; then
				gulp epub:xhtmlLinks --book $bookfolder
				gulp epub:xhtmlFiles --book $bookfolder
				gulp epub:cleanHtmlFiles --book $bookfolder
			else
				gulp epub:xhtmlLinks --book $bookfolder --language $epubsubdirectory
				gulp epub:xhtmlFiles --book $bookfolder --language $epubsubdirectory
				gulp epub:cleanHtmlFiles --book $bookfolder --language $epubsubdirectory
			fi
			# Now to create a compressed epub.
			# First, though, if they exist, remove previous .zip and .epub files that we will replace.
			echo "Removing previous epub-build folders, zips or epubs..."
			if [ -d "$location/_output/$epubfilename" ]; then
				rm -r "$location/_output/$epubfilename"
			fi
			if [ -e "$location/_output/$epubfilename.zip" ]; then
				rm "$location/_output/$epubfilename.zip"
			fi
			if [ -e "$location/_output/$epubfilename.epub" ]; then
				rm "$location/_output/$epubfilename.epub"
			fi
			# And create a new folder for the uncompressed epub
			if [ "$epubsubdirectory" = "" ]; then
				mkdir "$location/_output/$epubfilename"
			else
				mkdir -p "$location/_output/$epubfilename/$bookfolder/$epubsubdirectory"
			fi
			# Go into _site/epub
			cd "$location"/_site/epub
			# First, remove the fonts folder if we don't want it
			# Note: this may be an unneccessary legacy step.
			if [ "$epubfonts" = "" ]; then
				if [ -d fonts ]; then
					rm -r fonts
				fi
			fi
			# And remove the mathjax dir if we don't need it
			if [ "$epubmathjax" = "" ]; then
				if [ -d assets/js/mathjax ]; then
					rm -r assets/js/mathjax
				fi
			fi
			# Before we compress the epub files, we assemble the uncompressed files
			# copying what we need from _site/epub to _output/epub.
			echo "Assembling epub..."
			# Add either the text folder or the translation's text folder.
			if [ "$epubsubdirectory" = "" ]; then
				if [ -d "$bookfolder/text" ]; then
					mkdir -p $location/_output/$epubfilename/$bookfolder/text
					cp -a "$bookfolder/text" "$location/_output/$epubfilename/$bookfolder/"
				fi
			else
				if [ -d "$bookfolder/$epubsubdirectory/text" ]; then
					mkdir -p $location/_output/$epubfilename/$bookfolder/$epubsubdirectory/text
					cp -a "$bookfolder/$epubsubdirectory/text" "$location/_output/$epubfilename/$bookfolder/$epubsubdirectory/"
				fi
			fi
			# Add either the parent images folder or the translation's images folder.
			# If the translation has an images folder, use it. Otherwise, use the parent's
			# images for the translation.
			if [ "$epubsubdirectory" = "" ]; then
				if [ -d $bookfolder/images ]; then
					cp -a "$bookfolder/images" "$location/_output/$epubfilename/$bookfolder/"
				fi
				if [ -e $location/_site/items/images/epub/. ]; then
					cp -a "items/images/epub" "$location/_output/$epubfilename/items/images/"
				fi
			else
				if [ -d "$bookfolder/$epubsubdirectory/images" ]; then
					cp -a "$bookfolder/$epubsubdirectory/images" "$location/_output/$epubfilename/$bookfolder/$epubsubdirectory/"
				else
					if [ -d $bookfolder/images ]; then
						cp -a "$bookfolder/images" "$location/_output/$epubfilename/$bookfolder/"
					fi
				fi
				if [ -e "$location/_site/items/$epubsubdirectory/images/epub/." ]; then
					cp -a "items/$epubsubdirectory/images" "$location/_output/$epubfilename/items/$epubsubdirectory/"
				else
					if [ -e "$location/_site/items/images/epub/." ]; then
						cp -a "items/images/epub" "$location/_output/$epubfilename/items/images/"
					fi
				fi
			fi
			# Add the fonts folder.
			if [ -d $bookfolder/fonts ]; then
				cp -a "$bookfolder/fonts" "$location/_output/$epubfilename/$bookfolder/"
			fi
			# Add the parent styles folder and the translation's styles folder if it exists.
			if [ "$epubsubdirectory" = "" ]; then
					if [ -d $bookfolder/styles ]; then
						cp -a "$bookfolder/styles" "$location/_output/$epubfilename/$bookfolder/"
					fi
				else
					if [ -d $bookfolder/styles ]; then
						cp -a "$bookfolder/styles" "$location/_output/$epubfilename/$bookfolder/"
					fi
					if [ -d "$bookfolder/$epubsubdirectory/styles" ]; then
						cp -a "$bookfolder/$epubsubdirectory/styles" "$location/_output/$epubfilename/$bookfolder/$epubsubdirectory/"
					fi
			fi
			# If MathJax is enabled, copy the MathJax folder.
			if [ "$epubmathjax" = "y" ]; then
				if [ -d assets/js/mathjax ]; then
					mkdir -p "$location"/_output/$epubfilename/assets/js
					cp -a "assets/js/mathjax" "$location/_output/$epubfilename/assets/js/"
				fi
			fi
			# If there is a Javascript bundle, add it to the epub.
			if [ -d assets/js ]; then
				mkdir -p "$location"/_output/$epubfilename/assets/js
				cp -a "assets/js/bundle.js" "$location/_output/$epubfilename/assets/js/"
			fi
			# Add the mimetype file
			if [ -e mimetype ]; then
				cp -a "mimetype" "$location/_output/$epubfilename/"
			else
				echo "No mimetype file found. Your epub will not be valid."
			fi
			# Add the package metadata files.
			if [ -d META-INF ]; then
				cp -a "META-INF" "$location/_output/$epubfilename/"
			fi
			if [ -e package.opf ]; then
				cp -a "package.opf" "$location/_output/$epubfilename/"
			fi
			if [ -e toc.ncx ]; then
				cp -a "toc.ncx" "$location/_output/$epubfilename/"
			fi
			# Compress epub folder
			echo "Compressing epub..."

			# Choose zip method: zip (for zip.exe) or node
			epubZipMethod="node"

			if [ $epubZipMethod = "zip" ]; then
				echo "Zipping with Zip..."
				# To zip the contents and not the $epubfilename folder itself,
				# we have to cd into the directory and zip from there.
				cd "$location/_output/$epubfilename"
				# Add the mimetype first, with no compression and no extra fields (-X)
				zip --compression-method store -0 -X --quiet "../$epubfilename.zip" "mimetype"
				zip --recurse-paths --quiet "../$epubfilename.zip" "*" --exclude "mimetype"
				cd "$location/_output"
			else
				echo "Zipping with Node..."
				cd "$location/_output"
				node "$location/_tools/zip/zip.js" "$epubfilename"
			fi

			# Change file extension .zip to .epub
			if [ -e "$epubfilename".zip ]; then
				mv "$epubfilename".zip "$epubfilename".epub
			fi
			# Check if the epub exists and report back to the user
			if [ -e "$epubfilename".epub ]; then
				echo "Epub created!"
			else
				echo "Sorry, there was a problem and the epub was not created."
			fi
			# Validation
			echo "To run validation, enter the path to the EpubCheck folder on your machine."
			echo "Hit enter for the default: /usr/local/bin/epubcheck-4.2.2"
			echo "(You can get EpubCheck from https://github.com/IDPF/epubcheck/releases"
			echo "Or go to http://validator.idpf.org to validate online.)"
			read pathtoepubcheck
			if [ "$pathtoepubcheck" = "" ]; then
				echo "Okay, using default EpubCheck location. "
				pathtoepubcheck="/usr/local/bin/epubcheck-4.2.2"
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

			# Exit if the Jekyll build fails
			set -e

			if [ "$appmathjax" = "" ]
				then
				bundle exec jekyll build --config="_config.yml,_configs/_config.app.yml,$config"
			else
				bundle exec jekyll build --config="_config.yml,_configs/_config.app.yml,_configs/_config.mathjax-enabled.yml,$config"
			fi

			# Return to default error handling
			set +e

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
				xdg-open _site/app/platforms/android/app/build/outputs/apk/

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
		# Ask user which output format to work from
		echo "Which format are we converting from? Enter a number or hit enter for the default (screen PDF). "
		echo "1. Print PDF"
		echo "2. Screen PDF (default)"
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
				fromformat="screen-pdf"
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
			# ...and run Jekyll to build new HTML.

			# Exit if the Jekyll build fails
			set -e

			# We turn off the math engine so that we get raw TeX output,
			# and because Pandoc does not support SVG output anyway.
			bundle exec jekyll build --config="_config.yml,_configs/_config.$fromformat.yml,_configs/_config.math-disabled.yml,$config"

			# Return to default error handling
			set +e

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

	###################
	# REFRESH INDEXES #
	###################
	elif [ "$process" = 8 ]
		then
		echo "Let's refresh search and index databases."
		echo "We'll index the files in your file lists as defined in meta.yml."

		# Check which format(s) to refresh
		echo "Choose a format to refresh:"
		echo "1 Print PDF"
		echo "2 Screen PDF"
		echo "3 Web"
		echo "4 Epub"
		echo "5 App"
		echo "Or hit enter for all formats"
		searchIndexToRefresh=""
		read searchIndexToRefresh

		# Ask the user to add any extra Jekyll config files, e.g. _config.live.yml
		echo "Any extra config files?"
		echo "Enter filenames (including any relative path), comma separated, no spaces. E.g."
		echo "_configs/_config.live.yml"
		echo "If not, just hit return."
		read searchIndexConfig

		# Generate HTML with Jekyll
		echo "Generating HTML with Jekyll..."

		# Exit if the Jekyll build fails
		set -e

		if [ "$searchIndexToRefresh" = "1" ] || [ "$searchIndexToRefresh" = "" ]
			then
				# Create index files if they don't exist
				if [ ! -f assets/js/book-index-print-pdf.js ]
				then
					touch assets/js/book-index-print-pdf.js
				fi
				# Build the HTML
				bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,$searchIndexConfig"

				# Use gulp to render targets, so that Puppeteer does not,
				# because we need targets added by the same engine (cheerio) that
				# will populate the index list with links.
				gulp renderIndexCommentsAsTargets
				node _site/assets/js/render-book-index.js
		fi
		if [ "$searchIndexToRefresh" = "2" ] || [ "$searchIndexToRefresh" = "" ]
			then
				# Create index files if they don't exist
				if [ ! -f assets/js/book-index-screen-pdf.js ]
				then
					touch assets/js/book-index-screen-pdf.js
				fi
				# Build the HTML
				bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,$searchIndexConfig"
				gulp renderIndexCommentsAsTargets
				node _site/assets/js/render-book-index.js
		fi
		if [ "$searchIndexToRefresh" = "3" ] || [ "$searchIndexToRefresh" = "" ]
			then
				# Create index files if they don't exist
				if [ ! -f assets/js/book-index-web.js ] || [ "$searchIndexToRefresh" = "" ]
				then
					touch assets/js/book-index-web.js
				fi
				# Build the HTML
				bundle exec jekyll build --config="_config.yml,_configs/_config.web.yml,$searchIndexConfig"
				node _site/assets/js/render-book-index.js
				node _site/assets/js/render-search-index.js
		fi
		if [ "$searchIndexToRefresh" = "4" ] || [ "$searchIndexToRefresh" = "" ]
			then
				# Create index files if they don't exist
				if [ ! -f assets/js/book-index-epub.js ]
				then
					touch assets/js/book-index-epub.js
				fi
				# Build the HTML
				bundle exec jekyll build --config="_config.yml,_configs/_config.epub.yml,$searchIndexConfig"
				gulp renderIndexCommentsAsTargets
				node _site/assets/js/render-book-index.js
		fi
		if [ "$searchIndexToRefresh" = "5" ] || [ "$searchIndexToRefresh" = "" ]
			then
				# Create index files if they don't exist
				if [ ! -f assets/js/book-index-app.js ]
				then
					touch assets/js/book-index-app.js
				fi
				# Build the HTML
				bundle exec jekyll build --config="_config.yml,_configs/_config.app.yml,$searchIndexConfig"
				node _site/assets/js/render-book-index.js
				node _site/assets/js/render-search-index.js
		fi

		# Return to default error handling
		set +e

		if [ "$searchIndexToRefresh" = "" ]
			then
			echo "Indexes refreshed."
		else
			echo "Index refreshed."
		fi

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
