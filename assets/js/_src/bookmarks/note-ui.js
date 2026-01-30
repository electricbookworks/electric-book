import { locales, pageLanguage } from '../locales'
import ebBookmarksSaveNote from './save-note'
import ebBookmarksCanSync from './can-sync'

const settings = process.env.settings

const ebBookmarksNoteUI = async ({ bookmark, bookmarkNotes, listItem }) => {
  const canSync = await ebBookmarksCanSync()
  if (canSync.hasApi && bookmark.type !== 'lastLocation') {
    if (canSync.userSession?.ID) {
      let noteEvent = null
      const bookmarkNote = bookmarkNotes.find((note) => note && note.key === bookmark.key)
      const handleNoteSave = async (e) => {
        if (e?.currentTarget) {
          const noteContainer = e.currentTarget.closest('.bookmark-note-container')
          if (noteContainer) {
            noteContainer.classList.add('saving')
          }
          await ebBookmarksSaveNote({ bookmark, note: e.currentTarget.value })
          if (noteContainer) {
            noteContainer.classList.add('unedited')
            noteContainer.classList.remove('saving')
          }
        }
      }
      const handleNoteSaveUnload = (e) => {
        e.preventDefault()
        e.returnValue = true
        handleNoteSave(noteEvent)
      }
      const handleNoteEdit = (e) => {
        const noteContainer = e.currentTarget.closest('.bookmark-note-container')
        if (noteContainer) {
          noteContainer.classList.remove('unedited')
        }
      }

      const noteContainer = document.createElement('div')
      noteContainer.classList.add('bookmark-note-container', 'unedited')
      listItem.appendChild(noteContainer)

      const noteTextArea = document.createElement('textarea')
      noteTextArea.placeholder = locales[pageLanguage].bookmarks['bookmark-note-placeholder']
      noteTextArea.maxLength = settings.web?.bookmarks['note-max-length'] ? settings.web?.bookmarks['note-max-length'] : 5000
      noteTextArea.classList.add('bookmark-note')
      noteTextArea.innerHTML = bookmarkNote?.note ?? ''
      noteContainer.appendChild(noteTextArea)
      noteTextArea.addEventListener('change', handleNoteSave)
      noteTextArea.addEventListener('keyup', handleNoteEdit)
      noteTextArea.addEventListener('focus', (e) => {
        noteEvent = e
        window.addEventListener('beforeunload', handleNoteSaveUnload)
      })
      noteTextArea.addEventListener('blur', () => {
        window.removeEventListener('beforeunload', handleNoteSaveUnload)
      })

      const saveBtn = document.createElement('button')
      saveBtn.classList.add('bookmark-note-save')
      saveBtn.innerHTML = locales[pageLanguage].bookmarks['save-bookmark-note']
      noteContainer.appendChild(saveBtn)
    } else {
      const loginLink = document.createElement('a')
      loginLink.setAttribute('href', '/login' + window.location.pathname)
      loginLink.classList.add('bookmark-note-sign-in')
      loginLink.textContent = locales[pageLanguage].bookmarks['bookmark-note-login']
      listItem.appendChild(loginLink)
    }
  }
}

export default ebBookmarksNoteUI
