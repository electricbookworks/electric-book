function ebColorPanels () {
  'use strict'

  if (document.querySelector('.color-panel')) {
    const colorPanels = document.querySelectorAll('.color-panel')

    colorPanels.forEach(function (panel) {
      let backgroundHex, textHex, linksHex
      panel.classList.forEach(function (classname) {
        if (classname.startsWith('background-')) {
          backgroundHex = classname.split('-').pop()
          panel.style.backgroundColor = '#' + backgroundHex
        }
        if (classname.startsWith('text-')) {
          textHex = classname.split('-').pop()
          panel.style.color = '#' + textHex
        }
        if (classname.startsWith('links-')) {
          linksHex = classname.split('-').pop()
          const links = panel.querySelectorAll('a')
          links.forEach(function (link) {
            link.style.color = '#' + linksHex
          })
        }
      })
    })
  }
}

// Go
ebColorPanels()
