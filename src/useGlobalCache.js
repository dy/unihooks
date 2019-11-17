import globalCache from 'global-cache'
import useStorage from './useStorage'

const useGlobalCache = (key, init) => {
  let [value, store] = useStorage(globalCache, key, init)
  return [value, store]
}

export default useGlobalCache
