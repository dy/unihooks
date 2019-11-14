// borrowed from https://github.com/chrisjpatty/crooks

import useState from './useState'
import ls from 'local-storage'
import mitt from 'mitt'
import globalCache from 'global-cache'
import tuple from 'immutable-tuple'

// state can be shared between components
const _cache = Symbol.for('unihooks/useProperty')
if (!globalCache.has(_cache)) globalCache.set(_cache, new Map)
const cache = globalCache.get(_cache)


const useProperty = (target, name, initial) => {
  let state = cache.get(key)
  let key = tuple(target, name)
  let currentValue, plannedValue, planned
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



  // init observer if the first time
  if (!state) {
    // check if prop is configurable
    let initialDesc = Object.getOwnPropertyDescriptor(target, name)

    currentValue = initialDesc && ('value' in initialDesc) ? initialDesc.value : target[name]

    let desc = {
      configurable: true,
      get() {
        // shortcut planned call
        if (planned) {
          clearMicrotask(planned)
          applyValue()
        }
        return initialDesc && initialDesc.get ? initialDesc.get.call(target) : currentValue
      },
      set(newValue) {
        if (Object.is(newValue, currentValue)) {
          if (planned) clearMicrotask(planned)
          return
        }

        if (!planned) planned = setMicrotask(applyValue)
        plannedValue = newValue
      }
    }

    function applyValue(val) {
      planned = null

      state.value = currentValue = arguments.length ? val : plannedValue
      if (initialDesc && initialDesc.set) initialDesc.set.call(target, currentValue)

      emit(target, 'prop:change:' + name, currentValue)
    }

    Object.defineProperty(target, name, desc)

    cache.set(key, state = { initialDesc, value: currentValue })
  }
  else {
    currentValue = state.value
  }







  const [value, setNativeState] = useState(() => {
    const set = v => setNativeState(v)
    state.subs.push(set)
    state.on('change', set)
    return state.value
  })

  return [value, state]
}

const clear = useProperty.clear = () => {
  for (let [key, state] of cache) {
    state.clear()
    ls.remove(key)
  }
  cache.clear()
  return
}

export { clear }
export default useProperty
