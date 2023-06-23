/* global window, ebLazyLoadImages, videoShow
    locales, pageLanguage, Element, HTMLDocument,
    settings, Node, MutationObserver */

// console.log('Debugging accordions.js');

// --------------------------------------------------------------
// Options, defined in _data/settings.yml

// 1. Use CSS selectors to list the headings that will
//    define each accordion section, e.g. '.content h2'
let accordionLevel = settings[settings.site.output].accordion.level
const accordionDataLevelElement = document.querySelector('[data-accordion-level]')
if (accordionDataLevelElement) {
  accordionLevel = accordionDataLevelElement.getAttribute('data-accordion-level')
}
const accordionHeads = '.content ' + accordionLevel

// 2. Which heading's section should we show by default?
const defaultAccordionHead = '.content [role="tabpanel"] ' + accordionLevel + ':first-of-type'

// 3. Auto close last accordion when you open a new one?
const autoCloseAccordionSections = settings[settings.site.output].accordion.autoClose
// --------------------------------------------------------------

// Find where we've set the data-accordion-page flag
const accordionDataPageElement = document.querySelector('[data-accordion-page')

function ebAccordionInit () {
  'use strict'

  let pageAccordionOff

  // Check for no-accordion setting on page
  if (accordionDataPageElement) {
    const accordionPageSetting = accordionDataPageElement.getAttribute('data-accordion-page')
    if (accordionPageSetting &&
                (accordionPageSetting === 'none')) {
      pageAccordionOff = true
    }
  }

  // Check if there are any headings on the page
  // to make into an accordion.
  const availableAccordionHeads = document.querySelectorAll(accordionHeads)
  let noAccordionHeadings = false
  if (!availableAccordionHeads ||
            availableAccordionHeads.length === 0) {
    noAccordionHeadings = true
  }

  return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelectorAll !== 'undefined' &&
            window.addEventListener !== 'undefined' &&
            !!Array.prototype.forEach &&
            !pageAccordionOff &&
            !noAccordionHeadings
}

function ebAccordionPageSetting () {
  'use strict'

  let accordionPageSetting
  if (accordionDataPageElement) {
    accordionPageSetting = accordionDataPageElement.getAttribute('data-accordion-page')
  }
  return accordionPageSetting
}

function ebAccordionDefaultAccordionHeadID () {
  'use strict'

  let defaultAccordionHeadID

  // Get the default accordion section's id
  if (defaultAccordionHead !== '') {
    defaultAccordionHeadID = document.querySelector(defaultAccordionHead).id
    if (!defaultAccordionHeadID) {
      defaultAccordionHeadID = 'defaultAccordionSection'
    }
  }
  return defaultAccordionHeadID
}

function ebAccordionSetUpSections (collapserButtons) {
  'use strict'

  // Exit if there are no accordionHeads
  if (!document.querySelector(accordionHeads)) {
    return
  }

  // add role="tablist" to the parent of the role="tab"s
  const content = document.querySelector('.content')
  content.setAttribute('role', 'tablist')

  // loop through collapserButtons
  collapserButtons.forEach(function (collapserButton) {
    // Only do the rest if if .content is the parent
    // of the collapserButton (i.e. accordion heading).
    // Prevents errors when heading is in a div, e.g. a box.
    if (collapserButton.parentNode === content) {
      // make a section to move the collapsing content into
      const section = document.createElement('section')
      section.setAttribute('role', 'tabpanel')
      section.setAttribute('aria-labelledby', collapserButton.id)
      section.setAttribute('data-accordion-container', collapserButton.id)

      // add the section to the doc
      content.insertBefore(section, collapserButton)

      // make a header, add it to the section
      const header = document.createElement('header')

      //  move the toggle to the header
      header.appendChild(collapserButton)

      // make a link for this id
      const accordionLink = document.createElement('a')
      accordionLink.href = '#' + collapserButton.id
      accordionLink.innerHTML = collapserButton.innerHTML

      // Add the link inside the toggle
      collapserButton.innerHTML = accordionLink.outerHTML
      collapserButton.setAttribute('role', 'tab')

      // add the header to the section
      section.appendChild(header)

      // make a div for the rest of the contents
      const container = document.createElement('div')
      container.setAttribute('data-container', true)

      // add it to the section
      section.appendChild(container)
    }
  })

  ebAccordionFillSections()

  // If there is more than one section,
  // add an 'expand all/close all' button
  if (collapserButtons.length > 1) {
    ebAccordionShowAllButton()
  }
}

