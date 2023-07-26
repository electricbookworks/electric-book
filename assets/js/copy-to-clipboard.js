/* global locales, pageLanguage */

// Note: the navigator API for this script requires
// that the page is served over https (or is localhost).
// So this will not work on http connections.
// Ensure your webserver is sending all traffic to https.

// Set default button text.
const ebCopyToClipboardButtonText = locales[pageLanguage].copy.copy
const ebCopyToClipboardSuccessText = locales[pageLanguage].copy.copied
const ebCopyToClipboardFailText = locales[pageLanguage].copy['copy-failed']

// Show that copying was done
function ebCopyButtonFeedback (button, text) {
  'use strict'
  button.innerHTML = text

  if (text === ebCopyToClipboardSuccessText) {
    button.classList.add('copy-to-clipboard-success')
  }

  window.setTimeout(function () {
    button.innerHTML = ebCopyToClipboardButtonText
    button.classList.remove('copy-to-clipboard-success')
  }, 2000)
}

// Copy an element's text to the clipboard.
function ebCopyToClipboard (element, button) {
  'use strict'

  // If the element has a data-copy-text attribute,
  // use that text. Otherwise, use its textContent.
  let text = element.textContent
  if (element.hasAttribute('data-copy-text')) {
    text = element.getAttribute('data-copy-text')
  }

  navigator.clipboard.writeText(text).then(function () {
    // success
    ebCopyButtonFeedback(button, ebCopyToClipboardSuccessText)
  }, function () {
    // failure
    ebCopyButtonFeedback(button, ebCopyToClipboardFailText)
  })
}

// Add a copy button, ready for clicking.
function ebAddCopyButton (element, buttonText) {
  'use strict'

  const button = document.createElement('button')
  button.classList.add('copy-to-clipboard')
  button.setAttribute('type', 'button')
  button.innerHTML = buttonText
  element.insertAdjacentElement('afterend', button)

  button.addEventListener('click', function () {
    ebCopyToClipboard(element, button)
  })
}

// Find all elements that need copy buttons,
// by their 'copy-to-clipboard` class.
function ebAddCopyButtons () {
  'use strict'
  const elementsThatNeedButtons = document.querySelectorAll('.copy-to-clipboard')
  elementsThatNeedButtons.forEach(function (element) {
    if (element.hasAttribute('data-copy-button-text')) {
      ebAddCopyButton(element, element.getAttribute('data-copy-button-text'))
    } else {
      ebAddCopyButton(element, ebCopyToClipboardButtonText)
    }
  })
}

// Go
ebAddCopyButtons()
