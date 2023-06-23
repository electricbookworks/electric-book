/* global MutationObserver */

// This script shows and hides the annotation sidebar
// and the annotations in the page text.

// Options
const annotationOptions = {
  highlightsColor: '#eee'
}

// Get the elements we need
const openSidebarToggle = document.querySelector('#annotator-toggle-sidebar')
const showAnnotationsToggle = document.querySelector('#annotator-show-annotations')
const openSidebarToggleSVG = document.querySelector('.annotator-toggle-sidebar svg')
const showAnnotationsToggleSVG = document.querySelector('.annotator-show-annotations svg')

// Get annotator tool
// This is a function because we may need to get its value
// only when certain events have occurred.
function annotatorTool () {
  'use strict'
  const tool = document.querySelector('.js-annotate-btn')
  if (tool) {
    return tool
  }
}

// Turn highlighting on
function showAnnotationHighlights () {
  'use strict'
  const css = '.annotator-hl{background-color:' + annotationOptions.highlightsColor + '}'
  const style = document.createElement('style')
  style.type = 'text/css'
  style.id = 'annotation-styles'

  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  document.head.appendChild(style)
}

// Turn highlighting off
function hideAnnotationHighlights () {
  'use strict'
  if (document.querySelector('#annotation-styles')) {
    document.querySelector('#annotation-styles').remove()
  }
}

// Open sidebar
function annotatorOpenSidebar () {
  'use strict'
  openSidebarToggle.checked = true
}

// Close sidebar
function annotatorCloseSidebar () {
  'use strict'
  openSidebarToggle.checked = false
}

// Listen for checkbox toggle. This function takes three arguments:
// target: the checkbox to listen on,
// on: the function if it's checked,
// off: the function if it's not checked.
function annotatorListenForToggle (target, on, off) {
  'use strict'
  if (target) {
    target.addEventListener('change', function () {
      if (this.checked) {
        on()
      } else {
        off()
      }
    })
  }
}

// Listen for clicks
function annotatorListenForClick (target, action) {
  'use strict'
  if (target) {
    target.addEventListener('click', function () {
      action()
    })
  }
}

// Create an observer that will open the sidebar
// when the hypothesis-highlight button is clicked.
const annotatorButtonObserver = new MutationObserver(function (mutations) {
  'use strict'
  mutations.forEach(function (mutation) {
    const hypothesisAdder = mutation.target.querySelector('hypothesis-highlight')
    if (hypothesisAdder) {
      annotatorOpenSidebar()
    }
  })
})
// Listen for changes in the body of the page
// with the annotatorButtonObserver
annotatorButtonObserver.observe(document.body, {
  childList: true,
  subtree: true
})

// Listen for mouseover on our toggle buttons
function annotatorHideSVGTitleOnMouseover (svg) {
  'use strict'
  if (svg) {
    const title = svg.getElementsByTagName('title')[0]
    svg.addEventListener('mouseover', function () {
      title.remove()
    })
    svg.addEventListener('mouseleave', function () {
      svg.insertAdjacentElement('afterbegin', title)
    })
  }
}

// Start
window.onload = function () {
  'use strict'
  annotatorListenForToggle(openSidebarToggle, annotatorOpenSidebar, annotatorCloseSidebar)
  annotatorListenForToggle(showAnnotationsToggle, showAnnotationHighlights, hideAnnotationHighlights)
  annotatorListenForClick(annotatorTool(), annotatorOpenSidebar)
  annotatorHideSVGTitleOnMouseover(openSidebarToggleSVG)
  annotatorHideSVGTitleOnMouseover(showAnnotationsToggleSVG)
}
