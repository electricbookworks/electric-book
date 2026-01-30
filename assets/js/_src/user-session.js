async function ebUserSession () {
  try {
    const ebSessionApi = await fetch('/api/session/')
    const ebHasSessionApi = ebSessionApi.status !== 404
    const result = await ebSessionApi.json()
    // return empty object if session API exists but not logged in
    // helps distinguish between "not logged in" and "session API not available"
    return ebHasSessionApi && result ? result : {}
  } catch (error) {
    return null
  }
}

export default ebUserSession
