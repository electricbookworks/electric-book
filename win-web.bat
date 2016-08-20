:: Don't show these commands to the user
@ECHO off
:: Set the title of the window
TITLE Your book as a website
:: Encouraging message
ECHO Let's make a website!
:: Ask the user to add any extra Jekyll config files, e.g. _config.foo.yml
SET /p config=Add any extra config files (full filename, comma-separated, no spaces): 
:: Ask the user to set a baseurl if needed
SET /p baseurl=Add optional baseurl (e.g. my/subfolder): 
IF "%baseurl%"=="" GOTO servewithoutbaseurl
:: let the user know we're on it!
ECHO Building your site...
ECHO You may need to reload the web page once this server is running.
:: Route for serving with a baseurl
:servewithbaseurl
:: Open the web browser...
START "" "http://127.0.0.1:4000/%baseurl%/"
:: ...and run Jekyll to build new HTML
CALL bundle exec jekyll serve --config="_config.yml,%config%" --baseurl="/%baseurl%"
:: And we're done here.
GOTO end
:: Route for serving without a baseurl
:servewithoutbaseurl
:: Open the web browser...
START "" "http://127.0.0.1:4000/"
:: ...and run Jekyll to build new HTML
CALL bundle exec jekyll serve --config="_config.yml,%config%" --baseurl=""
:: And we're done here.
GOTO end
:end