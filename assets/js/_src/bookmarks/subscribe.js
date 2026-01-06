/* global EventSource */
import ebBookmarksSync from './sync.js'
import ebBookmarksSessionDate from './session-date.js'

const ebBookmarksSubscribe = () => {
  const userBookmarkSubscribe = new EventSource(`/api/bookmark/subscribe/${ebBookmarksSessionDate()}`)
  userBookmarkSubscribe.onmessage = async (event) => {
    console.log(event, 'bookmark subscribe event')
    await ebBookmarksSync()
  }
}

export default ebBookmarksSubscribe
