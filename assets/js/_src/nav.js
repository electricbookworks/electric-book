import { ebToggleClickout, currentUrlPath } from './utilities'
import { locales, pageLanguage } from './locales'
import config from '../../../_config.yml'
let marked = null
if (process.env.output !== 'print-pdf' && process.env.output !== 'screen-pdf') {
  marked = (await import('marked')).marked
}
const settings = process.env.settings

/**
 * Processes markdown in text using marked.js.
 * @param {string} text - The text to process.
 * @returns {string} The HTML string with markdown processed.
 */
function ebNavProcessMarkdown (text) {
  if (typeof marked !== 'undefined' && marked.parseInline) {
    try {
      // Use parseInline for simple inline markdown (no block-level elements).
      return marked.parseInline(text)
    } catch (error) {
      console.warn('Error processing markdown:', error)
      return text
    }
  }
  return text
}

/**
 * Creates a link element for a navigation item.
 * @param {object} item - The navigation item data.
 * @param {string} basePath - The base URL path for the link.
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function ebNavCreateLink (item, basePath) {
  const link = document.createElement('a')
  const linkPath = item.file ? `${basePath}/${item.file}.html` : '#'

  link.href = linkPath
  link.innerHTML = ebNavProcessMarkdown(item.label)

  // For items without a file, prevent default click behavior.
  if (!item.file) {
    link.addEventListener('click', (e) => e.preventDefault())
  }
  return link
}

/**
 * Builds a navigation tree of <li> elements recursively from a data array.
 * @param {Array} navTree - The array of navigation items.
 * @param {string} basePath - The base URL path to prepend to file links.
 * @param {boolean} areChildren - Indicates if the current list items are children.
 * @returns {HTMLOListElement|HTMLLIElement[]} The generated <li> elements optionally appended into an <ol> if areChildren is true.
 */
function ebNavBuildTreeRecursive (navTree, basePath, areChildren = true) {
  const ol = document.createElement('ol')
  const items = []

  navTree.forEach(item => {
    const li = document.createElement('li')
    if (item.class) {
      li.className = item.class
    }

    if (!item.file) {
      li.classList.add('no-file')
    }
    const link = ebNavCreateLink(item, basePath)
    li.appendChild(link)

    // Check if the current item is active. Handles both .html and extensionless URLs.
    // Use getAttribute to get the raw href value for initial check,
    // because link.href returns relative value to window location,
    // so '#' becomes '{window.location}#', which we don't want.
    const linkHref = link.getAttribute('href')
    const linkPath = linkHref !== '#' && linkHref !== '' ? new URL(link.href).pathname : '#'
    if (currentUrlPath === linkPath || currentUrlPath === linkPath.replace('.html', '')) {
      li.classList.add('active')
    }

    // Handle children recursively.
    if (item.children && item.children.length > 0) {
      li.classList.add('has-children')
      const nestedTree = ebNavBuildTreeRecursive(item.children, basePath) // Recursive call
      li.appendChild(nestedTree)

      // If a child is active, make the parent active too.
      if (nestedTree.querySelector('li.active')) {
        li.classList.add('active')
      }
    }
    ol.appendChild(li)
    items.push(li)
  })
  return areChildren ? ol : items
}

/**
 * Generates a navigation <ol> from a list of file data.
 * @param {Array} files - The files for a given book.
 * @param {string} basePath - The base URL for the links.
 * @returns {HTMLOListElement|null} The generated list or null if empty.
 */
function ebNavGenerateTreeFromFiles (files, basePath) {
  if (!files || files.length === 0) return null

  const ol = document.createElement('ol')
  files.forEach(page => {
    // Skip index files as they shouldn't appear in navigation.
    if (page.file === 'index') return

    const li = document.createElement('li')
    const link = document.createElement('a')
    link.href = `${basePath}/${page.file}.html`
    link.innerHTML = ebNavProcessMarkdown(page.title)
    li.appendChild(link)
    ol.appendChild(li)
  })

  return ol.children.length > 0 ? ol : null
}

