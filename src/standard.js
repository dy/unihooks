import queueMicrotask from 'queue-microtask'
import { useState as useNativeState, useRef, useMemo } from 'any-hooks'

// standard
export { useRef, useReducer, useLayoutEffect, useCallback, useContext, useMemo } from 'any-hooks'

export function useState(init) {
  let [value, setValue] = useNativeState(init)

  // https://github.com/WebReflection/augmentor/issues/19 etc
  if (init === value && typeof init === 'function') {
    value = init()
  }

  return [value, setValue]
}

export function useEffect(fn, deps) {
  const ref = useRef()

  useMemo(() => {
    // guarantee microtask (unlike react/preact)
    queueMicrotask(() => {
      if (ref.current && ref.current.call) ref.current()
      ref.current = fn()
    })
  }, deps)
}
