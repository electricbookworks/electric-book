import { ebToggleClickout } from '../utilities'

// Move the modal HTML to an independent location
function ebBookmarksMoveModal () {
  const modal = document.getElementById('bookmarks-modal')
  if (modal !== null) {
    document.body.appendChild(modal)
  }
}

// Toggle the modal visibility
function ebBookmarksToggleModal ({ scrollTo } = {}) {
  const modal = document.getElementById('bookmarks-modal')
  if (!modal) return

  // Toggle the clickable clickOut area
  ebToggleClickout(modal, function () {
    // If the modal is open, close it
    if (document.querySelector('[data-bookmark-modal="open"]')) {
      modal.style.display = 'none'
      modal.setAttribute('data-bookmark-modal', 'closed')
      // Otherwise, show it
    } else {
      modal.style.display = 'flex'
      modal.setAttribute('data-bookmark-modal', 'open')
      if (scrollTo) {
        const element = document.getElementById(scrollTo)
        element && element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        modal.scrollTop = 0
      }
    }
  })
}

// Open the modal when the bookmarks button is clicked
function ebBookmarksOpenOnClick () {
  const button = document.querySelector('.bookmarks button .bookmark-icon')
  if (button !== null) {
    button.addEventListener('click', function () {
      ebBookmarksToggleModal()
    })
  }
}

// Toggle bookmark tabs in modal
function ebBookmarkListsOpenOnClick () {
  const listHeaders = document.querySelectorAll('.bookmarks-list-header, .last-locations-list-header')
  listHeaders.forEach(function (header) {
    header.addEventListener('click', function () {
      if (document.querySelector('.bookmarks-list-header-open')) {
        // Toggle tabs ...
        const openHeader = document.querySelector('.bookmarks-list-header-open')
        openHeader.classList.remove('bookmarks-list-header-open')
        header.classList.add('bookmarks-list-header-open')
        openHeader.parentElement.classList.remove('bookmarks-list-open')
        header.parentElement.classList.add('bookmarks-list-open')
      }
    })
  })

  // Set default view
  const bookmarksListHeader = document.querySelector('.bookmarks-list-header')
  if (bookmarksListHeader !== null) {
    bookmarksListHeader.classList.add('bookmarks-list-header-open')
  }
}

const ebBookmarksModalLoadingSetter = ({ id, isLoading }) => {
  const element = document.getElementById(id)
  if (!element) return
  element.scrollTop = 0
  if (isLoading) {
    element.classList.add('loading')
  } else {
    element.classList.remove('loading')
  }
}

const ebBookmarksModalSetLoading = (isLoading) => {
  ebBookmarksModalLoadingSetter({ id: 'bookmarks-modal', isLoading })
}

const ebBookmarksModalToggleSetLoading = (isLoading) => {
  ebBookmarksModalLoadingSetter({ id: 'bookmarks-modal-toggle', isLoading })
}

const ebBookmarksModal = () => {
  ebBookmarksMoveModal()
  ebBookmarksOpenOnClick()
  ebBookmarkListsOpenOnClick()
}

export default ebBookmarksModal

export { ebBookmarksToggleModal, ebBookmarksModalSetLoading, ebBookmarksModalToggleSetLoading }
