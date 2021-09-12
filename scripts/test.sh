#!/usr/bin/env bash
#
# usage: scripts/test.sh
#
# Jekyll build for html output file/s and run tests

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

printf "Building Jekyll output for tests\n"
bundle exec jekyll build --quiet --incremental --config "_config.yml,_configs/_config.test.yml,_configs/_config.web.yml"
printf "${green}Done${reset}\n\n"

printf "Running Jest tests\n\n"
./node_modules/.bin/jest --runInBand --detectOpenHandles $@
printf "${green}Done${reset}\n\n"
