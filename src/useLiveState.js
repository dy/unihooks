import * as bindings from './live-binding-pool'
import { useLayoutEffect } from './standard'

let sem = 0, max = 255

export default function useLiveState(init) {
  if (sem >= max) throw Error('No available live bindings.')

  let id = sem++
  let value = bindings['_' + id.toString(16)]
  let setValue = bindings['$' + id.toString(16)]

  useLayoutEffect(() => sem--)

  return [value, setValue]
}
