import { useSource, useEffect, useState } from '../src/index'
import { cache } from '../src/useSource'
import t from 'tst'
import enhook from './enhook.js'
import { tick, frame, time } from 'wait-please'

t('useSource: functional set param', async t => {
  let myStorage = new Map([['x', 1]])

  let log = []

  let f = enhook(() => {
    let [value, setValue] = useSource(myStorage, 'x', (value) => {
      return value + 1
    })
    log.push(value)
    useEffect(() => {
      setValue((value) => {
        log.push(value)
        return value + 1
      })
    }, [])
  })
  f()
  await frame(3)
  t.deepEqual(log, [2, 2, 3])

  cache.delete(myStorage)

  t.end()
})

t('useSource: does not trigger unchanged updates', async t => {
  let source = new Map([['count', 1]])

  let log = []
  let fn = enhook((i) => {
    let [count, setCount] = useSource(source, 'count', i)

    log.push(count)
    useEffect(() => {
      setCount(i + 1)
      setCount(i)
    }, [])
  })
  fn(1)
  t.deepEqual(log, [1])
  await time(10)
  t.deepEqual(log, [1])

  t.end()
})

t('useSource: fn init should be called per hook', async t => {
  let myStorage = new Map([['count', 0]])
  let log = []
  let f = enhook(() => {
    let [a] = useSource(myStorage, 'count', -1)
    log.push('a', a)
    let [b] = useSource(myStorage, 'count', (count) => {
      log.push('init b', count)
      return 1
    })
    log.push('b', b)
    let [c] = useSource(myStorage, 'count', (count) => {
      log.push('init c', count)
      return 2
    })
    log.push('c', c)
  })
  f()
  t.deepEqual(log, ['a', 0, 'init b', 0, 'b', 1, 'init c', 1, 'c', 2])

  log = []
  f()
  t.deepEqual(log, ['a', 2, 'b', 2, 'c', 2])

  t.end()
})

t('useSource: set/unset does not create two rerenders', async t => {
  let log = []
  let source = new Map([['count', 1]])

  let fn = enhook((i) => {
    let [count, setCount] = useSource(source, 'count', i)

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


t('useSource: reinitialize storage is fine', async t => {
  let log = []

  let storage = new Map([['foo', 'bar'], ['foo2', 'baz']])

  let f = enhook((key) => {
    let [foo] = useSource(storage, key)
    log.push(foo)
  })
  f('foo')
  await frame()
  t.deepEqual(log, ['bar'])
  f('foo2')
  await frame()
  t.deepEqual(log, ['bar', 'baz'])

  t.end()
})

t.skip('useSource: async setter is fine', async t => {
  // FIXME: seems to be useless
  let log = []

  let f = enhook(() => {
    let [foo] = useSource({get(){return 'foo'}, set(){}}, 'xyz', async () => {
      await tick()
      return 'foo'
    })

    log.push(foo)
  })
  f()

  t.deepEqual(log, ['foo'])

  t.end()
})