/**
 * Safely retrieves a nested property from a work object with multiple fallbacks.
 * @param {object} workData - The work object.
 * @param {string} variant - The current variant (e.g., 'default').
 * @param {Array<string>} keys - The property path to retrieve (e.g., ['products', 'web', 'nav']).
 * @returns {any|undefined} The found property or undefined.
 */
function ebNavGetWorkProperty (workData, variant, keys) {
  const pathsToTry = [
    [variant, ...keys],
    ['default', ...keys]
  ]

  for (const path of pathsToTry) {
    const value = path.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : undefined, workData)
    if (value !== undefined) return value
  }
  return undefined
}

/**
 * Builds the main book list navigation based on process.env.works and current URL.
 */
function ebNavBuildBookList () {
  if (!process.env.works) return

  const jsBookList = document.querySelector('#nav-js-gen-book-list')
  if (!jsBookList) return
  jsBookList.innerHTML = ''

  const sortedWorks = Object.keys(process.env.works).sort()

  // Determine context: are we on a variant landing page?
  const variantLandingPattern = new RegExp(`^${config.baseurl}/([^/]+)/index(?:\\.html)?$`)
  const variantLandingMatch = currentUrlPath.match(variantLandingPattern)
  const isVariantLandingPage = !!variantLandingMatch
  const currentVariant = isVariantLandingPage ? variantLandingMatch[1] : (window.currentVariant || 'default')

  sortedWorks.forEach(workKey => {
    const work = process.env.works[workKey]
    let workData

    if (isVariantLandingPage) {
      if (!work[currentVariant]) return
      workData = work[currentVariant]
    } else {
      workData = work[pageLanguage] || work
    }

    const displayData = workData.default || workData
    if (displayData.published === false) return

    // Use helpers to get data with fallbacks.
    const workTitle = ebNavGetWorkProperty(workData, currentVariant, ['title']) || workKey
    const navTree = ebNavGetWorkProperty(workData, currentVariant, ['products', process.env.output, 'nav']) ||
                    ebNavGetWorkProperty(workData, currentVariant, ['products', 'web', 'nav'])

    const li = document.createElement('li')
    const link = document.createElement('a')

    if (isVariantLandingPage) {
      link.innerHTML = ebNavProcessMarkdown(workTitle)
      li.classList.add('no-file')
    } else {
      const startPage = ebNavGetWorkProperty(workData, currentVariant, ['products', process.env.output, 'start-page']) ||
                        ebNavGetWorkProperty(workData, currentVariant, ['products', 'web', 'start-page']) ||
                        'index'
      link.href = `${config.baseurl}/${workKey}/${startPage}.html`
      link.innerHTML = ebNavProcessMarkdown(workTitle)
    }
    li.appendChild(link)

    // Build children if nav exists or if books should be expanded.
    const expandBooks = !isVariantLandingPage && settings[process.env.output]?.nav?.home['expand-books'] === true

    if (isVariantLandingPage || expandBooks) {
      let childTree
      const basePath = isVariantLandingPage
        ? `${config.baseurl}/${workKey}/${currentVariant}`
        : `${config.baseurl}/${workKey}`

      if (navTree && navTree.length > 0) {
        childTree = ebNavBuildTreeRecursive(navTree, basePath)
      } else {
        // TODO: fix files inclusion
        const bookFiles = process.env.files[workKey]
        childTree = ebNavGenerateTreeFromFiles(bookFiles, basePath)
      }

      if (childTree) {
        li.appendChild(childTree)
        li.classList.add('has-children')
      }
    }
    jsBookList.appendChild(li)
  })
}

/**
 * Builds chapter navigation for the current book.
 */
