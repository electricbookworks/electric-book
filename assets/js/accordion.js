/*
global window, settings, ebLazyLoadImages, videoShow, locales,
pageLanguage, Element, HTMLDocument, Node, MutationObserver
*/

// --------------------------------------------------------------
// Options
//
// 1. Use CSS selectors to list the headings that will
//    define each accordion section, e.g. '#content h2'
const headingLevel = settings.web.accordion.level
const accordionHeads = '.content > ' + headingLevel
// 2. Which heading's section should we show by default?
const defaultAccordionHead = '.content > ' + headingLevel + ':first-of-type'
// 3. Auto close last accordion when you open a new one?
const autoCloseAccordionSections = false
// --------------------------------------------------------------

function ebAccordionInit () {
  'use strict'

  let pageAccordionOff

  // Check for no-accordion setting on page
  const accordionPageSetting = ebAccordionPageSetting()
  const accordionBookSetting = ebAccordionBookSetting()

  // First, check the book-level setting
  if (accordionBookSetting === false) {
    pageAccordionOff = true
  } else {
    pageAccordionOff = false
  }

  // If the accordion is turned off for this page
  if (accordionPageSetting && (accordionPageSetting === 'none')) {
    pageAccordionOff = true
  }

  // If the accordion is turned on for this page
  if (accordionPageSetting === 'true') {
    pageAccordionOff = false
  }

  return navigator.userAgent.indexOf('Opera Mini') === -1 &&
    document.querySelectorAll !== 'undefined' &&
    window.addEventListener !== 'undefined' &&
    !!Array.prototype.forEach &&
    !pageAccordionOff
}

function ebAccordionPageSetting () {
  'use strict'

  const accordionPageSetting = document.body.querySelector('.wrapper').getAttribute('data-accordion-page')
  return accordionPageSetting
}

function ebAccordionBookSetting () {
  'use strict'

  const accordionBookSetting = settings.web.accordion.enabled
  return accordionBookSetting
}

function ebAccordionDefaultAccordionHeadID () {
  'use strict'

  let defaultAccordionHeadID

  // Get the default accordion section's ID
  if (document.querySelector(defaultAccordionHead) &&
      document.querySelector(defaultAccordionHead).id) {
    defaultAccordionHeadID = document.querySelector(defaultAccordionHead).id
    if (!defaultAccordionHeadID) {
      defaultAccordionHeadID = 'defaultAccordionSection'
    }
  }
  return defaultAccordionHeadID
}

function ebAccordionSetUpSections (sectionHeadings) {
  'use strict'

  // Loop through sectionHeadings, rearranging elements
  // to create an accessible accordion with sections
  // that look like this:

  // <h2>
  //     <button id="header-title..." aria-controls="section-title...">
  //         <span>Section title</span>
  //         <span>+</span>
  //     </button>
  // </h2>
  // <section id="section-title..." aria-labelledby="header-title...">
  //     Section content
  // </section>

  sectionHeadings.forEach(function (sectionHeading) {
    // Get the ID of the heading
    const headingID = sectionHeading.id

    // Create a button element to put inside the heading
    const headingButton = document.createElement('button')
    headingButton.setAttribute('id', 'header-' + headingID)
    headingButton.setAttribute('aria-expanded', 'false')
    headingButton.setAttribute('aria-controls', 'section-' + headingID)

    // Move the heading text into a span
    const headingSpan = document.createElement('span')
    headingSpan.innerHTML = sectionHeading.innerHTML
    sectionHeading.innerHTML = ''

    // Move the text span into the button
    headingButton.appendChild(headingSpan)

    // Move the button into the heading
    sectionHeading.appendChild(headingButton)

    // Add a +/- indicator to show open/closed section
    const expandedIndicator = document.createElement('span')
    expandedIndicator.setAttribute('aria-hidden', 'true')
    expandedIndicator.innerHTML = '+'

    headingButton.appendChild(expandedIndicator)

    // Create a section element to correspond with the heading
    const contentSection = document.createElement('section')
    contentSection.setAttribute('id', 'section-' + headingID)
    contentSection.setAttribute('aria-labelledby', 'header-' + headingID)
    contentSection.setAttribute('aria-hidden', 'true')

    // Now we have the heading and all its children, and an empty section.
    // The heading is still where it should be in the DOM,
    // so we can put the section after it.
    sectionHeading.insertAdjacentElement('afterend', contentSection)

    // Add label to section heading so that it's not "empty"
    sectionHeading.setAttribute('aria-labelledby', 'header-' + headingID)
  })

  ebAccordionFillSections()
  ebAccordionShowAllButton()
}

