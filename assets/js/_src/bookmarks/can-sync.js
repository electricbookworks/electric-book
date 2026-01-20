import ebUserSession from '../user-session'
import ebBookmarksHasApi from './has-api'

let userSessionCache = null
let hasApiCache = null

const ebBookmarksCanSync = async () => {
  const userSession = userSessionCache || await ebUserSession()
  userSessionCache = userSession
  const hasApi = hasApiCache || await ebBookmarksHasApi()
  hasApiCache = hasApi
  return {
    hasApi,
    userSession,
    canSync: userSession?.ID && hasApi
  }
}

export default ebBookmarksCanSync
