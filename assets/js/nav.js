/* global config, currentUrlPath, ebToggleClickout, locales, pageLanguage, settings */

/**
 * Builds navigation tree recursively from nav items
 */
function ebBuildNavTreeRecursive (navTree, workKey) {
  const ol = document.createElement('ol')

  navTree.forEach(navItem => {
    const li = document.createElement('li')

    // Add class if specified
    if (navItem.class) {
      li.className = navItem.class
    }

    let hasActiveChild = false

    // Create link if file is specified
    if (navItem.file) {
      const link = document.createElement('a')
      const linkPath = `${config.baseUrl}/${workKey}/${navItem.file}.html`
      link.href = linkPath
      link.textContent = navItem.label

      // Check if current path matches this link
      if (currentUrlPath === linkPath || currentUrlPath === `${config.baseUrl}/${workKey}/${navItem.file}`) {
        li.classList.add('active')
      }

      li.appendChild(link)
    } else {
      // Add top level label wrapped in an anchor for styling consistency
      const labelLink = document.createElement('a')
      labelLink.textContent = navItem.label
      li.appendChild(labelLink)
      li.classList.add('no-file')
    }

    // Handle children if they exist - match ebBuildBookChapters structure exactly
    if (navItem.children && navItem.children.length > 0) {
      li.classList.add('has-children')
      const childList = document.createElement('ol')

      navItem.children.forEach(childItem => {
        const childLi = document.createElement('li')

        if (childItem.class) {
          childLi.className = childItem.class
        }

        if (childItem.file) {
          const childLink = document.createElement('a')
          const childLinkPath = `${config.baseUrl}/${workKey}/${childItem.file}.html`
          childLink.href = childLinkPath
          childLink.textContent = childItem.label

          // Check if current path matches this child link
          if (currentUrlPath === childLinkPath || currentUrlPath === `${config.baseUrl}/${workKey}/${childItem.file}`) {
            childLi.classList.add('active')
            hasActiveChild = true
          }

          childLi.appendChild(childLink)
        } else {
          childLi.textContent = childItem.label
        }

        // Handle nested children recursively
        if (childItem.children && childItem.children.length > 0) {
          childLi.classList.add('has-children')
          const nestedTree = ebBuildNavTreeRecursive(childItem.children, workKey)
          childLi.appendChild(nestedTree)

          // Check if any nested child is active
          const activeNestedChildren = nestedTree.querySelectorAll('li.active')
          if (activeNestedChildren.length > 0) {
            hasActiveChild = true
            childLi.classList.add('active')
          }
        }

        childList.appendChild(childLi)
      })

      li.appendChild(childList)

      // If any child is active, make the parent active too
      if (hasActiveChild) {
        li.classList.add('active')
      }
    }

    ol.appendChild(li)
  })

  return ol
}

/**
 * Builds the main book list navigation
 */
