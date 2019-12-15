import { useStorage, useEffect } from '../src/index'
import { cache } from '../src/useStorage'
import t from 'tape'
import enhook from 'enhook'
import { tick } from 'wait-please'

t('useStorage: functional set param', async t => {
  let myStorage = new Map([['x', 1]])

  let log = []

  let f = enhook(() => {
    let [value, setValue] = useStorage(myStorage, 'x', (value) => value + 1)
    log.push(value)
    useEffect(() => {
      setValue((value) => {
        log.push(value)
        return value + 1
      })
    }, [])
  })
  f()
  await tick(3)
  t.deepEqual(log, [2, 2, 3])

  cache.delete(myStorage)

  t.end()
})

t('useStorage: fn init should be called per hook', async t => {
  let myStorage = new Map([['count', 0]])
  let log = []
  let f = enhook(() => {
    let [a] = useStorage(myStorage, 'count', -1)
    log.push('a', a)
    let [b] = useStorage(myStorage, 'count', (count) => {
      log.push('init b', count)
      return 1
    })
    log.push('b', b)
    let [c] = useStorage(myStorage, 'count', (count) => {
      log.push('init c', count)
      return 2
    })
    log.push('c', c)
  })
  f()
  t.deepEqual(log, ['a', 0, 'init b', 0, 'b', 1, 'init c', 1, 'c', 2])

  log = []
  f()
  t.deepEqual(log, ['a', 2, 'b', 2, 'c', 2])

  t.end()
})

t.skip('useStorage: async setter is fine', async t => {
  // FIXME: seems to be useless
  let log = []

  let f = enhook(() => {
    let [foo] = useStorage({get(){return 'foo'}, set(){}}, 'xyz', async () => {
      await tick()
      return 'foo'
    })

    log.push(foo)
  })
  f()

  t.deepEqual(log, ['foo'])

  t.end()
})