function ebAccordionFillSections () {
  'use strict'

  // Grab the individual #contents elements of the page
  const contentItems = document.querySelector('.content').childNodes

  // Put all the items in an array, selecting only
  // elements and text items that match the mathjax \[ pattern.
  let j; const contentItemsForSections = []
  for (j = 0; j < contentItems.length; j += 1) {
    if (contentItems[j].nodeType === Node.ELEMENT_NODE) {
      contentItemsForSections.push(contentItems[j])
    } else if (contentItems[j].nodeValue.includes('[')) {
      contentItemsForSections.push(contentItems[j])
    }
  }

  // We don't know where our first section is yet
  let currentSection = false

  // Loop through the content to accordify
  contentItemsForSections.forEach(function (contentItem) {
    // If this is an element (not a text or comment node), and
    // if this is a section, update currentSection, then move on
    if (contentItem.nodeType === Node.ELEMENT_NODE) {
      if (contentItem.nodeName === 'SECTION' && contentItem.hasAttribute('aria-labelledby')) {
        currentSection = contentItem
        return
      }
    }

    // Have we reached the first section yet? If not, move on
    if (!currentSection) {
      return
    }

    // Leave the headings outside the section
    if (contentItem.nodeName.toLowerCase() === headingLevel) {
      return
    }

    // Leave the pagination arrows outside the section
    if (contentItem.classList && contentItem.classList.contains('pagination')) {
      return
    };

    // Otherwise, move the element inside the section
    currentSection.appendChild(contentItem)
  })
}

function ebAccordionCloseSection (heading) {
  // Given a heading element, apply all the changes needed
  // to close the corresponding section

  heading.querySelector('button').setAttribute('aria-expanded', 'false')
  heading.querySelector('span[aria-hidden]').innerHTML = '+'

  const section = heading.nextElementSibling
  section.setAttribute('aria-hidden', 'true')
}

function ebAccordionOpenSection (heading) {
  // Given a heading element, apply all the changes needed
  // to open the corresponding section

  heading.querySelector('button').setAttribute('aria-expanded', 'true')
  heading.querySelector('span[aria-hidden]').innerHTML = '–'

  const section = heading.nextElementSibling
  section.setAttribute('aria-hidden', 'false')
}

function ebAccordionHideThisSection (targetID) {
  'use strict'

  const heading = document.getElementById(targetID)

  ebAccordionCloseSection(heading)
}

function ebAccordionHideAll () {
  'use strict'

  const headings = document.querySelectorAll(accordionHeads)

  headings.forEach(function (heading) {
    ebAccordionCloseSection(heading)
  })
}

function ebAccordionShowAll () {
  'use strict'

  const headings = document.querySelectorAll(accordionHeads)

  headings.forEach(function (heading) {
    ebAccordionOpenSection(heading)
  })
}

function ebAccordionHideAllExceptThisOne (targetID) {
  'use strict'

  const headings = document.querySelectorAll(accordionHeads)

  headings.forEach(function (heading) {
    // If it's the one we just clicked, skip it
    if (heading.id === targetID) {
      return
    }

    // Otherwise, hide it
    ebAccordionCloseSection(heading)
  })
}

