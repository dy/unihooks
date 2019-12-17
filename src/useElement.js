import { useMemo } from './standard'

export default function useElement(target) {
  if (typeof target === 'function') {
    return [target()]
  }
  // FIXME: add ref value observer
  if ('current' in target) {
    return [target.current]
  }

  let el = useMemo(() => {
    if (typeof target === 'string') {
      // FIXME: add disconnected observer
      return document.querySelector(target)
    }

    return target
  }, [target])

  return [el]
}
