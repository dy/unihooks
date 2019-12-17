import t from 'tape'
import enhook from 'enhook'
import { tick } from 'wait-please'
import { useAttribute, useEffect } from '../src/index'

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

  el.setAttribute('foo', 'qux')
  await tick(2)
  t.deepEqual(log, ['bar', 'baz', 'qux'])

  el.setAttribute('bar', 'baz')
  await tick(2)
  t.deepEqual(log, ['bar', 'baz', 'qux'])

  t.end()
})

t.skip('useAttribute: handle ref', async t => {
  let log = []

  let el = document.createElement('div')
  el.setAttribute('foo', 'bar')
  let f = enhook(() => {
    let ref = useRef()
    let [foo, setFoo] = useAttribute(ref, 'foo')

    ref.current = el
  })
  f()

  t.end()
})
