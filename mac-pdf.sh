#!/bin/bash
# That tells Linux to use a Bourne shell interpreter.
# Don't echo these commands:
set +v
# Ask user which folder to process
echo -n "Which book folder are we processing? "
read book
echo "Okay, let's process $book..."
# Ask the user to add any extra Jekyll config files, e.g. _config.pdf-ebook.yml
echo -n "Any extra config files? (full filename, comma-separated, no spaces) "
read config
echo "Rightio, we'll add $config to the configuration"

# We're going to let users run this over and over by pressing enter
while [ "$repeat" = "" ]
do
	# let the user know we're on it!
	echo "Generating HTML..."
	# ...and run Jekyll to build new HTML
	jekyll build --config="_config.yml,$config"
	# Navigate into the book's folder in _site output
	cd _site/$book
	# Let the user know we're now going to make the PDF
	echo Creating PDF...
	# Run prince, showing progress (-v), printing the docs in file-list
	# and saving the resulting PDF to the _output folder
	# (For some reason this has to be run with CALL)
	prince -v -l file-list -o ../../_output/$book.pdf
	# Navigate back to where we began.
	cd ../..
	# Tell the user we're done
	echo Done!
	# Navigate to the _output folder...
	cd _output
	# and open the PDF we just created
	# (for Linux, this will need to be xdg-open)
	open $book.pdf
	# Navigate back to where we began.
	cd ../

	# Ask the user if they want to refresh the PDF by running jekyll b and prince again
	repeat=""
	echo "Enter to run again, or any other key and enter to stop."
	read repeat
done