function ebBuildBookList () {
  console.log(window.metadata)
  if (window.metadata) {
    const jsBookList = document.querySelector('#nav-js-gen-book-list')
    if (jsBookList) {
      // Clear existing content
      jsBookList.innerHTML = ''

      // Sort works keys for consistent ordering
      const sortedWorks = Object.keys(window.metadata.works).sort()

      sortedWorks.forEach(workKey => {
        const work = window.metadata.works[workKey]

        // Handle translations - check if current page language has this work
        let thisWork
        if (window.pageLanguage && work[pageLanguage]) {
          thisWork = work[pageLanguage]
        } else {
          thisWork = work
        }

        // Check if work is published (skip if not)
        const variant = window.currentVariant || 'default'
        if (thisWork[variant] && thisWork[variant].published === false) {
          return // Skip this work
        }
        if (thisWork.default && thisWork.default.published === false) {
          return // Skip this work
        }

        // Get the navigation tree for this work
        let homeNavWorkTree
        if (thisWork[variant] && thisWork[variant].products && thisWork[variant].products[config.output] && thisWork[variant].products[config.output].nav) {
          homeNavWorkTree = thisWork[variant].products[config.output].nav
        } else if (thisWork.default && thisWork.default.products && thisWork.default.products[config.output] && thisWork.default.products[config.output].nav) {
          homeNavWorkTree = thisWork.default.products[config.output].nav
        } else if (thisWork[variant] && thisWork[variant].products && thisWork[variant].products.web && thisWork[variant].products.web.nav) {
          homeNavWorkTree = thisWork[variant].products.web.nav
        } else if (thisWork.default && thisWork.default.products && thisWork.default.products.web && thisWork.default.products.web.nav) {
          homeNavWorkTree = thisWork.default.products.web.nav
        }

        // Get the start page for this work
        let bookStartPage = 'index'
        if (thisWork[variant] && thisWork[variant].products && thisWork[variant].products[config.output] && thisWork[variant].products[config.output]['start-page']) {
          bookStartPage = thisWork[variant].products[config.output]['start-page']
        } else if (thisWork.default && thisWork.default.products && thisWork.default.products[config.output] && thisWork.default.products[config.output]['start-page']) {
          bookStartPage = thisWork.default.products[config.output]['start-page']
        } else if (thisWork[variant] && thisWork[variant].products && thisWork[variant].products.web && thisWork[variant].products.web['start-page']) {
          bookStartPage = thisWork[variant].products.web['start-page']
        } else if (thisWork.default && thisWork.default.products && thisWork.default.products.web && thisWork.default.products.web['start-page']) {
          bookStartPage = thisWork.default.products.web['start-page']
        }

        // Get the title for this work
        let workTitle
        if (thisWork[variant] && thisWork[variant].title) {
          workTitle = thisWork[variant].title
        } else if (thisWork.default && thisWork.default.title) {
          workTitle = thisWork.default.title
        } else {
          workTitle = workKey
        }

        // Create the list item
        const li = document.createElement('li')

        // Check if books should be expanded
        const expandBooks = settings[config?.output]?.nav?.home?.expandBooks === true
        if (expandBooks) {
          li.classList.add('has-children')
        }

        // Create the main link
        const link = document.createElement('a')
        link.href = `${config.baseUrl}/${workKey}/${bookStartPage}.html`
        link.textContent = workTitle
        li.appendChild(link)

        // If books should be expanded, add the navigation tree - replicate the liquid logic exactly
        if (expandBooks) {
          if (homeNavWorkTree && homeNavWorkTree.length > 0) {
            // Replicate nav-list.html include with nav-tree and directory parameters
            const childTree = ebBuildNavTreeRecursive(homeNavWorkTree, workKey)
            li.appendChild(childTree)
          } else {
            // Replicate nav-list-files.html logic: generate nav from file metadata
            const childOl = document.createElement('ol')

            // Get files for this book from metadata, excluding those with excluded styles
            const bookFiles = window.metadata.files && window.metadata.files[workKey] ? window.metadata.files[workKey] : []

            bookFiles.forEach(page => {
              const childLi = document.createElement('li')
              const childLink = document.createElement('a')
              childLink.href = `${config.baseUrl}/${workKey}/${page.file}.html`
              childLink.textContent = page.title
              childLi.appendChild(childLink)
              childOl.appendChild(childLi)
            })

            if (childOl.children.length > 0) {
              li.appendChild(childOl)
            }
          }
        }

        jsBookList.appendChild(li)
      })
    }
  }
}

/**
 * Builds chapter navigation for the current book
 */