function ebAccordionCheckParent (node) {
  'use strict'

  // If there is no parent, or something went wrong, exit
  if (!node) {
    return false
  }

  if (!node.parentNode) {
    return false
  }

  // If the parent is the body element, exit
  if (node.tagName === 'BODY') {
    return false
  }

  // If it is an accordion section, return its ID
  if (node.nodeName === 'SECTION') {
    return node.id
  }

  // If it's an accordion heading, return the ID of the
  // corresponding accordion section
  if (node.nodeName.toLowerCase() === headingLevel) {
    return 'section-' + node.id
  }

  // If it has a parent, check whether that parent is
  // an accordion section, and return its ID
  const nodeParent = node.parentNode
  const parentIsSection = (nodeParent.nodeName === 'SECTION')
  if (parentIsSection) {
    return nodeParent.id
  }

  // Else, recurse upwards
  return ebAccordionCheckParent(nodeParent)
}

function ebAccordionFindSection (targetToCheck) {
  // Find and return containing section

  'use strict'

  // Work recursively up the DOM looking for the section
  return ebAccordionCheckParent(targetToCheck)
}

function ebWhichTarget (targetID) {
  'use strict'

  let targetToCheck

  if (targetID) {
    // If we're given an ID, use it
    // Decode the targetID URI in case it's not ASCII
    targetID = decodeURIComponent(targetID)

    targetToCheck = document.getElementById(targetID)
  } else {
    // Else use the hash
    let trimmedHash = window.location.hash.replace('#', '')

    // Decode the trimmedHash in case it's not ASCII
    trimmedHash = decodeURIComponent(trimmedHash)

    targetToCheck = document.getElementById(trimmedHash)
  }

  // If the ID doesn't exist, exit
  if (!targetToCheck) {
    return false
  }

  return targetToCheck
}

function ebAccordionShow (targetID) {
  'use strict'

  const targetToCheck = ebWhichTarget(targetID)
  if (!targetToCheck) {
    return
  }

  const sectionID = ebAccordionFindSection(targetToCheck)
  // If we are not linking to a section or something inside it,
  // show the default section
  if (!sectionID) {
    ebAccordionShowDefaultSection()
  }

  // Show and load the contents of the section
  const sectionToShow = document.getElementById(sectionID)
  if (sectionToShow) {
    const heading = sectionToShow.previousElementSibling

    ebAccordionOpenSection(heading)

    // Lazyload the images inside
    const lazyimages = sectionToShow.querySelectorAll('[data-srcset]')
    if (lazyimages.innerHTML !== undefined) {
      ebLazyLoadImages(lazyimages)
    }

    // If we have a slideline in this section, check if it's a portrait one
    const slidelinesInThisSection = sectionToShow.querySelectorAll('.slides')

    slidelinesInThisSection.forEach(function (slidelineInThisSection) {
      const firstFigureImg = slidelineInThisSection.querySelector('.figure img')

      if (firstFigureImg) {
        firstFigureImg.addEventListener('load', function () {
          const portraitSlideline = (firstFigureImg.height > firstFigureImg.width)
          if (portraitSlideline) {
            slidelineInThisSection.querySelector('nav').classList.add('nav-slides-portrait')
          }
        })
      }
    })

    if (typeof (videoShow) === 'function') {
      videoShow(sectionToShow)
    }
  }
}

