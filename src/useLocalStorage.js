// borrowed from https://github.com/chrisjpatty/crooks

import { useMemo } from 'any-hooks'
import useStorage from './useStorage'
import ls from 'local-storage'

const useLocalStorage = (key, initial) => {
    ls.on(key, value => setValue(value))

    let storage = useMemo(() => {
        return {
            get: () => JSON.parse(ls.get(key)),
            set: value => ls.set(key, value)
        }
    }, [])

    // let [value, setValue] = useStore(['useLocalStorage', key], initial, store)
    let [value, setValue] = useStorage(key, initial, storage)

    return [value, setValue]
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
