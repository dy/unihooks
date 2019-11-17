import globalCache from 'global-cache'
import useStorage from './useStorage'

const cache = {}

const useGlobalCache = (key, init) => {
  let storage = cache[key] || (cache[key] = {
    get: () => globalCache.get(key),
    set: value => globalCache.set(key, value)
  })

  let [value, store] = useStorage(storage, init)
  return [value, store]
}

export default useGlobalCache
