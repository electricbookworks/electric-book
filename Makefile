.SHELLFLAGS = -c # Run commands in a -c flag
.SILENT: ; # no need for @
.ONESHELL: ; # recipes execute in same shell
.NOTPARALLEL: ; # wait for this target to finish
.EXPORT_ALL_VARIABLES: ; # send all vars to shell
.PHONY: all # All targets are accessible for user
.DEFAULT: help # Running Make will run the help target

help:  # Use double hash comments next to make targets as command explanations, when you run make help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

pdf-screen:  ## Screen PDF
	bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml"

pdf-screen-mathjax:  ## Screen PDF with Mathjax
	bundle exec jekyll build --config="_config.yml,_configs/_config.screen-pdf.yml,_configs/_config.mathjax-enabled.yml"
	gulp mathjax --book book

pdf-print:  ## Print PDF
	bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml"

pdf-print-mathjax:  ## Print PDF with Mathjax
	bundle exec jekyll build --config="_config.yml,_configs/_config.print-pdf.yml,_configs/_config.mathjax-enabled.yml"

