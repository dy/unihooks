import useStorage from './useStorage'
import useInit from './useInit'

const cache = new WeakMap

const useAttribute = (el, name, init) => {
  if (!cache.has(el)) cache.set(el, {
    is(a, b) {
      if (a == b) return true
      if (!a && !b && a !== 0 && b !== 0) return true
      return false
    },
    get(key) {
      if (!el.hasAttribute(key)) return null
      let attr = el.getAttribute(key)
      if (attr === 'true') return true
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

  useInit(() => {
    let observer = new MutationObserver(records => {
      store.update(el.getAttribute(name))
    })
    observer.observe(el, {
      attributes: true,
      attributeFilter: [name]
    })
    return () => observer.disconnect()
  })

  let [value, store] = useStorage(cache.get(el), name)
  return [value, store]
}

export default useAttribute
