import { useChannel, useEffect } from '..'
import t from 'tst'
import enhook from './enhook.js'
import { tick, frame, time } from 'wait-please'

t('useChannel: dones not init twice', async t => {
  let log = []

  let f1 = enhook(() => {
    let [value, setValue] = useChannel('a', 1)
    log.push(value)
  }), f2 = enhook(() => {
    let [value, setValue] = useChannel('a', 2)
    log.push(value)
  })

  f1()
  f2()
  await frame(2)
  t.deepEqual(log, [1, 1])
  await frame(2)
  t.deepEqual(log, [1, 1])

  f1.unhook()
  f2.unhook()

  await frame(2)

  t.end()
})

t('useChannel: does not trigger unchanged updates too many times', async t => {
  let log = []
  let fn = enhook((i) => {
    let [count, setCount] = useChannel('count', i)

    log.push(count)
    useEffect(() => {
      setCount(i + 1)
      setCount(i)
    }, [])
  })
  fn(1)
  t.deepEqual(log, [1])
  await frame(2)
  t.deepEqual(log, [1, 1])

  fn.unhook()
  await frame(2)

  t.end()
})

t('useChannel: does not call same-value update more than once', async t => {
  let log = []
  let f = enhook(() => {
    let [a, setA] = useChannel('count')
    log.push('a', a)
    let [b, setB] = useChannel('count', () => 1)
    log.push('b', b)
    let [c, setC] = useChannel('count', 2)
    log.push('c', c)
    useEffect(() => {
      setA(2)
      setB(2)
      setC(2)
    }, [])
  })
  f()
  t.deepEqual(log, ['a', undefined, 'b', 1, 'c', 1])

  log = []
  await frame(2)
  t.deepEqual(log, ['a', 2, 'b', 2, 'c', 2])

  f.unhook()

  t.end()
})

t('useChannel: reinitialize storage is fine', async t => {
  let log = []

  let f = enhook((key, value) => {
    let [foo] = useChannel(key, value)
    log.push(foo)
  })
  f('foo', 'bar')
  await frame()
  t.deepEqual(log, ['bar'])
  f('foo2', 'baz')
  await frame()
  t.deepEqual(log, ['bar', 'baz'])

  f.unhook()

  t.end()
})

t('useChannel: async setter is fine', async t => {
  let log = []

  let f = enhook(() => {
    let [foo] = useChannel('foo', async () => {
      await tick()
      return 'foo'
    })

    log.push(foo)
  })
  f()

  t.ok(log[0] instanceof Promise)
  await time()
  t.equal(log[1], 'foo')

  f.unhook()

  t.end()
})

t('useStore: multiple components use same key', async t => {
  let log = []

  const f = (i) => {
    let [count, setCount] = useChannel('count', i)
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
  await frame(4)
  t.deepEqual(log, ['call', 1, 1, 'effect', 1, 'call', 1, 1])

  log = []
  f2(2, log)
  await frame(4)
  t.deepEqualAny(log, [
    ['call', 2, 1, 'effect', 2, 'call', 2, 2, 'call', 1, 2],
    ['call', 2, 1, 'effect', 2, 'call', 1, 2, 'call', 2, 2],
  ])

  f1.unhook()
  f2.unhook()
  await frame(2)

  t.end()
})

t('useChannel: functional setter', async t => {
  let log = []
  let f = enhook(() => {
    let [count, setCount] = useChannel('count', 0)
    log.push(count)
    useEffect(() => {
      setCount(count => {
        return count + 1
      })
    }, [])
  })
  f()
  t.deepEqual(log, [0])
  await frame(2)
  t.deepEqual(log, [0, 1])
  f.unhook()

  t.end()
})

t('useChannel: init must be called once per key', async t => {
  let log = []
  let f = enhook(() => {
    let [a, setA] = useChannel('a', () => {
      log.push(1)
    })
    let [a1, setA1] = useChannel('a', () => {
      log.push(2)
    })
  })
  let f2 = enhook(() => {
    let [a, setA] = useChannel('a', () => {
      log.push(3)
    })
  })
  f()
  f2()
  t.deepEqual(log, [1])
  f.unhook()
  t.end()
})

t('useChannel: useQueryParam atomico case (must not fail)', async t => {
  let f1 = enhook(() => {
    let [a, set] = useChannel('a')
  })
  f1()
  f1.unhook()

  let f2 = enhook((params) => {
    let [a, set] = useChannel('a')
    set(1)
  })
  f2()
  f2.unhook()

  await frame(2)

  t.end()
})
