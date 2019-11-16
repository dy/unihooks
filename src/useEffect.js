import queueMicrotask from 'queue-microtask'
import { useRef, useMemo } from 'any-hooks'

export default function useEffect(fn, deps) {
  const ref = useRef()
  useMemo(() => {
    // guarantee microtask (unlike react/preact)
    queueMicrotask(() => {
      if (ref.dispose && ref.dispose.call) ref.dispose()
      ref.dispose = fn()
    })
  }, deps)
}
