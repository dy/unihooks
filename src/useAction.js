import enhook from 'enhook'
import { useMemo, useRef, useCallback } from './standard'

const cache = {}

export default function useAction (name, action) {
  let ref = useRef()

  let storedAction = useMemo(() => {
    if (action || typeof name === 'function') return createAction(name, action)
    return cache[name]
  }, [name, action])

  let call = useCallback(() => {
    ref.current = storedAction()
  })

  call[0] = ref.current
  call[1] = call

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
