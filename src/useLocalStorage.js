// borrowed from https://github.com/chrisjpatty/crooks

import useState from './useState'
import ls from 'local-storage'
import mitt from 'mitt'
import globalCache from 'global-cache'

// state can be shared between components
const _cache = Symbol.for('unihooks/useLocalStorage')
if (!globalCache.has(_cache)) globalCache.set(_cache, new Map)
const cache = globalCache.get(_cache)


const useLocalStorage = (key, initial) => {
  let state = cache.get(key)

  if (!state) {
    cache.set(key, state = value => state.value = value)
    Object.assign(state, mitt())

    // hydrate
    Object.defineProperty(state, 'value', {
      get() { return ls.get(key) },
      set(value) {
        if (typeof value === 'function') value = value(state.value)
        if (ls.get(key) !== value) {
          ls.set(key, value)
          state.emit('change', value)
        }
      }
    })

    // subscribe
    const notify = value => state.emit('change', value)
    ls.on(key, notify)

    state.set = state
    state.subs = []
    state.clear = () => {
      state.subs.forEach(sub => state.off('change', sub))
      state.subs.length = 0
      ls.off(key, notify)
      cache.delete(key)
    }

    // init
    state.value = initial
  }

  const [value, setNativeState] = useState(() => {
    const set = v => setNativeState(v)
    state.subs.push(set)
    state.on('change', set)
    return state.value
  })

  return [value, state]
}

const clear = useLocalStorage.clear = () => {
  for (let [key, state] of cache) {
    state.clear()
    ls.remove(key)
  }
  cache.clear()
  return
}

export { clear }
export default useLocalStorage
