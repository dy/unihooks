import useStorage from './useStorage'
import useElement from './useElement'
import useSyncEffect from './useSyncEffect'
import { useRef } from './standard'

const cache = new WeakMap

const useAttribute = (target, name, init) => {
  let [el] = useElement(target)

  // reinit cached instance by target
  useSyncEffect(() => {
    if (!cache.has(target)) {
      cache.set(target, {
        is(a, b) {
          if (a == b) return true
          if (!a && !b && a !== 0 && b !== 0) return true
          return false
        },
        get(key) {
          if (!el || !el.hasAttribute(key)) return undefined
          let attr = el.getAttribute(key)
          if (attr === 'true' || attr === 'on') return true
          return el.getAttribute(key)
        },
        set(key, value) {
          if (value === true)
            el.setAttribute(key, '')
          else if (!value) {
            el.removeAttribute(key)
          }
          else {
            el.setAttribute(key, value)
          }
        }
      });
    }

    return () => {
      cache.delete(target)
    }
  }, [el])

  let storage = cache.get(target)
  let [, store] = useStorage(storage, name, init)

  useSyncEffect(() => {
    let observer
    if (el) {
      store.set(store.get(name))
      observer = new MutationObserver(records => {
        store.set(el.getAttribute(name))
      })
      observer.observe(el, {
        attributes: true,
        attributeFilter: [name]
      })
    }
    return () => {
      if (observer) observer.disconnect()

    }
  }, [el])

  return store
}

export default useAttribute
