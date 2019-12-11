import queueMicrotask from 'queue-microtask'
import setBaseHooks, {
  useRef,
  useReducer,
  useLayoutEffect,
  useCallback,
  useContext,
  useMemo,
  useState as useNativeState
} from 'any-hooks'

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

export { useMemo, useContext, useLayoutEffect, useCallback, useReducer, useRef }
export default (hooks) => {
  setBaseHooks(hooks)
}

// export default function setHooks(hooks) {
//   setBaseHooks(hooks)
//   useNativeState = hooks.useState
  // useRef = hooks.useRef
  // useReducer = hooks.useReducer
  // useLayoutEffect = hooks.useLayoutEffect
  // useCallback = hooks.useCallback
  // useContext = hooks.useContext
  // useMemo = hooks.useMemo
// }

