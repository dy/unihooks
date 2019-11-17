import t from 'tape'
import { useGlobalCache, useEffect } from '..'
import enhook from 'enhook'
import { tick, idle, frame } from 'wait-please'
import globalCache from 'global-cache'


t('useGlobalCache: basic', async t => {
  globalCache.set('count', 0)
  let log = []
  let f = enhook(() => {
    let [count, setCount] = useGlobalCache('count')
    log.push(count)
    useEffect(() => {
      setCount(1)
    }, [])
  })
  f()
  t.deepEqual(log, [0])
  await frame(4)
  t.deepEqual(log, [0, 1])

  globalCache.delete('count')
  t.end()
})

t('useGlobalCache: multiple components use same key', async t => {
  let log = []

  const f = (i, log) => {
    let [count, setCount] = useGlobalCache('count', i)
    log.push('call', i, count)
    useEffect(() => {
      log.push('effect', i)
      setCount(i)
    }, [])
  }
  let f1 = enhook(f)
  let f2 = enhook(f)

  f1(1, log)
  t.deepEqual(log, ['call', 1, 1])
  await frame(2)
  t.deepEqual(log, ['call', 1, 1, 'effect', 1])

  f2(2, log)
  await frame(4)
  t.deepEqual(log, ['call', 1, 1, 'effect', 1, 'call', 2, 1, 'effect', 2, 'call', 2, 2, 'call', 1, 2])

  globalCache.delete('count')
  t.end()
})

t('useGlobalCache: does not trigger unchanged updates', async t => {
  let log = []
  let f = enhook((i) => {
    let [count, setCount] = useGlobalCache('count', i)
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

  globalCache.delete('count')
  t.end()
})

t('useGlobalCache: must be writable', async t => {
  globalCache.set('x', 1)

  let log = []

  enhook(() => {
    let [x, setX] = useGlobalCache('x')
    log.push(x)
    setX(2)
  })()

  t.deepEqual(log, [1])
  await tick(3)
  t.deepEqual(log, [1, 2])

  globalCache.delete('x')
  t.end()
})
