// Lint with JS Standard

// Import Node modules
const cheerio = require('gulp-cheerio')
const gulp = require('gulp')

// Local helpers
const {
  allTextPaths, paths, store, printpdfIndexTargets,
  screenpdfIndexTargets, epubIndexTargets, appIndexTargets
} = require('../helpers/paths.js')
const { ebSlugify } = require('../helpers/utilities.js')
const { format } = require('../helpers/args.js')

// Turn HTML comments for book indexes into anchor tags.
// This is a pre-processing alternative to assets/js/index-targets.js,
// which dynamically adds index targets in web clients.
// It duplicates much of what index-targets.js does. So, if you
// update it, you may need to update index-targets.js as well.
function renderIndexCommentsAsTargets (done) {
  'use strict'
  gulp.src(allTextPaths(store), { base: './' })
    .pipe(cheerio({
      run: function ($) {
        // Create an empty array to store entries.
        const entries = []

        $('*').contents()
        // Return only text nodes...
          .filter(function () {
            return this.nodeType === 8
          })
        // .. that start with `index:`
          .filter(function () {
            return (/^\s*index:/).test(this.data)
          })
          .each(function (unusedIndex, comment) {
            // Is this comment between elements ('block')
            // or inline (e.g. inside a paragraph)?
            const startsWithLinebreak = /^\n/
            let position
            if (startsWithLinebreak.test(comment.prev.data) &&
                                startsWithLinebreak.test(comment.next.data)) {
              position = 'block'
            } else {
              position = 'inline'
            }

            // Split the lines into an array.
            const commentText = this.data
            const commentLines = commentText.split('\n')

            // Process each line, i.e. each index target in the comment.
            commentLines.forEach(function (line) {
              // Remove the opening 'index:' prefix.
              const indexKeywordRegex = /^\s*index:/
              if (indexKeywordRegex.test(line)) {
                line = line.replace(indexKeywordRegex, '')
              }

              // Strip white space at start and end of line.
              line = line.trim()

              // Exit if the stripped line is now empty.
              // We only want to process actual book-index terms.
              if (line === '') {
                return
              }

              // Split the line into its entry components.
              // It might be a nested entry, where each level
              // of nesting appears after double backslashes.
              // e.g. software \\ book-production
              const rawEntriesByLevel = line.split('\\')

              // Trim whitespace from each entry
              // https://stackoverflow.com/a/41183617/1781075
              // and remove any leading or trailing hyphens.
              const entriesByLevel = rawEntriesByLevel.map(function (str) {
                return str.trim().replace(/^-+|-+$/, '')
              })

              // Check for starting or ending hyphens.
              // If one exists, flag the target as `from` or `to`,
              // starting or ending a reference range. Then strip the hyphen.
              // Note, JS's `startsWith` and `endsWith` are not supported
              // in PrinceXML, so we didn't use those in case using this in Prince.
              let rangeClass = 'index-target-specific'

              if (line.substring(0, 1) === '-') {
                rangeClass = 'index-target-to'
                line = line.substring(1)
              } else if (line.substring(line.length - 1) === '-') {
                rangeClass = 'index-target-from'
                line = line.substring(0, line.length - 1)
              }

              // Slugify the target text to use in an ID
              // and to check for duplicate instances later.
              const entrySlug = ebSlugify(line)

              // Add the slug to the array of entries,
              // where will we count occurrences of this entry.
              entries.push(entrySlug)

              // Create an object that counts occurrences
              // of this entry on the page so far.
              const entryOccurrences = entries.reduce(function (allEntries, entry) {
                if (entry in allEntries) {
                  allEntries[entry] += 1
                } else {
                  allEntries[entry] = 1
                }
                return allEntries
              }, {})

              // Get the number of occurrences of this entry so far.
              const occurrencesSoFar = entryOccurrences[entrySlug]

              // Use that to add a unique index-ID suffix to the entry slug.
              const id = entrySlug + '--iid-' + occurrencesSoFar

              // Create a target for each line.
              // Note: we can't use one target element for several index entries,
              // because one element can't have multiple IDs.
              // And we don't try to link index entries to IDs of existing elements
              // because those elements' IDs could change, and sometimes
              // we want our target at a specific point inline in a textnode.

              // Create an anchor tag for each line.
              // Note: this tag contains a zero-width space, so that it
              // actually appears in Prince, which doesn't render empty elements.
              const newAnchorElement = $('<a>​</a>')
                .addClass('index-target')
                .addClass(rangeClass)
                .attr('data-target-type', position)
                .attr('id', id)
                .attr('data-index-markup', line)
                .attr('data-index-entry', entriesByLevel.slice(-1).pop())
                .attr('style', 'position: absolute')

              newAnchorElement.insertAfter(comment)
            })
          })

        // If the comment was between blocks, it has `data-target-type=block`.
        // So the anchor targets need to move inside the following block.
        // Since this noob can't seem to get the element after a comment
        // in Cheerio above, we must do a second pass here, after creating
        // anchor targets above, to move them into position. To do this:
        // we get the next element that is not an .index-target
        // then prepend the link to it.

        $('[data-target-type=block]').each(function (unusedIndex, link) {
          link = $(link) // wrap it for cheerio
          const indexedElement = $(link).nextAll(':not(.index-target)').first()
          indexedElement.prepend(link)
        })

        // Finally, flag that we're done.
        $('body').attr('data-index-targets', 'loaded')
      },
      parserOptions: {
        // XML mode necessary for epub output
        xmlMode: true
      }
    }))
    .pipe(gulp.dest('./'))
  done()
}

