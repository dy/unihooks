import { useRef, useMemo, useEffect } from './standard'

export default function useSyncEffect(fn, deps) {
  return useEffect(fn, deps, fn => fn())
}
