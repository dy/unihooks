import t from 'tape'
import enhook from 'enhook'
import { useAction, createAction, useStore, createStore, useEffect, useState } from '../src/index'
import { INTERVAL, storage, PREFIX, channels } from '../src/useStore'
import { tick, frame, time } from 'wait-please'
import { clearNodeFolder } from 'broadcast-channel'


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

  teardown()
  t.end()
})

t.skip('atomico', async t => {
  let { h, customElement, useEffect, useState, useMemo } = await import("atomico");
  // let { component, useEffect, useState, useMemo } = await import("haunted");

  let log = []

  function X() {
    let [s, setS] = useState(0)

    // this effect is run only once
    useEffect(() => console.log(s))
    useEffect(() => setTimeout(() => setS(2)), [])
    useEffect(() => setTimeout(() => setS(3)), [])

    return null
  }

  // customElements.define('x-x', component(X));
  customElement('x-x', X);
  document.body.appendChild(document.createElement("x-x"));
})

t('useAction: must not deadlock setStore', async t => {
  await clearNodeFolder()
  storage.set(PREFIX + 'items', null)

  let log = []
  let store = createStore('items', [0])

  let action = createAction('push', async e => {
    console.log('action')
    let [items, setItems] = useStore('items')
    log.push(items.length)
    await tick()
    setItems([...items, items.length])
  })
  let fn = enhook(() => {
    useEffect(() => {
    console.log('effect')
      action()
    })
  })

  fn()
  await frame(2)
  t.deepEqual(log, [1])

  fn()
  await frame(2)
  t.deepEqual(log, [1, 2])

  storage.set(PREFIX + 'items', null)
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

  teardown()
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

  teardown()
  t.end()
})

t('useAction: passes args', async t => {
  let log = []
  let action = createAction('args', function (...args) {
    log.push(...args)
  })
  enhook(() => {
    let action = useAction('args')
    action(1, 2, 3)
  })()

  t.deepEqual(log, [1, 2, 3])

  teardown()
  t.end()
})

t('useAction: unknow action throws error', t => {
  t.plan(1)
  enhook(() => {
    t.throws(() => useAction('xxx'))
  })()

  teardown()
  t.end()
})

t('useAction: async action must be awaitable', async t => {
  let log = []

  let a = createAction(async () => {
    log.push(1)
    await tick()
    log.push(2)
  })
  await a()
  t.deepEqual(log, [1, 2])

  teardown()
  t.end()
})

t('useAction: must return result', async t => {
  createAction('f',async () => {
    return Promise.resolve(123)
  })

  let log = []
  enhook(async () => {
    let f = useAction('f')
    log.push(await f())
  })()

  await frame()
  t.deepEqual(log, [123])

  teardown()
  t.end()
})


export async function teardown() {
  for (let channel in channels) { (channels[channel].close(), delete channels[channel]) }
}