function ebBuildBookChapters () {
  if (window.metadata) {
    Object.keys(window.metadata.works).forEach(work => {
      Object.keys(window.metadata.works[work]).forEach(version => {
        const isDefaultVersion = version === 'default'
        const versionPath = isDefaultVersion ? '' : `/${version}`
        const workPathBase = `${config.baseUrl}/${work}${versionPath}/`

        if (currentUrlPath.startsWith(workPathBase)) {
          const versionNode = window.metadata.works[work][version]
          let webNav = versionNode?.products?.[config.format]?.nav
          if (!isDefaultVersion) {
            webNav = versionNode?.default?.products?.[config.format]?.nav
          }

          if (webNav) {
            const jsNavCont = document.querySelector('#nav-js-gen-book-chapters')
            if (jsNavCont) {
              // Clear existing content
              jsNavCont.innerHTML = ''

              // Iterate through nav items and create li elements
              webNav.forEach(navItem => {
                const li = document.createElement('li')

                // Add class if specified
                if (navItem.class) {
                  li.className = navItem.class
                }

                let hasActiveChild = false

                // Create link if file is specified
                if (navItem.file) {
                  const link = document.createElement('a')
                  const linkPath = `${workPathBase}${navItem.file}.html`
                  link.href = linkPath
                  link.textContent = navItem.label

                  // Check if current path matches this link
                  if (currentUrlPath === linkPath || currentUrlPath === `${workPathBase}${navItem.file}`) {
                    li.classList.add('active')
                  }

                  li.appendChild(link)
                } else {
                  // Add top level label wrapped in an anchor for styling consistency
                  const labelLink = document.createElement('a')
                  labelLink.textContent = navItem.label
                  li.appendChild(labelLink)
                  li.classList.add('no-file')
                }

                // Handle children if they exist
                if (navItem.children && navItem.children.length > 0) {
                  li.classList.add('has-children')
                  const childList = document.createElement('ol')

                  navItem.children.forEach(childItem => {
                    const childLi = document.createElement('li')

                    if (childItem.class) {
                      childLi.className = childItem.class
                    }

                    if (childItem.file) {
                      const childLink = document.createElement('a')
                      const childLinkPath = `${workPathBase}${childItem.file}.html`
                      childLink.href = childLinkPath
                      childLink.textContent = childItem.label

                      // Check if current path matches this child link
                      if (currentUrlPath === childLinkPath || currentUrlPath === `${workPathBase}${childItem.file}`) {
                        childLi.classList.add('active')
                        hasActiveChild = true
                      }

                      childLi.appendChild(childLink)
                    } else {
                      childLi.textContent = childItem.label
                    }

                    childList.appendChild(childLi)
                  })

                  li.appendChild(childList)

                  // If any child is active, make the parent active too
                  if (hasActiveChild) {
                    li.classList.add('active')
                  }
                }

                jsNavCont.appendChild(li)
              })
            }
          }
        }
      })
    })
  }
}

/**
 * Sets up navigation behavior (mobile menu, toggles, etc.)
 */
function ebNavBehaviour () {
  // Let Opera Mini use the footer-anchor pattern
  if (navigator.userAgent.indexOf('Opera Mini') === -1) {
    // Let newer browsers use js-powered menu
    if (document.querySelector !== 'undefined' && window.addEventListener) {
      // Set js nav class
      document.documentElement.classList.add('js-nav')

      // Set up the variables
      const menuLink = document.querySelector('[href="#nav"]')
      const menu = document.querySelector('#nav')

      // Hide the menu until we click the link
      menu.classList.add('visuallyhidden')

      // Add a close button
      let closeButton = '<button data-toggle data-nav-close aria-label="' + locales[pageLanguage].input.close + '">'
      closeButton += '<span class="visuallyhidden">' + locales[pageLanguage].input.close + '</span>'
      closeButton += '</button>'
      menu.insertAdjacentHTML('afterBegin', closeButton)

      // Hide the children and add the button for toggling
      const subMenus = document.querySelectorAll('#nav .has-children, #nav .has-children')
      let showChildrenButton = '<button data-toggle data-toggle-nav aria-label="' + locales[pageLanguage].controls['show-hide'] + '">'
      showChildrenButton += '<span class="visuallyhidden">' + locales[pageLanguage].controls['show-hide'] + '</span>'
      showChildrenButton += '</button>'

      for (let i = 0; i < subMenus.length; i += 1) {
        const oUL = subMenus[i].querySelector('ol, ul')
        if (oUL) {
          oUL.classList.add('visuallyhidden')
          subMenus[i].querySelector('a, .docs-list-title').insertAdjacentHTML('afterend', showChildrenButton)
        }
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

      // Show the menu when we click the link
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

      // Listen for clicks inside the menu
      menu.addEventListener('click', function (ev) {
        const clickedElement = ev.target || ev.srcElement

        // Hide the menu when we click the button
        if (clickedElement.hasAttribute('data-nav-close')) {
          ev.preventDefault()
          ebToggleClickout(menu, function () {
            ebHideMenu()
          })
          return
        }

        // Show the children when we click a .has-children
        if (clickedElement.hasAttribute('data-toggle-nav')) {
          ev.preventDefault()
          clickedElement.classList.toggle('show-children')
          clickedElement.nextElementSibling.classList.toggle('visuallyhidden')
          return
        }

        // If it's an anchor with an href (an in-page link)
        if (clickedElement.tagName === 'A' && clickedElement.getAttribute('href')) {
          ebToggleClickout(menu, function () {
            ebHideMenu()
          })
          return
        }

        // If it's an anchor without an href (a nav-only link)
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

// Initialize navigation
ebBuildBookList()
ebBuildBookChapters()
ebNavBehaviour()
