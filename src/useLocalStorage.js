// borrowed from https://github.com/chrisjpatty/crooks

import useState from './useState'
import createProvider from './provider'

import ls from 'local-storage'

const useLocalStorage = (key, initial) => {
  let provider = createProvider(['useLocalStorage', key], ls)

  const [value, setNativeState] = useState(() => {
    provider.subscribe(value => setNativeState(value))
    return provider.value
  })

  return [value, provider]
}

// export const clear = useLocalStorage.clear = () => {
//   for (let [key, state] of cache) {
//     state.clear()
//     // state.storage.remove(key)
//   }
//   cache.clear()
//   return
// }

export default useLocalStorage
