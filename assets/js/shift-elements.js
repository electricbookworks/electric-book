// Shifts an element up or down the DOM.
// Designed to run in PDF outputs only.

function ebPreviousElement (element) {
  'use strict'
  do {
    element = element.previousElementSibling
  } while (element && element.nodeType !== 1)
  return element
}

function ebNextElement (element) {
  'use strict'
  do {
    element = element.nextElementSibling
  } while (element && element.nodeType !== 1)
  return element
}

function ebShiftNumber (element, direction) {
  'use strict'

  // How many shifts? If the shift number is not specified
  // (i.e. class is just 'shift-up'), assume one-element shift.
  let shiftNumber
  if (element.className.indexOf('shift-' + direction + '-') !== -1) {
    const search = new RegExp('shift-' + direction + '-(\\d+)', 'g')
    const result = search.exec(element.className)
    if (result[1]) {
      shiftNumber = result[1]
    }
  } else {
    shiftNumber = 1
  }
  return shiftNumber
}

function ebShiftUp (element) {
  'use strict'

  const shiftNumber = ebShiftNumber(element, 'up')

  let i, previous
  for (i = 0; i < shiftNumber; i += 1) {
    previous = ebPreviousElement(element)
    if (previous) {
      element.parentNode.insertBefore(element, previous)
    }
  }
}

function ebShiftDown (element) {
  'use strict'

  const shiftNumber = ebShiftNumber(element, 'down')

  let i, next
  for (i = 0; i < shiftNumber; i += 1) {
    next = ebNextElement(element)
    if (next) {
      element.parentNode.insertBefore(element, next.nextElementSibling)
    }
  }
}

const elementsToShiftUp = document.querySelectorAll('[class*="shift-up"]')
let i
for (i = 0; i < elementsToShiftUp.length; i += 1) {
  ebShiftUp(elementsToShiftUp[i])
}

const elementsToShiftDown = document.querySelectorAll('[class*="shift-down"]')
let j
for (j = 0; j < elementsToShiftDown.length; j += 1) {
  ebShiftDown(elementsToShiftDown[j])
}
