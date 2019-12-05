import { useState as useNativeState } from 'any-hooks'

export default function useState (init) {
  let [value, setValue] = useNativeState(init)

  // https://github.com/WebReflection/augmentor/issues/19 etc
  if (init === value && typeof init === 'function') {
    value = init()
  }

  return [value, setValue]
}
