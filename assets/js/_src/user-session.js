const ebSessionApi = await fetch('/api/session/')
const ebHasSessionApi = ebSessionApi.status !== 404
const ebUserSession = ebHasSessionApi ? await ebSessionApi.json() : null

export default ebUserSession
export { ebHasSessionApi }
