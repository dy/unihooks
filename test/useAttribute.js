import t from 'tst'
import enhook from './enhook.js'
import { tick, frame } from 'wait-please'
import { useAttribute, useEffect, useRef } from '../src/index'

t('useAttribute: basics', async t => {
  let log = []
  let el = document.createElement('div')
  el.setAttribute('foo', 'bar')
  let f = enhook(() => {
    let [foo, setFoo] = useAttribute(el, 'foo')
    log.push(foo)
    useEffect(() => {
      setFoo('baz')
    }, [])
  })

  f()

  t.deepEqual(log, ['bar'])
  await tick(2)
  t.deepEqual(log, ['bar', 'baz'])
  t.equal(el.getAttribute('foo'), 'baz')

  el.setAttribute('foo', 'qux')
  await tick(2)
  t.deepEqual(log, ['bar', 'baz', 'qux'])

  el.setAttribute('bar', 'baz')
  await tick(2)
  t.deepEqual(log, ['bar', 'baz', 'qux'])

  t.end()
})

t('useAttribute: handle ref', async t => {
  let log = []

  let el = document.createElement('div')
  el.setAttribute('foo', 'bar')

  let f = enhook(() => {
    let ref = useRef()
    let [foo, setFoo] = useAttribute(ref, 'foo')
    log.push(foo)
    ref.current = el

    useEffect(() => () => setFoo())
  })
  f()

  await frame(1)
  t.deepEqual(log, [null])
  f()
  await frame(2)
  t.deepEqual(log, [null, 'bar'])

  f.unhook()
  await frame(2)
  t.notOk(el.hasAttribute('foo'))

  t.end()
})

t('useAttribute: properly read initial values', async t => {
  let log = []

  let el = document.createElement('div')
  el.setAttribute('a', '')
  el.setAttribute('c', 'xyz')
  document.body.appendChild(el)

  enhook(() => {
    let [a] = useAttribute(el, 'a')
    let [b] = useAttribute(el, 'b')
    let [c] = useAttribute(el, 'c')
    t.equal(a, true)
    t.equal(b, null)
    t.equal(c, 'xyz')
  })()

  t.end()
})
