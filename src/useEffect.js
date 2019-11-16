import { useLayoutEffect } from 'any-hooks'
import queueMicrotask from 'queue-microtask'

export default function useEffect(fn, deps = []) {
  return useLayoutEffect(() => {
    // react/preact don't guarantee microtask, so it is done here
    queueMicrotask(fn)
  }, deps)
}
