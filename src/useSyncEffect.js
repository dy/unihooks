import { useRef, useMemo } from './standard'

export default function useSyncEffect(fn, deps) {
  const ref = useRef()
  useMemo(() => {
    if (ref.current && ref.current.call) ref.current()
    ref.current = fn()
  }, deps)
}
