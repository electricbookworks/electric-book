import ebBookmarksSetBookmark from './set-bookmark'
import ebBookmarksElementID from './element-id'

function ebBookmarksSetLastLocation () {
  // beforeunload isn't supported on iOS Safari
  // So we set the lastLocation every 5 seconds.
  window.setInterval(function () {
    if (ebBookmarksElementID()) {
      ebBookmarksSetBookmark('lastLocation', document.getElementById(ebBookmarksElementID()))
    }
  }, 5000)
}

export default ebBookmarksSetLastLocation
