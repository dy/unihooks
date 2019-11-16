import { useRef, useMemo } from 'any-hooks'

export default function useSyncEffect(fn, deps) {
  const ref = useRef()
  useMemo(() => {
    if (ref.dispose && ref.dispose.call) ref.dispose()
    ref.dispose = fn()
  }, deps)
}
