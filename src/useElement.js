export default function useElement(target) {
  if (typeof target === 'function') {
    return [target()]
  }
  if (typeof target === 'string') {
    // FIXME: add disconnected observer
    return [document.querySelector(target)]
  }
  // FIXME: add ref value observer
  if ('current' in target) {
    return [target.current]
  }

  return [target]
}
