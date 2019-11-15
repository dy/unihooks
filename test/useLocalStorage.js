import t from 'tape'
import { useLocalStorage, useState } from '..'
import enhook, { useEffect } from 'enhook'
import { tick, idle, frame } from 'wait-please'


t('useLocalStorage: basic', async t => {
  localStorage.removeItem('count')

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
  await frame(4)
  t.deepEqual(log, [0, 1])

  await frame(4)
  localStorage.removeItem('count')

  t.end()
})

t('useLocalStorage: multiple components use same key', async t => {
  let log = []

  localStorage.removeItem('count')

  const f = (i, log) => {
    let [count, setCount] = useLocalStorage('count', i)
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

  await frame(4)
  localStorage.removeItem('count')
  t.end()
})

t('useLocalStorage: does not trigger unchanged updates', async t => {
  localStorage.removeItem('count')
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

  await frame(4)
  localStorage.removeItem('count')
  t.end()
})

t('useLocalStorage: lazy init should be called once per key, not per hook', async t => {
  localStorage.removeItem('count')

  let log = []
  let f = enhook(() => {
    useLocalStorage('count', (count) => {
      log.push(1)
      return 1
    })
    useLocalStorage('count', (count) => {
      log.push(2)
      return 2
    })
  })
  f()

  t.deepEqual(log, [1])

  await frame(4)
  localStorage.removeItem('count')
  t.end()
})



