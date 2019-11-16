import globalCache from 'global-cache'
import useState from './useState'

const SymbolUnihooks = Symbol.for('__unihooks__')
if (!globalCache.has(SymbolUnihooks)) globalCache.set(SymbolUnihooks, new Map)
const cache = globalCache.get(SymbolUnihooks)

export default function useGlobalCache(key, init, deps) {

}

const useLocalStorage = (key, init, deps) => {
  const storage = (cache[key] || (cache[key] = {
    get: () => JSON.parse(ls.get(key)),
    set: value => ls.set(key, value)
  }))

  useEffect(() => {
    const notify = value => setValue(value)
    ls.on(key, notify)
    return ls.off(key, notify)
  })

  return useStorage(storage, storedValue => {
    if (typeof init === 'function') return init(storedValue)
    return storedValue == null ? init : storedValue
  }, deps)
}

export default useLocalStorage
