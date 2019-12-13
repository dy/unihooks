import enhook from 'enhook'
import { useMemo, useRef, useCallback } from './standard'

const cache = {}

export default function useAction (name, action) {
  let ref = useRef()

  let storedAction = useMemo(() => {
    if (action || typeof name === 'function') return createAction(name, action)
    return cache[name]
  }, [name, action])

  let call = useMemo(() => {
    let call =  (...args) => {
      ref.current = storedAction(...args)
    }
    call[Symbol.iterator] = function* () { yield ref.current; yield call }
    return call
  })
  return call
}

export const createAction = (name, action) => {
  if (typeof name === 'function') {
    action = name
    name = action.name
  }

  return cache[name] = enhook((...args) => {
    return action(...args)
  }, { passive: true })
}
