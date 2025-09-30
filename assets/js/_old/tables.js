function ebPositionTable (tableWrapper) {
  'use strict'

  // Get the table
  const table = tableWrapper.querySelector('table')

  // Reset table positioning
  table.style.transform = 'none'
  table.classList.remove('scrolling-table')

  // Get widths for responsiveness calculations
  const tableWrapperWidth = tableWrapper.getBoundingClientRect().width
  const tableWidth = table.getBoundingClientRect().width
  const bodyWidth = document.body.getBoundingClientRect().width
  const remainingWidth = bodyWidth - tableWidth
  const shiftLeftToCenter = (tableWidth - tableWrapperWidth) / 2

  // Center the table in the screen area
  // if it's wider than the text area, and
  // there is space left and right to shift into.
  if (tableWidth > tableWrapperWidth &&
            remainingWidth > 0) {
    table.style.transform = 'translateX(-' + shiftLeftToCenter + 'px)'
  }

  // If the table is wider than the viewport,
  // add class `responsive-table` so we can scroll with CSS.
  if (remainingWidth < 0) {
    table.classList.add('scrolling-table')
  }
}

function ebPositionAllTables () {
  'use strict'

  const tableWrappers = document.querySelectorAll('.table-wrapper')

  let i
  for (i = 0; i < tableWrappers.length; i += 1) {
    ebPositionTable(tableWrappers[i])
  }
}

// Only resize tables when resizing has stopped for 1s
function ebPositionTablesWhenResizingCompletes () {
  'use strict'
  let resizeTimeout
  clearInterval(resizeTimeout)
  resizeTimeout = setTimeout(ebPositionAllTables, 1000)
}

function ebTables () {
  'use strict'

  const supported = navigator.userAgent.indexOf('Opera Mini') === -1 &&
            document.querySelector !== undefined &&
            !!Array.prototype.forEach

  if (!supported) {
    return
  }

  const tables = document.querySelectorAll('.figure table')

  tables.forEach(function (table) {
    // make the wrapper and add a class
    const tableWrapper = document.createElement('div')
    tableWrapper.classList.add('table-wrapper')

    // add the wrapper to the DOM
    table.parentNode.insertBefore(tableWrapper, table)

    // move the table inside the wrapper
    tableWrapper.appendChild(table)

    // Position the table
    ebPositionTable(tableWrapper)
  })

  // Listen for changes to screen size. If sizes changes,
  // reposition the tables.
  window.addEventListener('resize', ebPositionTablesWhenResizingCompletes)
}

ebTables()