function ebNavBuildBookChapters () {
  if (!process.env.works) return

  const jsNavCont = document.querySelector('#nav-js-gen-book-chapters')
  if (!jsNavCont) return

  Object.keys(process.env.works).forEach(work => {
    Object.keys(process.env.works[work]).forEach(version => {
      const versionPath = version === 'default' ? '' : `/${version}`
      const workPathBase = `${config.baseurl}/${work}${versionPath}`

      if (currentUrlPath.startsWith(workPathBase)) {
        const versionNode = process.env.works[work][version]
        const navTree = versionNode?.products?.[process.env.output]?.nav ||
                        versionNode?.default?.products?.[process.env.output]?.nav

        if (navTree) {
          jsNavCont.innerHTML = ''
          const items = ebNavBuildTreeRecursive(navTree, workPathBase, false)
          items.forEach(item => jsNavCont.appendChild(item))
        }
      }
    })
  })
}

/**
 * Sets up navigation behavior (mobile menu, toggles, etc.).
 */
function ebNavBehaviour () {
  if (navigator.userAgent.indexOf('Opera Mini') > -1) {
    return
  }

  if (document.querySelector && window.addEventListener) {
    document.documentElement.classList.add('js-nav')

    const menuLink = document.querySelector('[href="#nav"]')
    const menu = document.querySelector('#nav')
    if (!menuLink || !menu) return

    menu.classList.add('visuallyhidden')

    // Add a close button.
    let closeButton = `<button data-toggle data-nav-close aria-label="${locales[pageLanguage].input.close}">`
    closeButton += `<span class="visuallyhidden">${locales[pageLanguage].input.close}</span></button>`
    menu.insertAdjacentHTML('afterbegin', closeButton)

    // Add toggle buttons for sub-menus.
    const subMenus = document.querySelectorAll('#nav .has-children')
    let showChildrenButton = `<button data-toggle data-toggle-nav aria-label="${locales[pageLanguage].controls['show-hide']}">`
    showChildrenButton += `<span class="visuallyhidden">${locales[pageLanguage].controls['show-hide']}</span></button>`

    subMenus.forEach(subMenu => {
      const list = subMenu.querySelector('ol, ul')
      if (list) {
        list.classList.add('visuallyhidden')
        subMenu.querySelector('a, .docs-list-title').insertAdjacentHTML('afterend', showChildrenButton)
      }
    })

    // Mark parents of active children as active.
    menu.querySelectorAll('li.active').forEach(activeChild => {
      const parentLi = activeChild.closest('li.has-children:not(.active)')
      if (parentLi) {
        parentLi.classList.add('active')
      }
    })

    const ebNavHideMenu = () => {
      menu.classList.add('visuallyhidden')
      document.documentElement.classList.remove('js-nav-open')
    }

    menuLink.addEventListener('click', (ev) => {
      ev.preventDefault()
      ebToggleClickout(menu, () => {
        menu.classList.toggle('visuallyhidden')
        document.documentElement.classList.toggle('js-nav-open')
      })
    }, true)

    menu.addEventListener('click', (ev) => {
      const clickedElement = ev.target
      if (!clickedElement) return

      if (clickedElement.closest('[data-nav-close]')) {
        ev.preventDefault()
        ebToggleClickout(menu, ebNavHideMenu)
      } else if (clickedElement.closest('[data-toggle-nav]')) {
        ev.preventDefault()
        const toggle = clickedElement.closest('[data-toggle-nav]')
        toggle.classList.toggle('show-children')
        toggle.nextElementSibling.classList.toggle('visuallyhidden')
      } else if (clickedElement.tagName === 'A' && clickedElement.getAttribute('href') && clickedElement.getAttribute('href') !== '#') {
        ebToggleClickout(menu, ebNavHideMenu)
      } else if (clickedElement.tagName === 'A') {
        const toggle = clickedElement.nextElementSibling
        if (toggle && toggle.matches('[data-toggle-nav]')) {
          toggle.click()
        }
      }
    })

    const navBackButton = document.querySelector('a.nav-back-button')
    if (navBackButton) {
      if (document.referrer !== '' || window.history.length > 2) {
        navBackButton.addEventListener('click', (ev) => {
          ev.preventDefault()
          window.history.back()
        })
      } else {
        navBackButton.parentNode.removeChild(navBackButton)
      }
    }
  }
}

export default function ebNav () {
  ebNavBuildBookList()
  ebNavBuildBookChapters()
  ebNavBehaviour()
}
