import { useEffect, useCallback, useState } from './standard'
import * as timers from 'worker-timers'
import isNode from 'is-node'

const setInterval = (isNode ? global : timers).setInterval
const clearInterval = (isNode ? global : timers).clearInterval

// start countdown timer
export default function useCountdown(n, interval = 1000) {
  const [count, set] = useState(n)

  const reset = useCallback(() => {
    set(n)
  }, [n])

  useEffect(() => {
    let timeoutId = setInterval(() => {
      set(count => {
        if (count <= 0) return (clearInterval(timeoutId), 0)
        else return count - 1
      })
    }, interval)

    return () => {
      clearInterval(timeoutId)
    }
  }, [interval])

  return [count, reset]
}
