import t from 'tape'
import enhook from 'enhook'
import { useState } from '..'

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

t('useState: deps reinit', async t => {
  let log = []

  let f = enhook((i) => {
    let [v, setV] = useState((prev) => {
      log.push(prev)
      return 1
    }, [i])
  })

  f(1)
  t.deepEqual(log, [undefined])

  f(2)
  t.deepEqual(log, [undefined, 1])

  t.end()
})
