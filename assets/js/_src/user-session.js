async function ebUserSession () {
  try {
    const ebSessionApi = await fetch('/api/session/')
    const ebHasSessionApi = ebSessionApi.status !== 404
    return ebHasSessionApi ? await ebSessionApi.json() : {}
  } catch (error) {
    return null
  }
}

export default ebUserSession
