import enhook from 'enhook'
import { useMemo, useRef, useCallback } from './standard'
import globalCache from 'global-cache'

let cacheKey = Symbol.for('!uhx:useAction')
if (!globalCache.get(cacheKey)) globalCache.set(cacheKey, {})
const cache = globalCache.get(cacheKey)

export default function useAction (name, action) {
  let ref = useRef()

  let storedAction = useMemo(() => {
    if (action || typeof name === 'function') return createAction(name, action)
    return cache[name]
  }, [name, action])

  if (!action && !storedAction) throw Error('useAction: unknown action `' + name + '`')

  let call = useMemo(() => {
    let call =  (...args) => {
      return ref.current = storedAction(...args)
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

  return cache[name] = enhook(action, { passive: true })
}
