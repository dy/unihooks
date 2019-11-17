import useStorage from './useStorage'
import ls from 'local-storage'
import useSyncEffect from './useSyncEffect'

const cache = {}

const useLocalStorage = (key, init) => {
    const storage = (cache[key] || (cache[key] = {
        get: () => {
            let str = ls.get(key)
            let result = JSON.parse(str)
            return result
        },
        set: value => ls.set(key, value)
    }))

    useSyncEffect(() => {
        // it is possible instead to observe localStorage property
        const notify = value => store.update()
        ls.on(key, notify)
        return () => ls.off(key, notify)
    }, [])

    let [value, store] = useStorage(storage, init)
    return [value, store]
}

export default useLocalStorage
