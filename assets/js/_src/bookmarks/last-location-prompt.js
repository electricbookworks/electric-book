/* global sessionStorage */

import { locales, pageLanguage } from '../locales'

// Prompt user to go to last location
function ebBookmarksLastLocationPrompt (link) {
  // We need to detect if the user has only just arrived.
  // Checking the history length is unreliable, because
  // browsers differ. So we use sessionStorage to store
  // whether the user has just arrived.
  let newSession
  if (sessionStorage.getItem('sessionUnderway')) {
    newSession = false
  } else {
    newSession = true
    sessionStorage.setItem('sessionUnderway', true)
  }

  // If there is a link to go to, this is a new session,
  // and the prompt string has been set in locales, then prompt.
  if (link && newSession &&
            locales[pageLanguage].bookmarks['last-location-prompt']) {
    const prompt = document.createElement('div')
    prompt.classList.add('last-location-prompt')
    prompt.innerHTML = '<a href="' + link + '">' +
                locales[pageLanguage].bookmarks['last-location-prompt'] +
                '</a>'
    document.body.appendChild(prompt)

    // Add class to animate by. Wait a few milliseconds
    // so that CSS transitions will work.
    window.setTimeout(function () {
      prompt.classList.add('last-location-prompt-open')
    }, 50)

    // Let users hide the prompt
    const closeButton = document.createElement('button')
    closeButton.innerHTML = '&#9587;' // &#9587; is ╳
    prompt.appendChild(closeButton)

    // Listen for clicks on close
    closeButton.addEventListener('click', function () {
      prompt.remove()
    })
  }
}

export default ebBookmarksLastLocationPrompt