function ebAccordionFillSections () {
  'use strict'

  // Grab the individual #contents elements of the page
  const contentItems = document.querySelector('.content').childNodes

  // Put all the items in an array.
  let j; const contentItemsForSections = []
  for (j = 0; j < contentItems.length; j += 1) {
    contentItemsForSections.push(contentItems[j])
  }

  // We don't know where our first section is yet
  let currentSection = false

  // Loop through the content to accordify
  contentItemsForSections.forEach(function (contentItem) {
    // If this is an element (not a text or comment node), and
    // if this is a section, update currentSection, then move on
    if (contentItem.nodeType === Node.ELEMENT_NODE) {
      if (contentItem.getAttribute('role') === 'tabpanel') {
        currentSection = contentItem
        return
      }
    }

    // Have we reached the first section yet? if not, move on
    if (!currentSection) {
      return
    }

    // Otherwise, move it inside the currentSection's data-container
    currentSection.querySelector('[data-container]')
      .appendChild(contentItem)
  })
}

function ebAccordionHideThisSection (targetID) {
  'use strict'

  // console.log('Hiding only section ' + targetID);
  const tabPanel = document.querySelector('[role="tabpanel"][aria-labelledby="' + targetID + '"]')
  tabPanel.querySelector('[role="tab"]')
    .setAttribute('data-accordion', 'closed')
  tabPanel.querySelector('[data-container]')
    .setAttribute('aria-expanded', 'false')
}

function ebAccordionHideAll () {
  'use strict'

  const tabPanels = document.querySelectorAll('[role="tabpanel"]')
  tabPanels.forEach(function (current) {
    current.querySelector('[role="tab"]')
      .setAttribute('data-accordion', 'closed')
    current.querySelector('[data-container]')
      .setAttribute('aria-expanded', 'false')
  })
}

function ebAccordionShowAll () {
  'use strict'

  // console.log('expanding all');

  const tabPanels = document.querySelectorAll('[role="tabpanel"]')
  tabPanels.forEach(function (current) {
    current.querySelector('[role="tab"]')
      .setAttribute('data-accordion', 'open')
    current.querySelector('[data-container]')
      .setAttribute('aria-expanded', 'true')
  })
}

function ebAccordionHideAllExceptThisOne (targetID) {
  'use strict'

  // console.log('Starting ebAccordionHideAllExceptThisOne...');

  const tabPanels = document.querySelectorAll('[role="tabpanel"]')
  tabPanels.forEach(function (tabPanel) {
    // if it's the one we just clicked, skip it
    if (tabPanel.getAttribute('aria-labelledby') === targetID) {
      return
    }

    // otherwise, hide it
    tabPanel.querySelector('[role="tab"]')
      .setAttribute('data-accordion', 'closed')
    tabPanel.querySelector('[data-container]')
      .setAttribute('aria-expanded', 'false')
  })
}

