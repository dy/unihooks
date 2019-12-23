import useStorage from './useStorage'
import ls from 'local-storage'
import useSyncEffect from './useSyncEffect'
import { setMicrotask, clearMicrotask } from 'set-microtask'

ls.backend(sessionStorage)

export const storage = {
    get: key => {
        let str = ls.get(key)
        let result = JSON.parse(str)
        return result
    },
    set: ls.set,
    plan: (fn) => {
        let idx = setMicrotask(fn)
        return () => clearMicrotask(idx)
    }
}

const useLocalStorage = (key, init) => {
    useSyncEffect(() => {
        // it is possible instead to observe localStorage property
        const notify = value => store.update(value)
        ls.on(key, notify)
        return () => ls.off(key, notify)
    }, [key])

    let [value, store] = useStorage(storage, key, init)
    return [value, store]
}

export default useLocalStorage
