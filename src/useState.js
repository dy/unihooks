import { useState as useNativeState, useMemo } from 'any-hooks'

export default function useState (init) {
  let [value, setValue] = useNativeState(init)

  // https://github.com/WebReflection/augmentor/issues/19 and alike, if some lib doesn't support
  if (init === value && typeof init === 'function') {
    value = init()
  }
  return [value, setValue]
}
