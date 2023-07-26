function ebShareButtons () {
  'use strict'

  // Move the panel out of controls, so we can
  // position it anywhere on the page with CSS.
  const shareModal = document.getElementById('share-links')

  if (shareModal) {
    document.body.appendChild(shareModal)
  }

  const shareButtons = document.querySelectorAll('.share-button, .share-links-close')

  if (shareButtons && shareModal) {
    shareButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        shareModal.classList.toggle('visuallyhidden')
        const buttonIcon = document.querySelector('.share-button svg')
        buttonIcon.classList.toggle('active')
      })
    })
  }
}

// Go
ebShareButtons()
