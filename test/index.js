import t from 'tape'
import { useLocalStorage } from '..'
import enhook, { useEffect } from 'enhook'
import { tick, idle, frame } from 'wait-please'


t('useLocalStorage: basic', async t => {
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

  useLocalStorage.clear()

  t.end()
})

t('useLocalStorage: multiple components use same key', async t => {
  let log = []

  let f = (i) => {
    let [count, setCount] = useLocalStorage('count', i)
    log.push(count)
    useEffect(() => {
      setCount(i)
    }, [])
  }
  let f1 = enhook(f)
  let f2 = enhook(f)

  f1(1)
  t.deepEqual(log, [1])

  f2(2)
  t.deepEqual(log, [1, 1])

  await frame(2)
  // it ignores extra 1 here since not changed state does not trigger rerendering
  t.deepEqual(log, [1, 1, 2, 2])

  f2(3)
  await frame(2)
  t.deepEqual(log, [1, 1, 2, 2, 2])

  useLocalStorage.clear()
  t.end()
})

t.only('useLocalStorage: must not trigger unchanged updates', async t => {
  let log = []
  let f = enhook((i) => {
    let [count, setCount] = useLocalStorage('count', i)
    log.push(count)
    useEffect(() => {
      setCount(i + 1)
      setCount(i)
    }, [])
  })
  f(1)
  t.deepEqual(log, [1])
  await frame(2)
  t.deepEqual(log, [1])

  useLocalStorage.clear()
  t.end()
})
