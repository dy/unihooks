import t from 'tape'
import { useProperty, useEffect } from '..'
import enhook from 'enhook'
import { tick, idle, frame } from 'wait-please'


t('useProperty: basic', async t => {
  let obj = {count: 0}

  let log = []
  let f = enhook(() => {
    let [count, setCount] = useProperty(obj, 'count')
    log.push(count)
    useEffect(() => {
      setCount(1)
    }, [])
  })
  f()
  t.deepEqual(log, [0])
  await frame(4)
  t.deepEqual(log, [0, 1])
  t.deepEqual(obj, {count: 1})

  t.end()
})

t('useProperty: multiple components use same key', async t => {
  let log = []

  let obj = {count: null}

  const f = (i, log) => {
    let [count, setCount] = useProperty(obj, 'count', i)
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

  t.end()
})

t('useProperty: does not trigger unchanged updates', async t => {
  let obj = {count: null}
  let log = []
  let f = enhook((i) => {
    let [count, setCount] = useProperty(obj, 'count', i)
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

  t.end()
})

t('useProperty: must be writable', async t => {
  let log = []
  let obj = { x : 1 }

  enhook(() => {
    let [x, setX] = useProperty(obj, 'x')
    log.push(x)
    setX(2)
  })()

  t.deepEqual(log, [1])
  await tick(3)
  t.deepEqual(log, [1, 2])

  t.end()
})

t('useProperty: keeps prev setter/getter', async t => {
  let log = []
  let obj = {
    _x: 0,
    get x() {
      log.push('get', this._x); return this._x
    },
    set x(x) {
      log.push('set', x);
      this._x = x
    }
  }

  let f = enhook(() => {
    let [prop, setProp] = useProperty(obj, 'x')
    log.push('call', prop)
  })
  f()

  t.deepEqual(log, ['get', 0, 'call', 0])

  obj.x
  await frame(2)
  t.deepEqual(log, ['get', 0, 'call', 0, 'get', 0])

  obj.x = 1
  await frame(3)
  t.deepEqual(log, ['get', 0, 'call', 0, 'get', 0, 'set', 1, 'call', 1])

  // log = []
  // xs.cancel()
  // t.deepEqual(log, [])

  // obj.x
  // t.deepEqual(log, ['get', 1])

  // obj.x = 0
  // await frame(2)
  // t.deepEqual(log, ['get', 1, 'set', 0])

  t.end()
})


t.skip('useProperty: observes path', async t => {
  t.end()
})



