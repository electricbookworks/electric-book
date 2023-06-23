/* global ebToggleClickout */

function ebNav () {
  'use strict'

  // let Opera Mini use the footer-anchor pattern
  if (navigator.userAgent.indexOf('Opera Mini') === -1) {
    // let newer browsers use js-powered menu
    if (document.querySelector !== 'undefined' &&
                window.addEventListener) {
      // set js nav class
      document.documentElement.classList.add('js-nav')

      // set up the variables
      const menuLink = document.querySelector('[href="#nav"]')
      const menu = document.querySelector('#nav')

      // hide the menu until we click the link
      menu.classList.add('visuallyhidden')

      // add a close button
      let closeButton = '<button data-toggle data-nav-close>'
      closeButton += '<span class="visuallyhidden">Close menu</span>'
      closeButton += '</button>'
      menu.insertAdjacentHTML('afterBegin', closeButton)

      // hide the children and add the button for toggling
      const subMenus = document
        .querySelectorAll('#nav .has-children, #nav .has-children')
      let showChildrenButton = '<button data-toggle data-toggle-nav>'
      showChildrenButton += '<span class="visuallyhidden">Toggle</span>'
      showChildrenButton += '</button>'
      let i
      for (i = 0; i < subMenus.length; i += 1) {
        subMenus[i].querySelector('ol, ul').classList.add('visuallyhidden')
        subMenus[i].querySelector('a, .docs-list-title')
          .insertAdjacentHTML('afterend', showChildrenButton)
      }

      // Mark parents of active children active too
      const activeChildren = menu.querySelectorAll('li.active')
      let j, equallyActiveParent
      for (j = 0; j < activeChildren.length; j += 1) {
        equallyActiveParent = activeChildren[j].closest('li:not(.active)')
        if (equallyActiveParent && equallyActiveParent !== 'undefined') {
          equallyActiveParent.classList.add('active')
        }
      }

      // show the menu when we click the link
      menuLink.addEventListener('click', function (ev) {
        ev.preventDefault()
        ebToggleClickout(menu, function () {
          menu.classList.toggle('visuallyhidden')
          document.documentElement.classList.toggle('js-nav-open')
        })
      }, true)

      const ebHideMenu = function () {
        menu.classList.add('visuallyhidden')
        document.documentElement.classList.remove('js-nav-open')
      }

      // listen for clicks inside the menu
      menu.addEventListener('click', function (ev) {
        const clickedElement = ev.target || ev.srcElement

        // hide the menu when we click the button
        if (clickedElement.hasAttribute('data-nav-close')) {
          ev.preventDefault()
          ebToggleClickout(menu, function () {
            ebHideMenu()
          })
          return
        }

        // show the children when we click a .has-children
        if (clickedElement.hasAttribute('data-toggle-nav')) {
          ev.preventDefault()
          clickedElement.classList.toggle('show-children')
          clickedElement.nextElementSibling.classList.toggle('visuallyhidden')
          return
        }

        // if it's an anchor with an href (an in-page link)
        if (clickedElement.tagName === 'A' && clickedElement.getAttribute('href')) {
          ebToggleClickout(menu, function () {
            ebHideMenu()
          })
          return
        }

        // if it's an anchor without an href (a nav-only link)
        if (clickedElement.tagName === 'A') {
          clickedElement.nextElementSibling.classList.toggle('show-children')
          clickedElement.nextElementSibling.nextElementSibling.classList.toggle('visuallyhidden')
        }
      })

      // This enables a back button, e.g. for where we don't have a
      // browser or hardware back button, and we have Jekyll add one.
      // This button is hidden in scss with `$nav-bar-back-button-hide: true;`.
      // If the user has navigated (i.e. there is a document referrer),
      // listen for clicks on our back button and go back when clicked.
      // We check history.length > 2 because new tab plus landing page
      // can constitute 2 entries in the history (varies by browser).
      let navBackButton
      if (document.referrer !== '' || window.history.length > 2) {
        navBackButton = document.querySelector('a.nav-back-button')
        if (navBackButton) {
          navBackButton.addEventListener('click', function (ev) {
            ev.preventDefault()
            window.history.back()
          })
        }
      } else {
        navBackButton = document.querySelector('a.nav-back-button')
        if (navBackButton) {
          navBackButton.parentNode.removeChild(navBackButton)
        }
      }
    }
  }
}

ebNav()