function ebAccordionCheckParent (node) {
  'use strict'

  // if (node !== null) {
  //     console.log('Checking for parent element of "' + node.innerText.substring(0, 20) + '..."');
  // }

  // if there is no parent, or something went wrong, exit
  if (!node) {
    return false
  }
  if (!node.parentNode) {
    return false
  }
  if (node.tagName === 'BODY') {
    // console.log('Parent node is the body element. We\'re done looking.');

    return false
  }

  const nodeParent = node.parentNode

  // console.log('nodeParent is "' + nodeParent.innerText.substring(0, 20) + '..."');

  const parentAttribute = nodeParent.getAttribute('data-accordion-container')

  // if there's a parent, check if it's got data-accordion-container
  // and return that value, which is copied from the id of the section heading
  if (parentAttribute) {
    return nodeParent.getAttribute('data-accordion-container')
  }
  // if (!parentAttribute) {
  //     console.log('Parent node of "' + node.innerText.substring(0, 20) + '..." is not an accordion section');
  // }

  return ebAccordionCheckParent(nodeParent)
}

// find and return containing section
// (the aria-labelledby attribute matches the ID)
function ebAccordionFindSection (targetToCheck) {
  'use strict'

  // if (targetToCheck !== null) {
  //     console.log('Finding section that contains: ' + targetToCheck.outerHTML.substring(0, 80));
  // }

  // work recursively up the DOM looking for the section
  return ebAccordionCheckParent(targetToCheck)
}

function ebWhichTarget (targetID) {
  'use strict'

  // console.log('Starting ebWhichTarget...');

  let targetToCheck

  // if we're given an ID, use it
  if (targetID) {
    // console.log('Using targetID ' + targetID);

    // Decode the targetID URI in case it's not ASCII
    // console.log('targetID encoded: ' + targetID);
    targetID = decodeURIComponent(targetID)
    // console.log('targetID decoded: ' + targetID);

    targetToCheck = document.getElementById(targetID)
  } else {
    // else use the hash
    let trimmedHash = window.location.hash.replace('#', '')

    // Decode the trimmedHash in case it's not ASCII
    // console.log('Using trimmedHash; encoded: ' + trimmedHash);
    trimmedHash = decodeURIComponent(trimmedHash)
    // console.log('using trimmedHash; decoded: ' + trimmedHash);

    targetToCheck = document.getElementById(trimmedHash)
  }

  // if the ID doesn't exist, exit
  if (!targetToCheck) {
    return false
  }

  return targetToCheck
}

