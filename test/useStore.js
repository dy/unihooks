import t from 'tst'
import { useStore, useEffect, useState } from '../src/index'
import { INTERVAL, storage, PREFIX, channels, createStore } from '../src/useStore'
import enhook from './enhook.js'
import { tick, idle, frame, time } from 'wait-please'
import { clearNodeFolder } from 'broadcast-channel'

t('useStore: debounce is 300ms', async t => {
  await clearNodeFolder()
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
  await tick(2)
  // await time(INTERVAL)
  t.deepEqual(log, [0, 1])

  await teardown()
  t.end()
})

t('useStore: multiple components use same key', async t => {
  await clearNodeFolder()
  storage.set(PREFIX + 'count', null)

  let log = []


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
  await teardown()
  t.end()
})

t('useStore: does not trigger unchanged updates', async t => {
  await clearNodeFolder()
  storage.set(PREFIX + 'count', null)

  let log = []
  let fn = enhook((i) => {
    let [count, setCount] = useStore('count', i)

    log.push(count)
    useEffect(() => {
      setCount(i + 1)
      setCount(i)
    }, [])
  })
  fn(1)
  t.deepEqual(log, [1])
  await time(INTERVAL)
  t.deepEqual(log, [1])

  await time(INTERVAL * 2)
  await teardown()
  t.end()
})

t('useStore: fn init should be called per hook', async t => {
  await clearNodeFolder()
  storage.set(PREFIX + 'count', null)

  createStore('count', 0)

  let log = []
  let f = enhook(() => {
    useStore('count', -1)
    useStore('count', (count) => {
      log.push('init', count)
      return 1
    })
    let [value, setValue] = useStore('count', (count) => {
      log.push('reinit', count)
      return 2
    })
    log.push('call', value)
  })
  f()
  t.deepEqual(log, ['init', 0, 'reinit', 1, 'call', 2])

  log = []
  f()
  t.deepEqual(log, ['call', 2])

  await time(INTERVAL)
  await teardown()

  t.end()
})

t.skip('useStore: broadcast', async t => {
  // let React = await import('react')
  // let ReactDOM = await import('react-dom')

  // let el = document.createElement('div')
  // document.body.appendChild(el)

  // ReactDOM.render(<App />, el)

  // function App() {
  //   let [value, setValue] = useStore('foo', 0, { persist: true })

  //   return <button onClick={e => {
  //     setValue(++value)
  //   }}>Click</button>
  // }

  t.end()
})



t('useStore: functional setter', async t => {
  await clearNodeFolder()
  storage.set(PREFIX + 'count', undefined)

  let log = []
  let f = enhook(() => {
    let [count, setCount] = useStore('count', 0)
    log.push(count)
    useEffect(() => {
      setCount(count => {
        return count + 1
      })
    }, [])
  })
  f()
  t.deepEqual(log, [0])
  await tick(2)
  // await time(INTERVAL)
  t.deepEqual(log, [0, 1])

  await teardown()
  t.end()
})

t('useStore: createStore must not rewrite existing data', async t => {
  await clearNodeFolder()
  storage.set(PREFIX + 'count', undefined)

  storage.set(PREFIX + 'xxx', {x: 1})

  let s = createStore('xxx', {y: 2})
  t.deepEqual(s, {x: 1})

  storage.set(PREFIX + 'xxx', null)
  await teardown()
  t.end()
})

t('useStore: persistence serializes store', async t => {
  await clearNodeFolder()

  let log = []

  let s = createStore('x', 1)
  let f1 = enhook(() => {
    let [x, setX] = useStore('x')
    setX(2)
  }, { passive: true })
  f1()

  await time(INTERVAL * 2)
  t.deepEqual(storage.get(PREFIX + 'x'), 2)

  storage.set(PREFIX + 'x', null)
  await teardown()
  t.end()
})

t('useStore: adjacent tabs do not cause recursion', async t => {
  // FIXME: spawn a copy in a separate tab
  await clearNodeFolder()

  let log = []

  let f1 = enhook(() => {
    let [x, setX] = useStore('x')
    useEffect(() => {
      setX({x: [1]})
    }, [])
    log.push(x)
  })
  f1()

  await time(INTERVAL * 6)
  t.deepEqual(log.filter(Boolean), [{x: [1]}])

  storage.set(PREFIX + 'x', null)
  await teardown()
  t.end()
})


export async function teardown() {
  storage.set(PREFIX + 'count', null)
  for (let channel in channels) { (channels[channel].close(), delete channels[channel]) }
}
