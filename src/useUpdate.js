import { useState } from './standard'
export default function useUpdate () {
  let [v, setV] = useState(0)
  return useMemo(() => {
    let update = () => setV(v => v + 1)
    update[Symbol.iterator] = function * () {
      yield update
      yield update
      yield update
      return update
    }
    return update
  }, [])
}
