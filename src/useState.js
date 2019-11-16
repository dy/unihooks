import { useState as useNativeState, useMemo } from 'any-hooks'

export default function useState (init, deps=[]) {
  let isFirst = false
  let [value, setValue] = useNativeState(init)

  // https://github.com/WebReflection/augmentor/issues/19 etc
  if (init === value && typeof init === 'function') {
    value = init()
  }

  // let isFirst
  useMemo(() => {
    isFirst = true
  }, [])

  // reset init value if deps change
  useMemo(() => {
    if (isFirst) return
    value = typeof init === 'function' ? init(value) : init
  }, deps)

  return [value, setValue]
}
