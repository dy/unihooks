import { useState as useNativeState, useRef, useCallback, useMemo as useNativeMemo, useEffect as useNativeEffect, useLayoutEffect as useNativeLayoutEffect } from 'any-hooks'

// standard
export { useRef, useReducer, useCallback, useContext } from 'any-hooks'

export function useState(init, deps=[]) {
  let [value, setValue] = useNativeState()

  let valueRef = useRef(value)

  // reset init value if deps change
  useMemo(() => {
    valueRef.current = typeof init === 'function' ? init(valueRef.current) : init
  }, deps)

  const set = useCallback(newValue => {
    let value = typeof newValue === 'function' ? newValue(valueRef.current) : newValue
    if (value !== valueRef.current) {
      valueRef.current = value
      setValue(value)
    }
  }, [])


  return [valueRef.current, set]
}

const microtask = fn => Promise.resolve().then(fn)

export function useEffect(fn, deps, plan = microtask) {
  const resultRef = useRef()

  useMemo(() => {
    // guarantee microtask (unlike react/preact)
    plan(() => {
      if (resultRef.current && resultRef.current.call) resultRef.current()
      resultRef.current = fn()
    })
  }, deps)

  // end effect
  useNativeEffect(() => () => {
    resultRef.current && resultRef.current.call && resultRef.current()
    resultRef.current = null
  }, [])
}

// https://github.com/atomicojs/atomico/issues/24 etc.
export function useMemo(fn, deps) {
  const depsRef = useRef(), resultRef = useRef()

  if (!depsRef.current || !arrEquals(deps, depsRef.current)) {
    depsRef.current = deps
    resultRef.current = fn()
  }

  useNativeEffect(() => () => {
    resultRef.current = null
    depsRef.current = null
  }, [])

  return resultRef.current
}

// fallback useLayoutEffect to useEffect (eg. atomico)
export function useLayoutEffect() {
  return (useNativeLayoutEffect ? useNativeLayoutEffect : useEffect).apply(this, arguments)
}


function arrEquals(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((v, i) => Object.is(v, arr2[i]));
}
