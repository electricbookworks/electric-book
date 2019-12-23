#!/bin/bash
# That tells Linux to use a Bourne shell interpreter.
# Don't echo these commands:
set +v

# ----------------------------------------------------------

# This script updates the files in this project from another.
# It's designed for updating Electric Book projects,
# e.g. for copying all styles and scripts common to a family of projects.

# Setup
# -----
# Create a list of all the files common to your projects,
# which you want to keep updated. Each file path should
# be relative to the project root. Only list paths to files,
# not directories. E.g. include `_app/build.json`, not `_app`.
# Save the list as _tools/update/files.txt.
# Place each file on a new line. The list can include blank lines
# and code comments on lines that start with a #.

# Usage
# -----
# In Terminal (or Cygwin with rsync installed), navigate (cd)
# to _tools/update and run this script with at least one argument:
# the name of the project to or from which you want to update.
# If you set only one, the other is this repo.
# Optionally, add --preview, which only does a dry run of the update.
# E.g. in Terminal, in theeEmpireStrikesBack/_tools/update, you might enter:
# ./update.sh --to aNewHope
# Or for a dry run:
# ./update.sh --to aNewHope --preview
# Or to sync two other projects with this project's file list:
# ./update.sh --from returnOfTheJedi --to aNewHope

# ----------------------------------------------------------

# Commands
# --------

# Get values from arguments
# (https://stackoverflow.com/a/14203146/1781075)
POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"
case $key in
    -f|--from)
    from="$2"
    shift # past argument
    shift # past value
    ;;
    -t|--to)
    to="$2"
    shift # past argument
    shift # past value
    ;;
    -p|--preview)
    preview=true
    shift # past argument
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

# Define the file that lists files to sync
fileList="files.txt"

# If there is neither a from nor a to, exit
if [[ -z $from && -z $to ]]
then
    echo "Please define a --from and/or --to directory."
    exit 1
fi

# If no '--from' argument, assume it's this project
if [[ $from ]]
then
    source="../../../$from"
else
    source="../../"
fi

# If no '--to' argument, assume it's this project
if [[ $to ]]
then
    destination="../../../$to"
else
    destination="../../"
fi

# For previews, set rsync options to:
# -n: --dry-run; -v: --verbose; -i: --itemize-changes
if [[ $preview == true ]]
then
    option="-nvi"
else
    option=""
fi

# Check that each exist, and error if they don't
if [[ -f "$fileList" ]]; then
    echo "File list $fileList found."
else
    echo "File list $fileList not found."
    exit 1
fi

if [[ -d "$source" ]]; then
    echo "Source directory $source found."
else
    echo "Source directory $source not found."
    exit 1
fi

if [[ -d "$destination" ]]; then
    echo "Destination directory $destination found."
else
    echo "Destination directory $destination not found."
    exit 1
fi

# Run the sync
if [[ $preview == true ]]
then
    echo "Previewing files to be copied..."
else
    echo "Copying files..."
fi

if [[ $preview == true ]]
then
    rsync -a "$option" --files-from="$fileList" "$source" "$destination"
else
    rsync -a --files-from="$fileList" "$source" "$destination"
fi

echo "Done."
