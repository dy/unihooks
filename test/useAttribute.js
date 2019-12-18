import t from 'tape'
import enhook from 'enhook'
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
  t.deepEqual(log, [undefined])
  f()
  await frame(2)
  t.deepEqual(log, [undefined, 'bar'])

  f.unhook()
  await frame(2)
  t.notOk(el.hasAttribute('foo'))

  t.end()
})
