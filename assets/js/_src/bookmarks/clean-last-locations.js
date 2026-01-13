/* global localStorage */
import ebBookmarksSessionDate from './session-date'

function ebBookmarksCleanLastLocations (bookTitleToClean) {
  let lastLocations = []

  // Loop through stored bookmarks and add them to the array.
  Object.keys(localStorage).forEach(function (key) {
    if (key.startsWith('bookmark-') && key.includes('-lastLocation-')) {
      const bookmarkBookTitle = JSON.parse(localStorage.getItem(key)).bookTitle
      if (bookTitleToClean === bookmarkBookTitle) {
        lastLocations.push(JSON.parse(localStorage.getItem(key)))
      }
    }
  })

  // Only keep the last two elements:
  // the previous session's lastLocation, and this session's one
  lastLocations = lastLocations.slice(Math.max(lastLocations.length - 2, 0))

  // Sort the lastLocations ascending by the number in their sessionDate
  lastLocations.sort(function (a, b) {
    return parseFloat(a.sessionDate) - parseFloat(b.sessionDate)
  })

  // Get the number of lastLocations that are not the current session
  const previousSessionLocations = lastLocations.filter(function (location) {
    let status = false
    if (location.sessionDate !== ebBookmarksSessionDate()) {
      status = true
    }
    return status
  }).length
  // If there are more than one, drop the first of the lastLocations
  if (previousSessionLocations > 1) {
    lastLocations.splice(0, 1)
  }

  // Remove all localStorage entries for this title except those in lastLocations
  Object.keys(localStorage).forEach(function (key) {
    // Assume we'll discard this item unless it's in lastLocations
    let matches = 0

    if (key.startsWith('bookmark-') && key.includes('-lastLocation-')) {
      const bookmarkBookTitle = JSON.parse(localStorage.getItem(key)).bookTitle
      if (bookTitleToClean === bookmarkBookTitle) {
        lastLocations.forEach(function (lastLocation) {
          if (key.includes(lastLocation.sessionDate)) {
            matches += 1
          }
        })
        if (matches === 0) {
          localStorage.removeItem(key)
        }
      }
    }
  })
}

export default ebBookmarksCleanLastLocations
