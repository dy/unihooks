import { useState as useNativeState, useMemo } from 'any-hooks'

export default function useState (init) {
  let [value, setValue] = useNativeState(init)
  if (init === value && typeof init === 'function') {
    value = init()
  }
  return [value, setValue]
}