function ebAccordionShow (targetID) {
  'use strict'

  // console.log('Starting ebAccordionShow...');
  // console.log('ebAccordionShow\'s targetID is: ' + targetID);

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

  // set the accordion, then work down to toggle and content div
  const sectionTarget = '[aria-labelledby="' + sectionID + '"]'
  const sectionToShow = document.querySelector(sectionTarget)

  // update the tab
  if (sectionToShow) {
    const tab = sectionToShow.querySelector('[role="tab"]')
    tab.setAttribute('data-accordion', 'open')

    // update the tab contents
    const tabContents = sectionToShow.querySelector('[data-container]')
    tabContents.setAttribute('aria-expanded', 'true')

    // lazyload the images inside
    const lazyimages = sectionToShow.querySelectorAll('[data-src]')

    // console.log('lazyimages: ' + lazyimages.innerHTML);

    if (lazyimages.innerHTML !== undefined) {
      ebLazyLoadImages(lazyimages)
    }

    // if we have a slideline in this section, check if it's a portrait one
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

function ebAccordionListenForAnchorClicks (querySelectorString) {
  'use strict'

  // console.log('Starting ebAccordionListenForAnchorClicks...');

  // listen for clicks on *all* the anchors in .content
  // and links in any .search-results-nav list,
  // or those specified by a querySelectorString.
  let allTheAnchors
  if (querySelectorString) {
    allTheAnchors = document.querySelectorAll(querySelectorString)
  } else {
    allTheAnchors = document
      .querySelectorAll('.content a[href], .search-results-nav a[href]')
  }

  allTheAnchors.forEach(function (oneOfTheAnchors) {
    // if it's an external link, exit
    if (oneOfTheAnchors.target === '_blank') {
      return
    }

    oneOfTheAnchors.addEventListener('click', function (event) {
      // If the link was clicked with a modifier key pressed
      // (e.g. Ctrl + click), assume user wants a new tab,
      // and do not continue processing this here.
      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        // console.log('User was pressing Ctrl, Shift or the meta key.');
        return
      }

      // Declare targetID so JSLint knows it's coming in this function.
      let targetID

      // ignore target blank / rel noopener links
      if (event.target.getAttribute('rel') === 'noopener') {
        return
      }

      // get the target ID by removing any file path and the #
      if (event.target.hasAttribute('href')) {
        targetID = event.target.getAttribute('href').replace(/\?.+/, '').replace(/.*#/, '')
        // console.log('The targetID is: ' + targetID);
      } else {
        return
      }
      // if it's an open accordion, close it
      if (event.target.parentNode.getAttribute('data-accordion') === 'open') {
        event.preventDefault()
        ebAccordionHideThisSection(targetID)
        return
      }

      // did we click on a thing that wasn't an accordion?
      // which section / accordion is it inside?
      if (!event.target.parentNode.getAttribute('data-accordion')) {
        // console.log('We clicked on something that is not an accordion. Now to find targetID ' + targetID + ' in the DOM...');

        // find the target of the link in the DOM
        const targetOfLink = document.getElementById(targetID)
        // recursively update targetID until we have a data-accordion
        targetID = ebAccordionFindSection(targetOfLink)
      }

      // now open the right closed accordion
      ebAccordionShow(targetID)
      if (autoCloseAccordionSections === true) {
        ebAccordionHideAllExceptThisOne(targetID)
      }
    })
  })
}

function ebAccordionListenForHeadingClicks () {
  'use strict'

  // also listen for heading clicks
  const allTheToggleHeaders = document.querySelectorAll('[data-accordion]')
  allTheToggleHeaders.forEach(function (oneOfTheToggleHeaders) {
    oneOfTheToggleHeaders.addEventListener('click', function (event) {
      // simulate anchor click
      if (event.target.querySelector('a')) {
        event.target.querySelector('a').click()
      }
    })
  })
}

function ebAccordionListenForNavClicks () {
  'use strict'

  // also listen for nav clicks
  const navLinks = document.querySelectorAll('#nav [href]')
  navLinks.forEach(function (navLink) {
    navLink.addEventListener('click', function (event) {
      // get the section and click to open it if it's closed
      const theTarget = document.getElementById(event.target.hash.replace(/.*#/, ''))
      if (theTarget) {
        const targetSection = document.getElementById(ebAccordionFindSection(theTarget))
        // simulate anchor click, if it's closed
        if (targetSection) {
          if (targetSection.getAttribute('data-accordion') === 'closed') {
            targetSection.querySelector('a').click()
          }
        }
      }
    })
  })
}

function ebAccordionListenForHashChange () {
  'use strict'

  // console.log('Starting ebAccordionListenForHashChange...');

  window.addEventListener('hashchange', function (event) {
    // Don't treat this like a normal click on a link
    event.preventDefault()

    // get the target ID from the hash,
    // removing any query parameters
    let targetID = window.location.hash.replace(/\?.+/, '')
    // console.log('targetID encoded: ' + targetID);

    targetID = decodeURIComponent(targetID)
    // console.log('targetID decoded: ' + targetID);

    // get the target of the link
    const targetOfLink = document.getElementById(targetID.replace(/.*#/, ''))
    // console.log('targetOfLink: ' + targetOfLink.innerHTML);

    // check if it's in the viewport already
    const targetRect = targetOfLink.getBoundingClientRect()
    const targetInViewport = targetRect.top >= -targetRect.height &&
                targetRect.left >= -targetRect.width &&
                targetRect.bottom <= targetRect.height + window.innerHeight &&
                targetRect.right <= targetRect.width + window.innerWidth
    // console.log('targetInViewport of ' + targetOfLink + ": " + targetInViewport);

    // check if it's an accordion
    const targetAccordionStatus = targetOfLink.getAttribute('data-accordion')
    // console.log('targetAccordionStatus: ' + targetAccordionStatus);

    // if it's in the viewport and it's not an accordion, then exit
    if (targetInViewport && !targetAccordionStatus) {
      return
    }

    // if it's an accordion and it's closed, open it / jump to it
    if (targetAccordionStatus === 'closed') {
      targetOfLink.querySelector('a').click()
      return
    }

    // otherwise, open the appropriate accordion
    const targetAccordionID = ebAccordionFindSection(targetOfLink)

    ebAccordionShow(targetAccordionID)
    if (autoCloseAccordionSections === true) {
      // console.log('Hiding other sections...');
      ebAccordionHideAllExceptThisOne(targetAccordionID)
    }
  })
}

function ebAccordionShowDefaultSection () {
  'use strict'
  ebAccordionHideAllExceptThisOne(ebAccordionDefaultAccordionHeadID())
  ebAccordionShow(ebAccordionDefaultAccordionHeadID())
}

// Add a close-all button to close all sections
function ebAccordionCloseAllButton () {
  'use strict'
  const button = document.querySelector('.accordion-show-all-button')
  button.innerHTML = locales[pageLanguage].accordion['close-all']

  // Close all when clicked
  button.addEventListener('click', function () {
    ebAccordionHideAll()
    ebAccordionShowAllButton()
  })
}

// Add an expand-all button to open all sections
function ebAccordionShowAllButton () {
  'use strict'

  let button
  if (document.querySelector('.accordion-show-all-button')) {
    button = document.querySelector('.accordion-show-all-button')
    button.innerHTML = locales[pageLanguage].accordion['show-all']
  } else {
    const firstSection = document.querySelector('section[role="tabpanel"]')

    if (firstSection) {
      // Create a wrapper for the button
      const buttonWrapper = document.createElement('div')
      buttonWrapper.classList.add('accordion-show-all-button-wrapper')
      firstSection.insertAdjacentElement('beforebegin', buttonWrapper)

      // Create the button link
      button = document.createElement('a')
      button.classList.add('accordion-show-all-button')
      button.innerHTML = locales[pageLanguage].accordion['show-all']
      buttonWrapper.insertAdjacentElement('afterbegin', button)
    }
  }

  if (button instanceof Element || button instanceof HTMLDocument) {
    // Show all when clicked
    button.addEventListener('click', function () {
      ebAccordionShowAll()
      ebAccordionCloseAllButton()
    })
  }
}

function ebAccordify () {
  'use strict'

  // Signal that we're loading the accordion
  document.body.setAttribute('data-accordion-active', 'true')

  // exit if there aren't any headings
  const collapserTargets = accordionHeads
  const collapserButtons = document.querySelectorAll(collapserTargets)
  if (!collapserButtons) {
    return
  }

  // exit if this page must not accordify
  const pageHasNoAccordionHeads = (document.querySelector(accordionHeads) === null)
  if (pageHasNoAccordionHeads) {
    return
  }

  ebAccordionSetUpSections(collapserButtons)

  // if there's no hash, show the first section
  // else (there is a hash, so) show that section
  if (!window.location.hash) {
    ebAccordionShowDefaultSection()
    return
  }

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

// Wait for data-index-targets to be loaded
// and IDs to be assigned, and any search results to be loaded,
// before applying the accordion.
function ebPrepareForAccordion () {
  'use strict'

  const accordionObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes') {
        if (document.body.getAttribute('data-accordion-active') !== 'true' &&
                        (document.querySelector('[data-index-targets]') || settings.dynamicIndexing === false) &&
                        document.body.getAttribute('data-ids-assigned') &&
                        document.body.getAttribute('data-search-results')) {
          ebLoadAccordion()
        }
      }
    })
  })

  accordionObserver.observe(document.body, {
    attributes: true // listen for attribute changes
  })
}

window.onload = ebPrepareForAccordion()
