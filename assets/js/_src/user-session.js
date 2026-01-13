let ebHasSessionApi, ebUserSession

try {
  const ebSessionApi = await fetch('/api/session/')
  ebHasSessionApi = ebSessionApi.status !== 404
  ebUserSession = ebHasSessionApi ? await ebSessionApi.json() : null
} catch (error) {
  ebHasSessionApi = false
  ebUserSession = null
}

export default ebUserSession
export { ebHasSessionApi }
