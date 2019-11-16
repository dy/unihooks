import t from 'tape'
import { useProperty } from '..'
import enhook, { useEffect } from 'enhook'
import { tick, idle, frame } from 'wait-please'


t.skip('useProperty: basic', async t => {
  let obj = {x: 1}

  let log = []
  let f = enhook(() => {
    let [count, setCount] = useProperty(x, 'count')
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

t.skip('useProperty: multiple components use same key', async t => {
  let log = []

  localStorage.removeItem('count')

  const f = (i, log) => {
    let [count, setCount] = useProperty('count', i)
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

t.skip('useProperty: does not trigger unchanged updates', async t => {
  localStorage.removeItem('count')
  let log = []
  let f = enhook((i) => {
    let [count, setCount] = useProperty('count', i)
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

t.only('useProperty: keeps prev setter/getter', async t => {
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

  t.is(log, ['get', 0, 'call', 0])

  // obj.x
  // await frame(2)
  // t.is(log, ['get', 0, 'call', 0, 'get', 0])

  // obj.x = 1
  // await frame(2)
  // t.is(log, ['get', 0, 'call', 0, 'get', 0, 'set', 1, 'call', 1])

  // log = []
  // xs.cancel()
  // t.is(log, [])

  // obj.x
  // t.is(log, ['get', 1])

  // obj.x = 0
  // await frame(2)
  // t.is(log, ['get', 1, 'set', 0])
})



