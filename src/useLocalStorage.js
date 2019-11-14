// borrowed from https://github.com/chrisjpatty/crooks

import { useState } from 'any-hooks'
import ls from 'local-storage'

function getCache (key, initial, setState) {
    const cached = ls.get(key)
    if (cached === null && initial !== null) {
        ls.set(key, initial)

        // observe changes from another tabs
        ls.on(key, (value) => setState(value))
    }
    return cached !== null ? cached : initial
}

function useLocalStorage (key, initial) {
    const [nativeState, setNativeState] = useState(getCache(key, initial, setState))
    return [nativeState, setState]

    function setState (state) {
        if (typeof state === 'function') {
            setNativeState(prev => {
                const newState = state(prev)
                ls.set(key, newState)
                return newState
            })
        } else {
            ls.set(key, state)
            setNativeState(state)
        }
    }
}

useLocalStorage.clear = ls.clear

export default useLocalStorage
