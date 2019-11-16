import useStorage from './useStorage'
import ls from 'local-storage'
import useEffect from './useEffect'

const cache = {}

const useLocalStorage = (key, init, deps) => {
    const storage = (cache[key] || (cache[key] = {
        get: () => {
            let str = ls.get(key)
            let result = JSON.parse(str)
            return result
        },
        set: value => ls.set(key, value)
    }))

    useEffect(() => {
        const notify = value => setValue(value)
        ls.on(key, notify)
        return () => ls.off(key, notify)
    })

    return useStorage(storage, init, deps)
}

export default useLocalStorage
