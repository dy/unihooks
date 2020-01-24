import t from 'tst'
import { useEffect } from 'any-hooks'
import { useStorage } from '../'
import enhook from './enhook.js'
import { tick, idle, frame } from 'wait-please'


t.only('useStorage: basic', async t => {
  localStorage.removeItem('count')

  let log = []
  let f = enhook(() => {
    let [count, setCount] = useStorage('count', 0)
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

t('useStorage: multiple components use same key', async t => {
  let log = []

  localStorage.removeItem('count')

  const f = (i, log) => {
    let [count, setCount] = useStorage('count', i)
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

t('useStorage: does not trigger unchanged updates', async t => {
  localStorage.removeItem('count')
  let log = []
  let f = enhook((i) => {
    let [count, setCount] = useStorage('count', i)
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

t('useStorage: fn init should be called per hook', async t => {
  localStorage.setItem('count', 0)

  let log = []
  let f = enhook(() => {
    useStorage('count', -1)
    useStorage('count', (count) => {
      log.push(count)
      return 1
    })
    let [value, setValue] = useStorage('count', (count) => {
      log.push(count)
      return 2
    })
    log.push(value)
  })
  f()
  t.deepEqual(log, [0, 1, 2])

  f()
  t.deepEqual(log, [0, 1, 2, 2])

  await frame(4)
  localStorage.removeItem('count')
  t.end()
})



