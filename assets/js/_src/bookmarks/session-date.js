/* global sessionStorage */

function ebBookmarksSessionDate () {
  // If a sessionDate has been set,
  // return the current sessionDate
  if (sessionStorage.getItem('sessionDate')) {
    return sessionStorage.getItem('sessionDate')
  } else {
    // create, set and return the session ID
    const sessionDate = Date.now()
    sessionStorage.setItem('sessionDate', sessionDate)
    return sessionDate
  }
}

export default ebBookmarksSessionDate
