import useSource from './useSource'
import { wrapHistory, navigateEvent } from './util'
import { useEffect } from 'haunted'

wrapHistory('push')
wrapHistory('replace')
navigateEvent()

const storage = {
  get(_) {
    return window.location
  },
  set(_, location) {
    window.location = location
  }
}

export default function useLocation () {
  // init observers for location change
  useEffect(() => {
    const notify = () => {
      store.set(storage.get())
    }
    window.addEventListener('popstate', notify)
    window.addEventListener('pushstate', notify)
    window.addEventListener('replacestate', notify)
    window.addEventListener('navigate', notify)
    return () => {
      window.removeEventListener('popstate', notify)
      window.removeEventListener('pushstate', notify)
      window.removeEventListener('replacestate', notify)
      window.removeEventListener('navigate', notify)
    }
  }, [])

  let [value, store] = useSource(storage, '', init)
  return [value, store]
}
