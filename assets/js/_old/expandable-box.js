/* jslint browser */
/* global window, MathJax, locales, pageLanguage */

// --------------------------
// Toggles 'expandable boxes'
// --------------------------

// Empty extension boxes do not need to be expandable
const expandableBoxSelector = '.expandable-box'

// Extension previews are never hidden and so should be excluded
const expandableBoxContentSelector = 'h3 ~ *:not(.expandable-box-preview),' +
'h4 ~ *:not(.expandable-box-preview),' + 'h5 ~ *:not(.expandable-box-preview),' +
'h6 ~ *:not(.expandable-box-preview)'

const boxHeaderSelector = 'h3, h4, h5, h6'

// Toggle the visibility of the contents of the box
function ebExpandableBoxToggle (event) {
  const target = event.target
  const box = target.closest('.expandable-box')
  const toggle = box.querySelector('a.toggle')
  const button = box.querySelector('.preview-read-more')

  const expandableBoxContent = box.querySelectorAll(expandableBoxContentSelector)

  // Switch the class of the toggle button - content changes between '-' and '+'
  toggle.classList.toggle('open')
  toggle.classList.toggle('closed')

  // Toggle the visibility of the box contents
  expandableBoxContent.forEach(function (item) {
    item.classList.toggle('visuallyhidden')
  })

  // Toggle the visibility of the 'Read More' button, if there is one
  if (button) {
    button.classList.toggle('visuallyhidden')
  }
}

// Add 'Read More' button to extension preview to show box contents
function ebExpandableBoxAddPreviewButton (box) {
  // Create the button
  const button = document.createElement('button')
  button.classList.add('preview-read-more')
  button.innerText = locales[pageLanguage]['expandable-box']['read-more']

  // Add the button just before the end of the extension preview
  const preview = box.querySelector('.expandable-box-preview')
  preview.insertAdjacentElement('beforeend', button)

  // Toggle the visibilty of the box contents when the button is clicked
  button.addEventListener('click', function (event) {
    ebExpandableBoxToggle(event)
  })
}

// Add toggle button to `.expandable-box strong`
function ebExpandableBoxAddBoxToggle (box) {
  // Get the h3 strong expandable box header, e.g. 'FIND OUT MORE'
  const boxHeader = box.querySelector(boxHeaderSelector)

  // Add the toggle button
  const boxToggleButton = document.createElement('a')
  boxToggleButton.classList.add('toggle', 'closed')
  boxToggleButton.setAttribute('tabindex', '0')

  // Insert the button after the header
  boxHeader.insertAdjacentElement('beforeEnd', boxToggleButton)
  boxHeader.setAttribute('tabindex', '-1')

  // Listen for clicks on .toggle.
  // Remember that accordion.js is listening for clicks, too,
  // currently on .content a, [data-accordion] (i.e. h2s), and #nav [href].
  boxToggleButton.addEventListener('click', function (event) {
    ebExpandableBoxToggle(event)
  }, true)

  boxToggleButton.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      ebExpandableBoxToggle(event)
    }
  }, true)
}

// Get all the targets we might link to in expandable boxes.
// The callback should be a function that does something with those targets.
function ebExpandableBoxTargets () {
  // Get all the elements in boxes with IDs which do not start with 'MathJax-'
  const targets = document.querySelectorAll('.expandable-box [id]:not([id^="MathJax-"])')
  return targets
}

// If an element inside a box is targeted, click the toggle so that it opens.
function ebExpandableBoxClickContainerBoxToggle (element) {
  if (element) {
    const container = element.closest('.expandable-box')

    if (!container) {
      return
    }

    const toggle = container.querySelector('a.toggle.closed')
    if (toggle) {
      toggle.click()
    }
  }
}

// Expand the box if an element inside it is targeted
function ebExpandableBoxListenForIncomingLinks () {
  const targets = ebExpandableBoxTargets()

  targets.forEach(function (target) {
    target.addEventListener('idTargeted', function () {
      ebExpandableBoxClickContainerBoxToggle(target)
    })
  })
}

// Check the URL for the targets inside boxes
function ebExpandableBoxCheckURLForTargets () {
  const hashInCurrentURL = window.location.hash.split('#')[1]
  const targets = ebExpandableBoxTargets()

  // If the hash is in our list of targets, expand its box
  targets.forEach(function (target) {
    if (target.id === hashInCurrentURL) {
      const targetElement = document.getElementById(hashInCurrentURL)
      ebExpandableBoxClickContainerBoxToggle(targetElement)
    }
  })
}

// Initially hide the contents of each box and add toggles
function ebExpandableBoxInitialiseBoxes () {
  const expandableBoxes = document.querySelectorAll(expandableBoxSelector)

  expandableBoxes.forEach(function (box) {
    const expandableBoxContent = box.querySelectorAll(expandableBoxContentSelector)

    expandableBoxContent.forEach(function (item) {
      item.classList.add('visuallyhidden')
    })

    ebExpandableBoxAddBoxToggle(box)

    // Add Read More button to extension previews
    if (box.querySelector('.expandable-box-preview')) {
      ebExpandableBoxAddPreviewButton(box)
    }
  })
}

// Expandable box startup process
function ebStartExpandableBox () {
  ebExpandableBoxInitialiseBoxes()
  ebExpandableBoxListenForIncomingLinks()
  window.addEventListener(
    'hashchange',
    ebExpandableBoxCheckURLForTargets(),
    false
  )
}

// If MathJax is running, only run all this once the MathJax is typeset.
// Otherwise, MathJaxDisplay divs will appear after the expandable-box contents
// have been hidden.
if (document.querySelector('script#MathJax, script[type^="text/x-mathjax-config"]')) {
  MathJax.Hub.Register.StartupHook('End', ebStartExpandableBox)
} else {
  ebStartExpandableBox()
}
