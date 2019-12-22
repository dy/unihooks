import globalCache from 'global-cache'
import useStorage from './useSource'

const useGlobalCache = (key, init) => {
  return useStorage(globalCache, key, init)
}

export default useGlobalCache