function ebAccordionListenForAnchorClicks () {
  'use strict'

  // Listen for clicks on *all* the anchors (;_;)
  const allTheAnchors = document.querySelectorAll('#content a[href], .search-results-nav a[href]')
  allTheAnchors.forEach(function (oneOfTheAnchors) {
    // If it's an external link, exit
    if (oneOfTheAnchors.target === '_blank') {
      return
    }

    oneOfTheAnchors.addEventListener('click', function (event) {
      event.stopPropagation()

      let targetID

      // Ignore target blank / rel noopener links
      if (event.target.getAttribute('rel') === 'noopener') {
        return
      }

      // Get the target ID by removing any file path and the #
      if (event.target.hasAttribute('href')) {
        targetID = event.target.getAttribute('href').replace(/.*#/, '')
      } else {
        return
      }

      // Find the target of the link in the DOM
      const targetOfLink = document.getElementById(targetID)

      // Recursively update targetID until we have an accordion section
      targetID = ebAccordionFindSection(targetOfLink)

      // Now open the right closed accordion
      ebAccordionShow(targetID)
      if (autoCloseAccordionSections === true) {
        ebAccordionHideAllExceptThisOne(targetID)
      }
    })
  })
}

function ebAccordionListenForHeadingClicks () {
  'use strict'

  // Expand an accordion section if its heading is clicked
  const headings = document.querySelectorAll(accordionHeads)
  headings.forEach(function (heading) {
    heading.addEventListener('click', function () {
      const button = heading.querySelector('button')
      if (button.getAttribute('aria-expanded') === 'true') {
        ebAccordionHideThisSection(heading.id)
      } else {
        ebAccordionShow(heading.id)
      }
    })
  })
}

function ebAccordionListenForNavClicks () {
  'use strict'

  // Also listen for nav clicks
  const navLinks = document.querySelectorAll('#nav [href]')

  navLinks.forEach(function (navLink) {
    navLink.addEventListener('click', function (event) {
      // Get the section and click to open it if it's closed
      const theHeading = document.getElementById(event.target.hash.replace(/.*#/, ''))

      // Simulate anchor click, if it's closed
      if (theHeading) {
        if (theHeading.querySelector('button').getAttribute('aria-expanded') === 'false') {
          theHeading.click()
        }
      }
    })
  })
}

function ebAccordionListenForHashChange () {
  'use strict'

  window.addEventListener('hashchange', function (event) {
    // Don't treat this like a normal click on a link
    event.preventDefault()

    // Get the target ID from the hash
    let targetID = window.location.hash

    targetID = decodeURIComponent(targetID)

    // Get the target of the link
    const targetOfLink = document.getElementById(targetID.replace(/.*#/, ''))

    // Check if it's in the viewport already
    const targetRect = targetOfLink.getBoundingClientRect()

    const targetInViewport = targetRect.top >= -targetRect.height &&
      targetRect.left >= -targetRect.width &&
      targetRect.bottom <= targetRect.height + window.innerHeight &&
      targetRect.right <= targetRect.width + window.innerWidth

    // If it's in a closed section, all dimensions will be = 0
    // If it's in an open section, dimensions will be > 0
    const targetInOpenSection = targetRect.width > 0 &&
      targetRect.height > 0 &&
      targetRect.x > 0 &&
      targetRect.y > 0

    // Check if it's an accordion
    const targetAccordionStatus = targetOfLink.querySelector('button[aria-expanded]')

    // If it's in the viewport and it's not an accordion header, then exit
    if (targetInViewport && targetInOpenSection && !targetAccordionStatus) {
      return
    }

    // If it's an accordion and it's closed, open it / jump to it
    if (targetAccordionStatus && targetAccordionStatus.getAttribute('aria-expanded') === 'false') {
      targetOfLink.click()
      return
    }

    // Otherwise, open the appropriate accordion
    const targetAccordionID = ebAccordionFindSection(targetOfLink)

    ebAccordionShow(targetAccordionID)

    if (autoCloseAccordionSections === true) {
      ebAccordionHideAllExceptThisOne(targetAccordionID)
    }

    // Now that the target is visible, scroll to it
    targetOfLink.scrollIntoView()
  })
}

function ebAccordionShowDefaultSection () {
  'use strict'
  ebAccordionHideAllExceptThisOne(ebAccordionDefaultAccordionHeadID())
  ebAccordionShow(ebAccordionDefaultAccordionHeadID())
}

function ebAccordionCloseAllButton () {
  'use strict'
  const button = document.querySelector('.accordion-show-all-button')
  button.innerHTML = locales[pageLanguage].accordion['close-all']

  // Close all when clicked
  button.addEventListener('click', function () {
    ebAccordionHideAll()
    ebAccordionShowAllButton()
  })
  // Close all when keyboard is used
  button.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      ebAccordionHideAll()
      ebAccordionShowAllButton()
    }
  })
}

function ebAccordionShowAllButton () {
  'use strict'

  let button
  if (document.querySelector('.accordion-show-all-button')) {
    button = document.querySelector('.accordion-show-all-button')
    button.innerHTML = locales[pageLanguage].accordion['show-all']
  } else {
    const firstSection = document.querySelector(defaultAccordionHead)

    if (firstSection) {
      // Create a wrapper for the button
      const buttonWrapper = document.createElement('div')
      buttonWrapper.classList.add('accordion-show-all-button-wrapper')
      firstSection.insertAdjacentElement('beforebegin', buttonWrapper)

      // Create the button link
      button = document.createElement('a')
      button.classList.add('accordion-show-all-button')
      button.innerHTML = locales[pageLanguage].accordion['show-all']
      button.setAttribute('tabindex', '0')
      buttonWrapper.insertAdjacentElement('afterbegin', button)
    }
  }

  if (button instanceof Element || button instanceof HTMLDocument) {
    // Show all when clicked
    button.addEventListener('click', function () {
      ebAccordionShowAll()
      ebAccordionCloseAllButton()
    })
    // Show all when keyboard access is used
    button.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        ebAccordionShowAll()
        ebAccordionCloseAllButton()
      }
    })
  }
}

