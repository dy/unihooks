import useStorage from './useStorage'
import ls from 'local-storage'

const useLocalStorage = (key, initial) => {
    const storage = {
        get: () => JSON.parse(ls.get(key)),
        set: value => ls.set(key, value)
    }

    let [value, setValue] = useStorage(storage, (value) => {
        ls.on(key, value => setValue(value))
        return typeof initial === 'function' ? initial(value) : initial
    }, {
        id: 'useLocalStorage'
    })

    return [value, setValue]
}

export default useLocalStorage
