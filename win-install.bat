:: Don't show these commands to the user
@ECHO off
:: Set the title of the window
TITLE Run Bundler to install dependencies
:: Encouraging message
ECHO Let's install dependencies. Make sure Bundler is already installed. If not, run `gem install bundler` from the command line.
:: Run bundle update
CALL bundle update
:: Run bundle install
CALL bundle install
GOTO end
:end