# Adding transformation functions

The functions folder lets you define custom functions that transform HTML during pre-processing. For example, the template includes a function that adds ARIA `role="note"` to `.sidenote` elements.

Currently, these functions only affect epub and PDF output.

Note: the filename and function name of each transformation need to be identical, in order for the processor to handle them correctly.
