import { useState as useNativeState, useRef, useMemo, useEffect as useNativeEffect } from 'any-hooks'

// standard
export { useRef, useReducer, useLayoutEffect, useCallback, useContext, useMemo } from 'any-hooks'

export function useState(init, deps=[]) {
  let [value, setValue] = useNativeState(init)

  // https://github.com/WebReflection/augmentor/issues/19 etc
  if (init === value && typeof init === 'function') {
    value = init()
  }

  let isFirst = false
  useNativeState(() => isFirst = true)

  // reset init value if deps change
  useMemo(() => {
    if (isFirst) return
    value = typeof init === 'function' ? init(value) : init
  }, deps)

  return [value, setValue]
}

export function useEffect(fn, deps) {
  const resultRef = useRef()

  useMemo(() => {
    // guarantee microtask (unlike react/preact)
    Promise.resolve().then(() => {
      if (resultRef.current && resultRef.current.call) resultRef.current()
      resultRef.current = fn()
    })
  }, deps)

  // end effect
  useNativeEffect(() => () =>
    resultRef.current && resultRef.current.call && resultRef.current()
    , [])
}
