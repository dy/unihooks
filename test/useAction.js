import t from 'tape'
import enhook from 'enhook'
import { useAction, createAction, useStore, createStore, useEffect } from '../src/index'
import { channels } from '../src/useStore'
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

  await frame(4)
  t.deepEqual(log, [{ bar: 'baz'}, { bar: 'qux'}])
  await frame(4)
  t.deepEqual(log, [{ bar: 'baz'}, { bar: 'qux'}])

  for (let channel in channels) { (channels[channel].close(), delete channels[channel]) }
  t.end()
})


t.skip('useAction: must not deadlock setStore', async t => {
  await clearNodeFolder()

  let log = []
  let store = createStore('items', [1, 2, 3])
  let action = createAction('push', e => {
    let [items, setItems] = useStore('items')
    setItems([...items, items.length])
  })

  // action()

  t.end()
})

t.skip('useAction: actions are not reactive', async t => {
  let action = createAction(function () {
    let [x, setX] = useState(0)
    setX(1)
  })
  action()

  t.end()
})
