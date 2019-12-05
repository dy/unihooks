import useState from './useState'
import { setMicrotask, clearMicrotask } from 'set-microtask'
import useSyncEffect from './useSyncEffect'
import globalCache from 'global-cache'
import tuple from 'immutable-tuple'

const SymbolUseStorage = Symbol.for('__unihooks__useStorage')
if (!globalCache.has(SymbolUseStorage)) globalCache.set(SymbolUseStorage, new Map)
const cache = globalCache.get(SymbolUseStorage)

export default function useStorage(storage, key, init) {
  let state, stateId = tuple(storage, key)
  if (cache.has(stateId)) {
    state = cache.get(stateId)
  }
  else {
    cache.set(stateId, state = (...args) => state.set(...args))

    // mitt extract
    let subs = {}
    state.on = (e, fn) => (subs[e] || (subs[e] = [])).push(fn)
    state.off = (e, fn) => subs[e].splice(subs[e].indexOf(fn) >>> 0, 1)
    state.emit = (e, arg) => subs[e] && subs[e].slice().map(fn => fn(arg))

    state.value
    state.planned

    // commit any plans and read from storage
    state.get = () => {
      if (state.planned) {
        clearMicrotask(state.planned)
        state.commit()
      }
      return state.value
    }

    // plan write to storage
    state.set = (newValue) => {
      if ((storage.is || Object.is)(newValue, state.value)) {
        if (state.planned) clearMicrotask(state.planned)
        return
      }
      if (!state.planned) state.planned = setMicrotask(state.commit)
      state.value = newValue
    }

    // update storage from state
    state.commit = () => {
      state.planned = null
      storage.set(key, state.value)
      state.update(storage.get(key))
    }

    // update state from storage
    state.update = (value) => {
      state.value = value
      state.emit('change', state.value)
    }
  }

  const [value, setNativeState] = useState(() => {
    if (state.planned) state.commit()
    state.value = storage.get(key)

    // if init is fn it's always called
    if (typeof init === 'function') {
      state.value = init(state.value)
      state.commit()
    }
    // constant init is called if there's no value in storage
    else if (state.value == null && init != state.value) {
      state.value = init
      state.commit()
    }

    return state.value
  })

  useSyncEffect( () => {
    const notify = value => {
      setNativeState(value)
    }
    state.on('change', notify)
    return () => state.off('change', notify)
  }, [] )

  return [value, state]
}
