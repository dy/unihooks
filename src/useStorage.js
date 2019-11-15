import useState from './useState'
import useMemo from './useMemo'
import globalCache from 'global-cache'
import { setMicrotask, clearMicrotask } from 'set-microtask'
import tuple from 'immutable-tuple'


const SymbolUnihooks = Symbol.for('@@unihooks')
if (!globalCache.has(SymbolUnihooks)) globalCache.set(SymbolUnihooks, new Map)
const cache = globalCache.get(SymbolUnihooks)

export default function useStorage({ get, set }, init, param = {}) {
  let store = useMemo(() => {
    if (param.id && cache.has(param.id)) return cache.get(param.id)
    const store = value => store.set(value)
    if (param.id) cache.set(param.id, store)

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

    return store
  }, [])

  const [value, setNativeState] = useState(() => {
    store.value = get()
    if (store.value == null && init !== store.value) {
      store.value = typeof init === 'function' ? init() : init
      store.commit()
    }

    store.on('change', value => setNativeState(value))
    return store.value
  })

  return [value, store]
}
