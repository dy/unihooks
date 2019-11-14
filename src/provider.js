import mitt from 'mitt'
import globalCache from 'global-cache'
import tuple from 'immutable-tuple'

// state can be shared between components
const _cache = Symbol.for('unihooks')
if (!globalCache.has(_cache)) globalCache.set(_cache, new WeakMap)
const cache = globalCache.get(_cache)


export default function createProvider (key, storage) {
  // key is a tuple
  key = tuple(key)

  let provider = cache.get(key)
  if (provider) return provider

  cache.set(key, provider = value => provider.set(value))



  Object.assign(provider, mitt())
  provider.storage = ls

  // hydrate
  Object.defineProperty(provider, 'value', {
    get() {
      return provider.storage.get(key)
    },
    set(value) {
      if (typeof value === 'function') value = value(provider.value)
      if (provider.storage.get(key) !== value) {
        provider.storage.set(key, value)
        provider.emit('change', value)
      }
    }
  })

  // subscribe
  const notify = value => provider.emit('change', value)
  provider.storage.on(key, notify)

  provider.set = provider
  provider.subs = []
  provider.clear = () => {
    provider.subs.forEach(sub => provider.off('change', sub))
    provider.subs.length = 0
    provider.storage.off(key, notify)
    cache.delete(key)
  }

  // init
  provider.value = initial

}
