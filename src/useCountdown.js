import useState from './useState'
import useCallback from './useCallback'
import useEffect from './useEffect'
import * as timers from './util/timers'

// start countdown timer
export default function useCountdown(n, interval = 1000) {
  const [count, set] = useState(n)

  const reset = useCallback(() => {
    set(n)
  }, [n])

  useEffect(() => {
    let timeoutId = timers.setInterval(() => {
      set(count => {
        if (count <= 0) return (timers.clearInterval(timeoutId), 0)
        else return count - 1
      })
    }, interval)

    return () => {
      timers.clearInterval(timeoutId)
    }
  }, [interval])

  return [count, reset]
}
