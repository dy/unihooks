import t from 'tape'
import enhook from 'enhook'
import { useAction, createAction, useStore, createStore, useEffect, useState } from '../src/index'
import { channels } from '../src/useStore'
import { tick, frame, time } from 'wait-please'
import { clearNodeFolder } from 'broadcast-channel'
import { teardown } from './useStore'

t('useAction: basic', async t => {
  await clearNodeFolder()

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
  await tick(2)
  t.deepEqual(log, [{ bar: 'baz'}])
  f()
  t.deepEqual(log, [{ bar: 'baz'}, { bar: 'qux'}])
  await tick(2)

  for (let channel in channels) { (channels[channel].close(), delete channels[channel]) }
  t.end()
})


t('useAction: must not deadlock setStore', async t => {
  await clearNodeFolder()

  let log = []
  let store = createStore('items', [0])
  let action = createAction('push', e => {
    let [items, setItems] = useStore('items')
    log.push(items.length)
    setItems([...items, items.length])
  })

  action()
  t.deepEqual(log, [1])
  await tick()
  action()
  t.deepEqual(log, [1, 2])

  teardown()
  t.end()
})

t('useAction: actions are not reactive', async t => {
  let log = []
  let action = createAction(function () {
    let [x, setX] = useState(0)
    log.push(x)
    setX(++x)
  })
  action()
  t.deepEqual(log, [0])
  action()
  t.deepEqual(log, [0, 1])
  action()
  t.deepEqual(log, [0, 1, 2])

  t.end()
})

t('useAction: actions are not reactive with array', async t => {
  let log = []
  let action = createAction(function () {
    let [x, setX] = useState([0])
    log.push(x.length)
    setX([...x, x.length])
  })
  action()
  t.deepEqual(log, [1])
  action()
  t.deepEqual(log, [1, 2])
  action()
  t.deepEqual(log, [1, 2, 3])

  t.end()
})
