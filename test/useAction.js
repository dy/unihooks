import t from 'tape'
import enhook from 'enhook'
import { useAction, createAction, useStore, createStore, useEffect } from '..'
import { tick, frame, time } from 'wait-please'


t.only('useAction: basic', async t => {
  let log = []

  createStore('foo', { bar: 'baz' })

  createAction('foo', () => {
    let [foo, setFoo] = useStore('foo')
    log.push(foo)

    useEffect(() => {
      setFoo({ bar: 'qux' })
    }, [])
  })

  let f = enhook(() => {
    let foo = useAction('foo')
    foo()
  })
  f()

  await frame(4)
  t.deepEqual(log, [{ bar: 'baz'}, { bar: 'qux'}])
  await frame(4)
  t.deepEqual(log, [{ bar: 'baz'}, { bar: 'qux'}])

  t.end()
})
