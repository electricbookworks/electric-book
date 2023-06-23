const ebSlideSupports = function () {
  'use strict'
  return navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== 'undefined' &&
            window.addEventListener !== 'undefined' &&
            window.onhashchange !== 'undefined' &&
            !!Array.prototype.forEach &&
            document.querySelectorAll('.slides')
}

const ebSlidesMoveSummaryMeta = function (slidelines) {
  'use strict'

  slidelines.forEach(function (slideline) {
    const summary = slideline.querySelector('.summary')

    let summaryCaption, summarySubCaption, summaryFigureSource

    // You choose: use the title or the caption for the summary
    const summaryUseTitle = false
    if (summaryUseTitle === true) {
      // get the summary's .title, .caption and .figure-source
      summaryCaption = summary.querySelector('.title')
      summarySubCaption = summary.querySelector('.caption')
      summaryFigureSource = summary.querySelector('.figure-source')
    } else {
      // get the summary's .caption and .figure-source
      summaryCaption = summary.querySelector('.caption')
      summarySubCaption = ''
      summaryFigureSource = summary.querySelector('.figure-source')
    }

    // create a new div to put them in
    const summaryMeta = document.createElement('div')
    summaryMeta.classList.add('figure-summary-meta')

    // If they exist, move them both to after the slideline
    // (To put the caption and source somewhere else,
    // move them using insertAdjacentHTML, which takes
    // beforebegin, afterbegin, beforeend, or afterend as params.)
    if (summaryCaption !== null && summaryCaption !== '') {
      summaryMeta.insertAdjacentHTML('beforeend', summaryCaption.outerHTML)
    }
    if (summarySubCaption !== null && summarySubCaption !== '') {
      summaryMeta.insertAdjacentHTML('beforeend', summarySubCaption.outerHTML)
    }
    if (summaryFigureSource !== null && summaryFigureSource !== '') {
      summaryMeta.insertAdjacentHTML('beforeend', summaryFigureSource.outerHTML)
    }

    // Put the summary meta at the end of the slideline
    slideline.insertAdjacentHTML('beforeend', summaryMeta.outerHTML)

    // add the summary id to the slideline
    slideline.id = summary.id

    // remove the summary figure
    slideline.removeChild(summary)
  })
}

function ebTruncateText (text, maxLength) {
  'use strict'
  let string = text
  if (string.length > maxLength) {
    string = string.substring(0, maxLength) + '…'
  }
  return string
}

const ebSlidesBuildNav = function (slidelines) {
  'use strict'
  slidelines.forEach(function (slideline) {
    // get all the figures
    const figures = slideline.querySelectorAll('.figure')
    const figuresCount = figures.length

    // make the slide nav
    let slideNavigationInsert = ''
    slideNavigationInsert += '<nav class="nav-slides'
    if (figuresCount > 4) {
      slideNavigationInsert += ' nav-slides-many'
      if (figuresCount > 6) {
        slideNavigationInsert += ' nav-slides-many-many'
      }
    }
    slideNavigationInsert += '">'

    slideNavigationInsert += '<ol>'

    figures.forEach(function (figure) {
      slideNavigationInsert += '<li>'
      slideNavigationInsert += '<a href="#' + figure.id + '">'

      // add thumbnail

      // if no image, use the figure title
      if (figure.querySelector('.figure-images img')) {
        const thumb = figure.querySelector('.figure-images img').cloneNode()
        thumb.removeAttribute('srcset')
        thumb.removeAttribute('sizes')
        thumb.setAttribute('alt', '')
        slideNavigationInsert += thumb.outerHTML
      } else {
        console.log('Adding thumbnail image for ' + figure.querySelector('.figure-reference').innerText)
        let thumbText = figure.querySelector('.figure-body .title').innerText
        thumbText = ebTruncateText(thumbText, 8)
        slideNavigationInsert += '<span class="slide-thumbnail-text">'
        slideNavigationInsert += thumbText
        slideNavigationInsert += '</span>'
      }

      slideNavigationInsert += '</a>'
      slideNavigationInsert += '</li>'
    })

    slideNavigationInsert += '</ol>'
    slideNavigationInsert += '</nav>'

    slideline.insertAdjacentHTML('afterbegin', slideNavigationInsert)
  })
}

const ebResetSlides = function (slidelines) {
  'use strict'
  slidelines.forEach(function (slideline) {
    // get all the figures, hide them
    const figures = slideline.querySelectorAll('.figure')

    figures.forEach(function (slideline) {
      slideline.classList.add('visuallyhidden')
    })

    // get the slide nav items, hide them
    const slideNavItems = slideline.previousElementSibling.querySelectorAll('.nav-slides li')
    slideNavItems.forEach(function (slideline) {
      slideline.classList.remove('slide-current')
    })
  })
}

