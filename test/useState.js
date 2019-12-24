import t from 'tst'
import enhook from './enhook.js'
import { useState, useEffect, useCallback } from '../src/standard'
import { tick, frame, time } from 'wait-please'

t('useState: initial run once', async t => {
  let log = []

  let f = enhook(() => {
    let [v, setV] = useState((prev) => {
      log.push(prev)
      return 1
    })
  })

  f()
  t.deepEqual(log, [undefined])

  f()
  t.deepEqual(log, [undefined])

  t.end()
})

t('useState: unchanged value does not cause rerender', async t => {
  let log = []
  let x = 0
  let f = enhook(() => {
    let [v, setV] = useState(0)
    log.push(v)
    useEffect(() => {
      setV(() => x)
    }, [x])
  })
  f()

  t.deepEqual(log, [0])

  await frame(4)

  t.deepEqual(log, [0])

  t.end()
})

t('useState: deps reinit', async t => {
  let log = []

  let f = enhook((i) => {
    let [v, setV] = useState((prev) => {
      log.push(prev)
      return 1
    }, [i])
  })

  f(1)
  t.deepEqual(log, [undefined])

  f(2)
  t.deepEqual(log, [undefined, 1])

  t.end()
})

t.skip('useState: double set', async t => {
  let log = []

  let fn = enhook((i) => {
    let [count, setCount] = useState(i)

    log.push(count)
    useEffect(() => {
      setCount(i + 1)
      setCount(i)
    }, [])
  })
  fn(1)
  await frame(3)
  t.deepEqual(log, [1])

  t.end()
})
