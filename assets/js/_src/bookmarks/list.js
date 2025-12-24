import { locales, pageLanguage } from '../locales'
import { ebAccordionListenForAnchorClicks } from '../accordion'
import ebBookmarksCleanLastLocations from './clean-last-locations'
import ebBookmarksSessionDate from './session-date'
import ebBookmarksConfirmDelete from './confirm-delete'
import ebBookmarksLastLocationPrompt from './last-location-prompt'
import ebBookmarksNoteUI from './note-ui'

function ebBookmarksList ({ bookmarks, bookmarkNotes }) {
  // Get the bookmarks lists
  const bookmarksList = document.querySelector('.bookmarks-list ul')
  const lastLocationsList = document.querySelector('.last-locations-list ul')

  // Clear the current list
  if (bookmarksList) {
    bookmarksList.innerHTML = ''
  }
  if (lastLocationsList) {
    lastLocationsList.innerHTML = ''
  }

  // A variable to store the first, i.e. most recent, last-location link
  let lastLocationLink

  // Add all the bookmarks to it
  bookmarks.forEach(function (bookmark) {
    // Clean last locations
    ebBookmarksCleanLastLocations(bookmark.bookTitle)

    // If lastLocation and it's the same session, then
    // quit, because we only want the previous session's last location
    if (bookmark.type === 'lastLocation' && bookmark.sessionDate === ebBookmarksSessionDate()) {
      return
    }

    // Create list item
    const listItem = document.createElement('li')
    listItem.setAttribute('data-bookmark-type', bookmark.type)

    // Add the page title
    if (bookmark.pageTitle) {
      const page = document.createElement('span')
      page.classList.add('bookmark-page')
      page.innerHTML = '<a href="' + bookmark.location + '">' +
                    bookmark.pageTitle +
                    '</a>'
      listItem.appendChild(page)
    }

    // Add the section heading, if any
    if (bookmark.sectionHeading) {
      const sectionHeading = document.createElement('span')
      sectionHeading.classList.add('bookmark-section')
      sectionHeading.innerHTML = '<a href="' + bookmark.location + '">' +
                    bookmark.sectionHeading +
                    '</a>'
      listItem.appendChild(sectionHeading)
    }

    // Add the description
    if (bookmark.description) {
      const description = document.createElement('span')
      description.classList.add('bookmark-description')
      description.innerHTML = bookmark.description
      listItem.appendChild(description)
    }

    // Add title span with link
    if (bookmark.bookTitle) {
      const title = document.createElement('span')
      title.classList.add('bookmark-title')
      title.innerHTML = '<a href="' + bookmark.location + '">' +
                    bookmark.bookTitle +
                    '</a>'
      listItem.appendChild(title)
    }

    // Format the bookmark date from sessionDate,
    // then add it to the listItem. Leave locale undefined,
    // so that the user gets their default locale's format.
    if (bookmark.sessionDate) {
      const readableSessionDate = new Date(Number(bookmark.sessionDate))
        .toLocaleDateString(undefined, {
          // weekday: 'long',
          // hour: 'numeric',
          // minute: 'numeric',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      const date = document.createElement('span')
      date.classList.add('bookmark-date')
      date.innerHTML = '<a href="' + bookmark.location + '">' +
                    readableSessionDate +
                    '</a>'
      listItem.appendChild(date)
    }

    // Add a delete button and listen for clicks on it
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('bookmark-delete')
    deleteButton.innerHTML = locales[pageLanguage].bookmarks['delete-bookmark']
    listItem.appendChild(deleteButton)
    deleteButton.addEventListener('click', function (event) {
      ebBookmarksConfirmDelete(event.target, bookmark)
    })

    // Add the note UI
    ebBookmarksNoteUI({ bookmark, bookmarkNotes, listItem })

    // Add the list item to the list
    if (bookmark.type === 'lastLocation') {
      lastLocationsList.appendChild(listItem)
    } else {
      bookmarksList.appendChild(listItem)
    }

    // If the lastLocationLink isn't yet set, set it because
    // this iteration in the loop must be the most recent lastLocation.
    if (bookmark.type === 'lastLocation' && lastLocationLink === undefined) {
      lastLocationLink = bookmark.location
    }
  })

  // Add button to delete all bookmarks
  const deleteAllBookmarksListItem = document.createElement('li')
  deleteAllBookmarksListItem.classList.add('bookmarks-delete-all')
  const deleteAllBookmarksButton = document.createElement('button')
  deleteAllBookmarksButton.innerHTML = locales[pageLanguage].bookmarks['delete-all']
  deleteAllBookmarksListItem.appendChild(deleteAllBookmarksButton)
  bookmarksList.appendChild(deleteAllBookmarksListItem)
  deleteAllBookmarksButton.addEventListener('click', function (event) {
    ebBookmarksConfirmDelete(event.target, 'userBookmark')
  })

  // Copy to the last-locations list, too
  const deleteAllBookmarksListItemLastLocations = deleteAllBookmarksListItem.cloneNode(true)
  lastLocationsList.appendChild(deleteAllBookmarksListItemLastLocations)
  deleteAllBookmarksListItemLastLocations.addEventListener('click', function (event) {
    ebBookmarksConfirmDelete(event.target, 'lastLocation')
  })

  // Listen for clicks on the new anchor links,
  // if we're using the content accordion.
  if (typeof ebAccordionListenForAnchorClicks === 'function') {
    ebAccordionListenForAnchorClicks('.bookmarks-modal a')
  }

  // Prompt the user about their last location
  ebBookmarksLastLocationPrompt(lastLocationLink)
}

export default ebBookmarksList
