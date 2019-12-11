import t from 'tape'
import { useCookie, useEffect } from '../src/index'
import enhook from 'enhook'
import { tick, idle, frame } from 'wait-please'
import * as cookie from 'es-cookie'


t('useCookie: basic', async t => {
  cookie.set('foo', 'bar')
  let log = []
  let f = enhook(() => {
    let [foo, setFoo] = useCookie('foo')
    log.push(foo)
    useEffect(() => {
      setFoo('baz')
    }, [])
  })
  f()
  t.deepEqual(log, ['bar'])
  await frame(4)
  t.deepEqual(log, ['bar', 'baz'])

  cookie.remove('foo')
  t.end()
})

t('useCookie: multiple components use same key', async t => {
  cookie.set('count', 1)
  let log = []

  const f = (i, log) => {
    let [count, setCount] = useCookie('count', i)
    log.push('call', i, count)
    useEffect(() => {
      log.push('effect', i)
      setCount(i)
    }, [])
  }
  let f1 = enhook(f)
  let f2 = enhook(f)

  f1(1, log)
  t.deepEqual(log, ['call', 1, '1'])
  await frame(2)
  t.deepEqual(log, ['call', 1, '1', 'effect', 1])

  f2(2, log)
  await frame(4)
  t.deepEqual(log, ['call', 1, '1', 'effect', 1, 'call', 2, '1', 'effect', 2, 'call', 2, '2', 'call', 1, '2'])

  cookie.remove('count')
  t.end()
})