const ebSlidesShowFirstInSlideline = function (slideline) {
  'use strict'
  // find the first figure and show it
  const figures = slideline.querySelectorAll('.figure')
  figures[0].classList.remove('visuallyhidden')
}

const ebSlidesShowFirst = function (slidelines) {
  'use strict'
  slidelines.forEach(function (slideline) {
    ebSlidesShowFirstInSlideline(slideline)
  })
}

const ebSlidesMarkNavUpToCurrent = function (slideline) {
  'use strict'
  const navItems = slideline.querySelectorAll('.nav-slides li')
  let hitCurrent = false

  navItems.forEach(function (navItem) {
    if (hitCurrent) {
      return
    }

    if (navItem.classList.contains('slide-current')) {
      hitCurrent = true
      return
    }

    navItem.classList.add('slide-current')
  })
}

const ebSlidesShow = function (slidelines) {
  'use strict'

  // check for hash
  if (!window.location.hash) {
    ebSlidesShowFirst(slidelines)
    return
  }

  const sanitisedTargetHash = decodeURIComponent(window.location.hash.replace(':', '\\:'))
  // check if it starts with a number, after the #
  // (which means querySelector(sanitisedTargetHash) will return an error)
  if (!isNaN(sanitisedTargetHash[1])) {
    ebSlidesShowFirst(slidelines)
    return
  }

  slidelines.forEach(function (slideline) {
    // check if hash is in this slideline
    if (!slideline.querySelector(sanitisedTargetHash)) {
      ebSlidesShowFirstInSlideline(slideline)
      return
    }

    // show the target slideline
    slideline.querySelector(sanitisedTargetHash)
      .classList.remove('visuallyhidden')

    // reset the slide-current
    slideline.querySelectorAll('.nav-slides li').forEach(function (navItem) {
      navItem.classList.remove('slide-current')
    })

    // mark the current one with slide-current
    const selector = '.nav-slides [href="' + sanitisedTargetHash + '"]'
    const targetLinkElement = slideline.querySelector(selector)
    targetLinkElement.setAttribute('tabindex', 0)
    targetLinkElement.focus()

    const targetParent = targetLinkElement.parentNode
    targetParent.classList.add('slide-current')

    // mark all the ones up to the current one
    ebSlidesMarkNavUpToCurrent(slideline)
  })
}

const ebSlidesKeyDown = function () {
  'use strict'
  // listen for key movements
  window.addEventListener('keydown', function (ev) {
    const keyCode = ev.key || ev.which
    const clickedElement = ev.target || ev.srcElement

    if (document.querySelector('.slides ' + clickedElement.hash)) {
      if ((keyCode === 'ArrowLeft' ||
                    keyCode === 37 ||
                    keyCode === 'ArrowUp' ||
                    keyCode === 38) &&
                    clickedElement.parentNode.previousElementSibling) {
        ev.preventDefault()
        clickedElement.parentNode.previousElementSibling
          .querySelector('a').click()
      } else if ((keyCode === 'ArrowRight' ||
                    keyCode === 39 ||
                    keyCode === 'ArrowDown' ||
                    keyCode === '40') &&
                    clickedElement.parentNode.nextElementSibling) {
        ev.preventDefault()
        clickedElement.parentNode.nextElementSibling
          .querySelector('a').click()
      }
    }
  })
}

const ebSlidesAlreadyShown = function () {
  'use strict'

  // get all the nav slide links
  const navSlides = document.querySelectorAll('.nav-slides a')

  navSlides.forEach(function (navSlide) {
    // listen for clicks on each nav slide link
    navSlide.addEventListener('click', function (ev) {
      const itsCurrentlyHidden = document.querySelector(this.getAttribute('href'))
        .classList.contains('visuallyhidden')

      // if it's currently shown, stop the anchor's jump
      if (!itsCurrentlyHidden) {
        ev.preventDefault()
      }
    })
  })
}

const ebSlides = function () {
  'use strict'
  if (!ebSlideSupports()) {
    return
  }

  // get all the slidelines
  const slidelines = document.querySelectorAll('.slides')

  // move the summary meta
  ebSlidesMoveSummaryMeta(slidelines)

  // build the nav
  ebSlidesBuildNav(slidelines)

  // get, then hide, the figures and slide nav items
  ebResetSlides(slidelines)

  // show slide from hash
  ebSlidesShow(slidelines)

  // prevent jump when clicking already shown slides
  ebSlidesAlreadyShown()

  // listen for hashchanges
  window.addEventListener('hashchange', function () {
    // get, then hide, the figures and slide nav items
    ebResetSlides(slidelines)

    // show slide from hash
    ebSlidesShow(slidelines)
  })

  // listen for keys
  ebSlidesKeyDown()
}

ebSlides()
