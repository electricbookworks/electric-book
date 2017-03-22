# The Electric Book Jekyll template

A Jekyll template for making books, ebooks and book-like websites.

## Usage and documentation

1. Copy or clone this folder
2. Edit as needed:
	- `_data/meta.yml` 
	- the stylesheet variables in `book/styles`
	- the content files in `book/text`
3. Run the `run-` script for your operating system.

[Read the guide](http://electricbook.works) for much more. The guide is also an example of the template in action.

### Note on `_includes`

We have a fair number of files in `_includes`. To make them more friendly to use and read, we omit the `.html` file extension. Anything that does have a `.html` file extension is a bit more techie and usually won't require editing.

## Known bugs on Windows

**Jekyll 3.2.1** does not run on Windows due to [a bug](https://github.com/jekyll/jekyll/issues/5192). Until this is fixed, [a workaround](https://github.com/jekyll/jekyll/issues/5192#issuecomment-237484567):

1. At a command prompt, type `gem environment`. See where your gems are installed.
2. Go there and in the `jekyll-3.2.1` folder find `lib/jekyll/layout.rb`.
3. Open `layout.rb` in a text editor and replace line 38 with `@path = base + "/" + name`.
4. Save and close `layout.rb`.

In **Jekyll 3.3.0**, auto-regeneration doesn't work due to [our geeky fascination with shiny new things like Windows Bash](https://github.com/jekyll/jekyll/issues/5462). A [workaround](https://github.com/jekyll/jekyll/issues/5462#issuecomment-252237991): 

1. At a command prompt, type `gem environment`. See where your gems are installed.
2. Go there and in the `jekyll-3.3.0` folder find `lib/jekyll/commands/build.rb`.
3. Open `build.rb` in a text editor and replace everything with the code in [this file](https://raw.githubusercontent.com/jekyll/jekyll/d590d7a73863c896e3fe0292e8b2976172fa91f7/lib/jekyll/commands/build.rb), which is the `build.rb` from Jekyll 3.2.1. (The only affected lines are 73 to the end.)
4. Save and close `build.rb`.
