import { useMemo as useNativeMemo } from 'any-hooks'

export default function useMemo(fn, deps) {
  return useNativeMemo(fn, deps)
}
