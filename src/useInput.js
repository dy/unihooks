import useElement from './useElement'
import usePrevious from './usePrevious'
import useStorage from './useStorage'
import useSyncEffect from './useSyncEffect'
import { useEffect, useRef } from './standard'

const cache = new Map()

export default function useInput (target, init) {
  if (typeof target === 'string') {
    // select by name as well
    if (target !== 'input' && !/\W/.test(target)) target += ', [name=' + target + ']'
  }

  let [el] = useElement(target)
  let [prev] = usePrevious(el)

  useSyncEffect(() => {
    if (!cache.has(target)) cache.set(target, {
      get(key) {
        // FIXME: read initial attribute value
        return el && el.value
      },
      set(key, value) {
        if (!el) return
        el.value = value
        el.setAttribute('value', value)
      }
    });
    return () => {
      cache.delete(target)
    }
  }, [el])

  let [value, store] = useStorage(cache.get(target), 'value', init)
  let initedRef = useRef()
  useEffect(() => initedRef.current = true, [])

  useSyncEffect(() => {
    const notify = (e) => store.set(e.target.value)

    if (el) {
      // storage is new - restore it from the new input value
      if (initedRef.current) store.set(store.get(name))
      el.addEventListener('change', notify)
      el.addEventListener('input', notify)
    }

    return () => {
      if (prev) {
        prev.removeEventListener('change', notify)
        prev.removeEventListener('input', notify)
      }
    }
  }, [el])

  return store
}