function ebAccordify () {
  'use strict'

  // Early exit for older browsers
  if (!ebAccordionInit()) {
    return
  }

  document.body.setAttribute('data-accordion-active', 'true')

  // Exit if there aren't any headings
  const sectionHeadings = document.querySelectorAll(accordionHeads)
  if (!sectionHeadings) {
    return
  }

  ebAccordionSetUpSections(sectionHeadings)

  ebAccordionShowAllButton()

  // If accordion-open-first="false", don't open any sections
  if (document.querySelector('.wrapper').getAttribute('data-accordion-open-first')) {
    if (document.querySelector('.wrapper').getAttribute('data-accordion-open-first') === 'false') {
      return
    }
  }

  // Else if there's no hash, show the first section
  if (!window.location.hash) {
    ebAccordionShowDefaultSection()
    return
  }

  // Else (there is a hash, so) show that section
  ebAccordionHideAll()
  ebAccordionShow()
}

function ebExpand () {
  'use strict'

  // Check for expand-accordion setting on page
  if (ebAccordionPageSetting() === 'expand') {
    ebAccordionShowAll()
  }
}

function ebLoadAccordion () {
  'use strict'
  if (ebAccordionInit()) {
    ebAccordify()
    ebExpand()
    ebAccordionListenForAnchorClicks()
    ebAccordionListenForHeadingClicks()
    ebAccordionListenForNavClicks()
    ebAccordionListenForHashChange()
  }
}

function ebCheckAccordionReady () {
  return (document.body.getAttribute('data-accordion-active') !== 'true' &&
  (document.body.getAttribute('data-index-targets') !== null || settings.dynamicIndexing === false) &&
  document.body.getAttribute('data-ids-assigned') !== null &&
  document.body.getAttribute('data-search-results') !== null)
}

// Wait for data-index-targets to be loaded
// and IDs to be assigned, and any search results to be loaded,
// before applying the accordion.
function ebPrepareForAccordion () {
  'use strict'

  if (ebCheckAccordionReady()) {
    // If the requirements are already met, just go ahead
    ebLoadAccordion()
  } else {
    // Otherwise wait for the requirements
    const accordionObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes') {
          if (ebCheckAccordionReady()) {
            ebLoadAccordion()
          }
        }
      })
    })

    accordionObserver.observe(document.body, {
      attributes: true // Listen for attribute changes
    })
  }
}

window.onload = ebPrepareForAccordion()
