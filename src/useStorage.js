import useState from './useState'
import tuple from 'immutable-tuple'
import globalCache from 'global-cache'
import { setMicrotask, clearMicrotask } from 'set-microtask'


const _cache = Symbol.for('unihooks')
if (!globalCache.has(_cache)) globalCache.set(_cache, new WeakMap)
const cache = globalCache.get(_cache)

export default function useStorage(key, init, { get, set }) {
  // multikey → tuple
  key = tuple(key)

  let store = cache.get(key)

  if (!store) {
    cache.set(key, store = value => {
      store.set(value)
    })

    // mitt extract
    let subs = []
    store.on = (e, fn) => { (subs[e] || (subs[e] = [])).push(fn) }
    store.off = (e, fn) => { subs[e].splice(subs[e].indexOf(fn) >>> 0, 1) }
    store.emit = (e, arg) => { subs[e] && subs[e].slice().map(fn => fn(arg)) }

    store.value
    store.planned

    store.get = () => {
      if (store.planned) {
        clearMicrotask(store.planned)
        store.commit()
      }
      return store.value
    }

    store.set = (newValue) => {
      if (Object.is(newValue, store.value)) {
        if (store.planned) clearMicrotask(store.planned)
        return
      }

      if (!store.planned) store.planned = setMicrotask(store.commit)
      store.value = newValue
    }

    store.commit = () => {
      store.planned = null
      set(store.value)
      store.emit('change', store.value)
    }
  }

  const [value, setNativeState] = useState(() => {
    store.value = get()
    if (store.value === null && init !== store.value) {
      store.set(typeof init === 'function' ? init() : init)
    }

    store.on('change', value => setNativeState(value))
    return store.value
  })

  return [value, store]
}
