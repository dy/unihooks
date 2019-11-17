import useState from './useState'
import { setMicrotask, clearMicrotask } from 'set-microtask'
import useSyncEffect from './useSyncEffect'
import globalCache from 'global-cache'

const SymbolUseStorage = Symbol.for('__unihooks__useStorage')
if (!globalCache.has(SymbolUseStorage)) globalCache.set(SymbolUseStorage, new Map)
const cache = globalCache.get(SymbolUseStorage)

export default function useStorage(storage, init) {
  let store
  if (cache.has(storage)) {
    store = cache.get(storage)
  }
  else {
    cache.set(storage, store = value => store.set(value))

    // mitt extract
    let subs = {}
    store.on = (e, fn) => (subs[e] || (subs[e] = [])).push(fn)
    store.off = (e, fn) => subs[e].splice(subs[e].indexOf(fn) >>> 0, 1)
    store.emit = (e, arg) => subs[e] && subs[e].slice().map(fn => fn(arg))

    store.value
    store.planned

    // read from storage
    store.get = () => {
      if (store.planned) {
        clearMicrotask(store.planned)
        store.commit()
      }
      return store.value
    }

    // write to storage
    store.set = (newValue) => {
      if (Object.is(newValue, store.value)) {
        if (store.planned) clearMicrotask(store.planned)
        return
      }
      if (!store.planned) store.planned = setMicrotask(store.commit)
      store.value = newValue
    }

    // put store into storage
    store.commit = () => {
      store.planned = null
      storage.set(store.value)
      store.emit('change', store.value)
    }

    // update store, not updating storage
    store.update = (value) => {
      store.value = value
      store.emit('change', store.value)
    }
  }

  const [value, setNativeState] = useState( () => {
    if (store.planned) store.commit()
    store.value = storage.get()

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
