import { locales, pageLanguage } from './locales'
import ebUserSession from './user-session'

const ebAddLoginButton = async () => {
  const userSession = await ebUserSession()
  if (userSession !== null) {
    const button = document.createElement('a')
    // current path may be restricted, so if logging out, go to home page after login to prevent redirect loop
    const redirectPath = !userSession?.ID ? window.location.pathname + window.location.search + window.location.hash : ''
    const direction = !userSession?.ID ? 'in' : 'out'
    button.setAttribute('href', `/log${direction}${redirectPath}`)
    button.classList.add('controls-login')
    button.innerHTML = !userSession?.ID ? locales[pageLanguage].nav.login : locales[pageLanguage].nav.logout
    const controls = document.querySelector('.js-controls')
    if (controls) {
      controls.appendChild(button)
    }
  }
}

export default ebAddLoginButton
