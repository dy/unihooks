import { useState, useCallback } from './standard'

export default function useDiffState (init) {
  let [value, setValue] = useState(init)

  let setIfDifferent = useCallback(newValue => {
    if (newValue !== value) setValue(newValue)
  }, [])

  return [value, setIfDifferent]
}
