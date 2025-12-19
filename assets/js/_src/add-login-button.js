import ebUserSession, { ebHasSessionApi } from './user-session'

const ebAddLoginButton = () => {
  if (ebHasSessionApi) {
    const button = document.createElement('a')
    // current path may be restricted, so if logging out, go to home page after login to prevent redirect loop
    const redirectPath = !ebUserSession?.ID ? window.location.pathname + window.location.search + window.location.hash : ''
    const direction = !ebUserSession?.ID ? 'in' : 'out'
    button.setAttribute('href', `/log${direction}${redirectPath}`)
    button.classList.add('controls-login')
    button.innerHTML = `Log ${direction}`
    const controls = document.querySelector('.js-controls')
    if (controls) {
      controls.appendChild(button)
    }
  }
}

export default ebAddLoginButton
