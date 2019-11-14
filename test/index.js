import t from 'tape'
import { useLocalStorage } from '..'
import enhook, { useEffect } from 'enhook'
import { tick, idle, frame } from 'wait-please'

t('useLocalStorage', async t => {
  useLocalStorage.clear()

  let log = []
  let f = enhook(() => {
    let [count, setCount] = useLocalStorage('count', 0)
    log.push(count)
    useEffect(() => {
      setCount(1)
    }, [])
  })
  f()
  t.deepEqual(log, [0])
  await frame(2)
  t.deepEqual(log, [0, 1])

  t.end()
})
