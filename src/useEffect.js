import { useEffect as useNativeEffect } from 'any-hooks'
import queueMicrotask from 'queue-microtask'

export default function useEffect(fn, deps = []) {
  return useNativeEffect(() => {
    // react/preact don't guarantee next microtask, so it is done here
    queueMicrotask(fn)
  }, deps)
}
