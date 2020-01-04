import { useState as useNativeState, useRef, useCallback, useMemo as useNativeMemo, useEffect as useNativeEffect } from 'any-hooks'
import { useSyncEffect } from '.'

// standard
export { useRef, useReducer, useLayoutEffect, useCallback, useContext } from 'any-hooks'

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

// https://github.com/atomicojs/atomico/issues/24 etc.
export function useMemo(fn, deps) {
  const depsRef = useRef(), resultRef = useRef()

  if (!depsRef.current || !arrEquals(deps, depsRef.current)) {
    depsRef.current = deps
    resultRef.current = fn()
  }

  useNativeEffect(() => () => {
    resultRef.current && resultRef.current.call && resultRef.current()
    resultRef.current = null
    depsRef.current = null
  }, [])

  return resultRef.current
}


function arrEquals(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every((v, i) => Object.is(v, arr2[i]));
}
