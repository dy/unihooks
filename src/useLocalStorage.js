import useStorage from './useStorage'
import ls from 'local-storage'
import useEffect from './useEffect'

const useLocalStorage = (key, init) => {
    // subscribe to updates
    useEffect(() => {
        const notify = value => setValue(value)
        ls.on(key, notify)
        return ls.off(key, notify)
    }, [])

    const storage = {
        get: () => JSON.parse(ls.get(key)),
        set: value => ls.set(key, value)
    }

    let [value, setValue] = useStorage(storage, storedValue => {
        if (typeof init === 'function') return init(storedValue)
        return storedValue == null ? init : storedValue
    }, 'useLocalStorage')

    return [value, setValue]
}

export default useLocalStorage
