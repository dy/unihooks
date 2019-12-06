import { useMemo as useNativeMemo } from 'any-hooks'

// FIXME: guarantee single-time run per caller
export default function useMemo(fn, deps) {
  return useNativeMemo(fn, deps)
}
