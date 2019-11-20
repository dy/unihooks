import { useRef, useMemo } from 'any-hooks'

export default function useSyncEffect(fn, deps) {
  const ref = useRef()
  useMemo(() => {
    if (ref.current && ref.current.call) ref.current()
    ref.current = fn()
  }, deps)
}
