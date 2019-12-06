import t from 'tape'
import { useStore, useEffect } from '..'
import { INTERVAL, storage, PREFIX } from '../src/useStore'
import enhook from 'enhook'
import { tick, idle, frame, time } from 'wait-please'

t('useStore: debounce is 300ms', async t => {
  storage.set(PREFIX + 'count', undefined)

  let log = []
  let f = enhook(() => {
    let [count, setCount] = useStore('count', 0)
    log.push(count)
    useEffect(() => {
      setCount(1)
    }, [])
  })
  f()
  t.deepEqual(log, [0])
  await time(INTERVAL / 2)
  t.deepEqual(log, [0])
  await time(INTERVAL)
  t.deepEqual(log, [0, 1])

  storage.set(PREFIX + 'count', undefined)
  t.end()
})

t('useStore: multiple components use same key', async t => {
  let log = []

  storage.get(PREFIX + 'count', null)

  const f = (i, log) => {
    let [count, setCount] = useStore('count', i)
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
  await time(INTERVAL)
  t.deepEqual(log, ['call', 1, 1, 'effect', 1])

  f2(2, log)
  await time(INTERVAL * 2)
  t.deepEqual(log, ['call', 1, 1, 'effect', 1, 'call', 2, 1, 'effect', 2, 'call', 2, 2, 'call', 1, 2])

  await time(INTERVAL)
  storage.set(PREFIX + 'count', null)
  t.end()
})

t('useStore: does not trigger unchanged updates', async t => {
  storage.set(PREFIX + 'count', null)
  let log = []
  let f = enhook((i) => {
    let [count, setCount] = useStore('count', i)
    log.push(count)
    useEffect(() => {
      setCount(i + 1)
      setCount(i)
    }, [])
  })
  f(1)
  t.deepEqual(log, [1])
  await time(INTERVAL)
  t.deepEqual(log, [1])

  await time(INTERVAL * 2)
  storage.set(PREFIX + 'count', null)
  t.end()
})

t('useStore: fn init should be called per hook', async t => {
  storage.set(PREFIX + 'count', 0)

  let log = []
  let f = enhook(() => {
    useStore('count', -1)
    useStore('count', (count) => {
      log.push(count)
      return 1
    })
    let [value, setValue] = useStore('count', (count) => {
      log.push(count)
      return 2
    })
    log.push(value)
  })
  f()
  t.deepEqual(log, [0, 1, 2])

  f()
  t.deepEqual(log, [0, 1, 2, 2])

  await time(INTERVAL)
  storage.set(PREFIX + 'count', null)
  t.end()
})

t.skip('useStore: broadcast', async t => {
  // let React = await import('react')
  // let ReactDOM = await import('react-dom')

  let el = document.createElement('div')
  document.body.appendChild(el)

  ReactDOM.render(<App />, el)

  function App() {
    let [value, setValue] = useStore('foo', 0, { persist: true })

    return <button onClick={e => {
      setValue(++value)
    }}>Click</button>
  }

  t.end()
})


