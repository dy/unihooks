import t from 'tape'
import enhook from 'enhook'
import { useState, useEffect, useCallback } from '../src/util/hooks'
import { tick, frame } from 'wait-please'

t('useState: initial run once', async t => {
  let log = []

  let f = enhook(() => {
    let [v, setV] = useState((prev) => {
      log.push(prev)
      return 1
    })
  })

  f()
  t.deepEqual(log, [undefined])

  f()
  t.deepEqual(log, [undefined])

  t.end()
})

t('useState: unchanged value does not cause rerender', async t => {
  let log = []
  let x = 0
  let f = enhook(() => {
    let [v, setV] = useState(0)
    log.push(v)
    useEffect(() => {
      setV(() => x)
    }, [x])
  })
  f()

  t.deepEqual(log, [0])

  await frame(4)

  t.deepEqual(log, [0])

  t.end()
})