// Check HTML pages for reference indexes. If we find any,
// look up each list item in the book-index-*.js, and add a link.
// This is a pre-processing alternative to assets/js/index-lists.js,
// which dynamically adds links to reference indexes client-side.
// This pre-processing alternative is necessary for offline formats.
// It duplicates much of what index-lists.js does. So, if you
// update it, you may need to update index-lists.js as well.
function renderIndexListReferences (done) {
  'use strict'
  gulp.src(paths.text.src, { base: './' })
    .pipe(cheerio({
      run: function ($) {
        // Add a link to an entry in a reference index
        function ebIndexAddLink (listItem, pageReferenceSequenceNumber, entry) {
          const link = $('<a>​</a>')
            .attr('href', entry.filename + '#' + entry.id)
            .text(pageReferenceSequenceNumber)

          // Add a class to flag whether this link starts
          // or ends a reference range.
          if (entry.range === 'from' || entry.range === 'to') {
            link.addClass('index-range-' + entry.range)
          } else {
            link.addClass('index-range-none')
          }

          // If the listItem has child lists, insert the link
          // before the first child list. Otherwise, append the link.
          if ($(listItem).find('ul').length > 0) {
            link.insertBefore($(listItem).find('ul'))
          } else {
            link.appendTo(listItem)
          }
        }

        // Add a link to a specific reference-index entry
        function ebIndexFindLinks (listItem, ebIndexTargets) {
          listItem = $(listItem)
          const nestingLevel = listItem.parentsUntil('.reference-index').length / 2

          // We're already looping through all `li`, even descendants.
          // For each one, contruct its tree from its parent nodes.
          // When we look up this entry in the db, we'll compare
          // the constructed tree with the real one in the index 'database'.
          const listItemTree = []

          // If a list item has a parent list item, add its
          // text value to the beginning of the tree array.
          // Iterate up the tree to each possible parent.

          // If the list item has a first child that contains text
          // use that text; otherwise use the entire list item's text.

          // Get the text value of an li without its li children
          function getListItemText (li) {
            const listItemClone = li.clone()
            listItemClone.find('li').remove()

            // If page refs have already been added to the li,
            // we don't want those in the text. They appear after
            // a line break, so we regex everything from that \n.
            const text = listItemClone.text().trim().replace(/\n.*/, '')
            return text
          }

          listItemTree.push(getListItemText(listItem))

          function buildTree (listItem) {
            if (listItem.parent() &&
                                listItem.parent().closest('li').contents()[0]) {
              listItemTree.unshift(getListItemText(listItem.parent().closest('li')))
              buildTree(listItem.parent().closest('li'))
            }
          }

          if (nestingLevel > 0) {
            buildTree(listItem)
          }

          // Reconstruct the reference's text value from the tree
          // and save its slug.
          const listItemSlug = ebSlugify(listItemTree.join(' \\ '))

          // Get the book title and translation language (if any)
          // for the HTML page we're processing.
          const currentBookTitle = $('.wrapper').attr('data-title')
          const currentTranslation = $('.wrapper').attr('data-translation')

          // Look through the index 'database' of targets
          // Each child in the ebIndexTargets array represents
          // the index anchor targets on one HTML page.

          // Set this counter here, so that links are numbered
          // sequentially across target HTML files
          // (e.g. if a range spans two HTML files)
          let pageReferenceSequenceNumber = 1

          ebIndexTargets.forEach(function (pageEntries) {
            // Reset variables
            let titleMatches = false
            let languageMatches = false
            let bookIsTranslation = false
            let entryHasTranslationLanguage = false

            // First, check if the entries for this page
            // of entries are for files in the same book.
            // We just check against the first entry for the page.
            if (currentBookTitle === pageEntries[0].bookTitle) {
              titleMatches = true
            }

            // Check if this is the same language.
            // If the book we're in has a translation language...
            if (currentTranslation) {
              bookIsTranslation = true

              // ... and if the entry also has one
              if (pageEntries[0].translationLanguage) {
                entryHasTranslationLanguage = true

                // ... and if they're the same, the language matches.
                if (bookIsTranslation && entryHasTranslationLanguage) {
                  if (currentTranslation === pageEntries[0].translationLanguage) {
                    languageMatches = true
                  }
                }
              }
            } else {
              // Otherwise, if there was no translation language
              // for the book above, and there IS a language
              // noted for this entry, then there's no match.
              if (pageEntries[0].translationLanguage) {
                languageMatches = false
              } else {
                // Finally, if there was neither a currentTranslation
                // above, nor a translation language for this entry,
                // then it must be a match, because no languages defined
                // means both are the default language for this project.
                languageMatches = true
              }
            }

            if (titleMatches && languageMatches) {
              // Find this entry's page numbers
              let rangeOpen = false
              pageEntries.forEach(function (entry) {
                if (entry.entrySlug === listItemSlug) {
                  // If a 'from' link has started a reference range,
                  // skip links till the next 'to' link that closes the range.
                  if (entry.range === 'from') {
                    rangeOpen = true
                    ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry)
                    pageReferenceSequenceNumber += 1
                  }
                  if (rangeOpen) {
                    if (entry.range === 'to') {
                      ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry)
                      pageReferenceSequenceNumber += 1
                      rangeOpen = false
                    }
                  } else {
                    ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry)
                    pageReferenceSequenceNumber += 1
                  }
                }
              })
            }
          })
        }

        // Get all the indexes on the page, and start processing them.
        function ebIndexPopulate (ebIndexTargets) {
          // Don't do this if the list links are already loaded.
          if ($('.wrapper').attr('data-index-list') === 'loaded') {
            return
          }

          const listItems = $('.reference-index li')

          if (listItems.length > 0) {
            listItems.each(function () {
              ebIndexFindLinks(this, ebIndexTargets)
            })
          }
        }

        const indexLists = $('.reference-index')
        if (indexLists.length > 0) {
          let indexListsProcessed = 0
          indexLists.each(function () {
            // Process for epub output by default
            if (format === 'print-pdf') {
              ebIndexPopulate(printpdfIndexTargets)
            } else if (format === 'screen-pdf') {
              ebIndexPopulate(screenpdfIndexTargets)
            } else if (format === 'app') {
              ebIndexPopulate(appIndexTargets)
            } else {
              ebIndexPopulate(epubIndexTargets)
            }

            // Flag when we're done
            indexListsProcessed += 1
            if (indexListsProcessed === indexLists.length ||
                                indexLists.length === 1) {
              $('.wrapper').attr('data-index-list', 'loaded')
            }
          })
        }
      },
      parserOptions: {
        // XML mode necessary for epub output
        xmlMode: true
      }
    }))
    .pipe(gulp.dest('./'))
  done()
}

exports.renderIndexCommentsAsTargets = renderIndexCommentsAsTargets
exports.renderIndexListReferences = renderIndexListReferences
