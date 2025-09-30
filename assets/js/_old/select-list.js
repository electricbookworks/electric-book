/* global locales, pageLanguage */

// Options
// -------
// 1. Which select elements will this script apply to?
const ebSelectLists = document.querySelectorAll('select.select-list')
// 2. Do you want to convert correct answers to plain text?
const ebSelectCorrectToText = true

// Polyfill for IE (thanks, MDN)
Number.isInteger = Number.isInteger || function (value) {
  'use strict'

  return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value
}

// Check if an option's code means it is correct or incorrect,
// returning true for correct and false for incorrect.
function ebSelectCheckCode (code) {
  'use strict'

  // Get the fifth character in the code,
  // and try to convert it to a number.
  const keyCharacter = Number(code.charAt(4))

  // If it is a number, this returns true.
  return Number.isInteger(keyCharacter)
}

function ebSelectAddMarker (selectElement, markerContent) {
  'use strict'

  // If a marker already exists from a previous attempt,
  // remove it.
  if (selectElement.nextElementSibling && selectElement.nextElementSibling.classList.contains('select-list-marker')) {
    const oldMarker = selectElement.nextElementSibling
    oldMarker.remove()
  }

  // Add new marker
  const newMarker = document.createElement('span')
  newMarker.classList.add('select-list-marker')
  newMarker.innerHTML = markerContent
  selectElement.insertAdjacentElement('afterend', newMarker)
}

// Convert an option to unclickable text
function ebSelectConvertToText (selectElement, optionElement) {
  'use strict'
  selectElement.outerHTML = optionElement.innerHTML
}

// Mark a selected option as correct or incorrect.
function ebSelectMarkResult (event) {
  'use strict'

  // Get the selected option and its code.
  const selectedOption = event.target.options[event.target.selectedIndex]
  const optionCode = selectedOption.getAttribute('data-select-code')
  const selectList = selectedOption.parentNode

  // Mark whether the option is correct or incorrect.
  // Since we can't style options, only select elements,
  // we mark the parent select element and add a span after it
  // that we can style.
  if (optionCode && ebSelectCheckCode(optionCode)) {
    selectList.classList.remove('select-option-incorrect')
    selectList.classList.add('select-option-correct')
    ebSelectAddMarker(selectList, locales[pageLanguage].questions['mark-correct'])
    if (ebSelectCorrectToText === true) {
      ebSelectConvertToText(selectList, selectedOption)
    }
  } else {
    selectList.classList.remove('select-option-correct')
    selectList.classList.add('select-option-incorrect')
    ebSelectAddMarker(selectList, locales[pageLanguage].questions['mark-incorrect'])
  }
}

// Listen for changes on a select element,
// to mark the result when the user changes the option.
function ebSelectListener (selectElement) {
  'use strict'
  selectElement.addEventListener('change', ebSelectMarkResult, false)
}

// Add a listener to each select element.
function ebSelects (selects) {
  'use strict'

  if (selects.length > 0) {
    let i
    for (i = 0; i < selects.length; i += 1) {
      ebSelectListener(selects[i])
    }
  }
}

// Go!
ebSelects(ebSelectLists)
