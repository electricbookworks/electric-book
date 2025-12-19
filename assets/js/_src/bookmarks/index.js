// This is a script for managing a user's bookmarks.
// This script waits for setup.js to give elements IDs.
// Then it checks local storage for stored bookmarks,
// and does some housekeeping (e.g. deleting old last-location bookmarks).

// It then reads bookmarks from local storage, and marks the
// relevant bookmarked elements on the page with attributes.
// It then creates a list of bookmarks to show to the user.
// It makes it possible for users to select text in elements to bookmark them.
// It listens for new user bookmarks, and updates the bookmark list
// when a user places a new bookmark.
// It also saves a 'last location' bookmark every few seconds.
// It gives each session an ID, which is a 'sessionDate' timestamp.
// This 'sessionDate' is stored in session storage, and with each
// bookmark in local storage. For the 'last location' bookmarks,
// we only show the user the most recent last-location bookmark
// whose sessionDate does *not* match the current session's sessionDate.
// That way, the last location is always the last place the user
// visited in their last/previous session.

// This script also creates a fingerprint index, which is a map,
// stored in session storage, of IDs to element fingerprints.
// Fingerprints are created in setup.js as attributes, and aim to identify
// an element by its position in the DOM and its opening and closing strings,
// so that if its ID changes, we might still find it by its fingerprint.
// Each stored bookmark includes the bookmarked element's fingerprint.
// This script checks whether the ID of a bookmark in localStorage
// matches its fingerprint in session storage. If it doesn't, we know
// that IDs have shifted, and that bookmarked locations may be inaccurate.
// This script does not yet do anything about that inaccuracy.

// --------- Hybrid storage features and limitations --------- //

// Bookmarks without notes can be stored anonymously in local storage.
// For logged in users, the local storage bookmarks are synced to a server DB
// via an API provided by the Electric Book Server.

// Bookmark notes are only saved to the server and require login.
// Due to the requirement for both anonymous local storage
// and user session server storage, a record of each deleted book has to be
// kept in perpetuity so that deleted bookmarks do not get resurected
// by another device's local storage during sync.

// Local storage bookmarks that have been deleted on another, logged-in device
// will be deleted during sync. This may present a twofold UX issue for users:
// 1. They may be confused or frustrated by bookmarks they deleted on another device
// still being visible while they are not logged in on their current device.
// 2. Bookmarks suddenly disappear as soon as they log in and they
// fail to remember these were previously deleted by them on another device.
// However, with the current hybrid requirement, there is no way around this.
// It could possibly be mitigated by some kind of UI messaging.

// --

import ebBookmarksEnabled from './enabled'
import ebBookmarksSessionDate from './session-date'
import ebBookmarksCheckForBookmarks from './check-for-bookmarks'
import ebBookmarksSync from './sync'
import ebBookmarksSelect from './select'
import ebBookmarksModal from './modal'
import ebBookmarksCreateFingerprintIndex from './create-fingerprint-index'
import ebBookmarksSetLastLocation from './set-last-location'

async function ebBookmarks () {
  if (ebBookmarksEnabled()) {
    await ebBookmarksSync()
    ebBookmarksSessionDate()
    ebBookmarksCreateFingerprintIndex()
    ebBookmarksModal()
    ebBookmarksSelect()
    ebBookmarksCheckForBookmarks()
    ebBookmarksSetLastLocation()
  }
}

export default ebBookmarks
