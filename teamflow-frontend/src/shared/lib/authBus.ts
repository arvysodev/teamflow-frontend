type LogoutListener = () => void

const logoutListeners = new Set<LogoutListener>()

export function emitLogout() {
  for (const fn of logoutListeners) fn()
}

export function onLogout(listener: LogoutListener) {
  logoutListeners.add(listener)
  return () => {
    logoutListeners.delete(listener)
  }
}
