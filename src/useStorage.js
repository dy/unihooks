import useState from './useState'
import { setMicrotask, clearMicrotask } from 'set-microtask'
import useSyncEffect from './useSyncEffect'
import globalCache from 'global-cache'
import tuple from 'immutable-tuple'

const SymbolUseStorage = Symbol.for('__unihooks__useStorage')
if (!globalCache.has(SymbolUseStorage)) globalCache.set(SymbolUseStorage, new Map)
const cache = globalCache.get(SymbolUseStorage)

export default function useStorage(storage, key, init) {
  let store, storeId = tuple(storage, key)
  if (cache.has(storeId)) {
    store = cache.get(storeId)
  }
  else {
    cache.set(storeId, store = (...args) => store.set(...args))

    // mitt extract
    let subs = {}
    store.on = (e, fn) => (subs[e] || (subs[e] = [])).push(fn)
    store.off = (e, fn) => subs[e].splice(subs[e].indexOf(fn) >>> 0, 1)
    store.emit = (e, arg) => subs[e] && subs[e].slice().map(fn => fn(arg))

    store.value
    store.planned

    // commit any plans and read from storage
    store.get = () => {
      if (store.planned) {
        clearMicrotask(store.planned)
        store.commit()
      }
      return store.value
    }

    // plan write to storage
    store.set = (newValue) => {
      if ((storage.is || Object.is)(newValue, store.value)) {
        if (store.planned) clearMicrotask(store.planned)
        return
      }
      if (!store.planned) store.planned = setMicrotask(store.commit)
      store.value = newValue
    }

    // update storage from store
    store.commit = () => {
      store.planned = null
      storage.set(key, store.value)
      store.update(storage.get(key))
    }

    // update store from storage
    store.update = (value) => {
      store.value = value
      store.emit('change', store.value)
    }
  }

  const [value, setNativeState] = useState( () => {
    if (store.planned) store.commit()
    store.value = storage.get(key)

    // fn init is always called
    if (typeof init === 'function') {
      store.value = init(store.value)
      store.commit()
    }
    // constant init is called if there's no value in storage
    else if (store.value == null && init != store.value) {
      store.value = init
      store.commit()
    }

    return store.value
  })

  useSyncEffect( () => {
    const notify = value => {
      setNativeState(value)
    }
    store.on('change', notify)
    return () => store.off('change', notify)
  }, [] )

  return [value, store]
}
