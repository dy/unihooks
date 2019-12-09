// standard hooks constructor
import queueMicrotask from 'queue-microtask'

export let useRef
export let useReducer
export let useLayoutEffect
export let useCallback
export let useContext
export let useMemo

let useNativeState
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

export default function initHooks(hooks) {
  useNativeState = hooks.useState
  useRef = hooks.useRef
  useReducer = hooks.useReducer
  useLayoutEffect = hooks.useLayoutEffect
  useCallback = hooks.useCallback
  useContext = hooks.useContext
  useMemo = hooks.useMemo
}

