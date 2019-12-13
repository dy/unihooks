import globalCache from 'global-cache'
import useStorage from './useStorage'

const useGlobalCache = (key, init) => {
  return useStorage(globalCache, key, init)
}

export default useGlobalCache
