import t from 'tape'
import enhook from 'enhook'
import { usePrevious, useState } from '..'
import { tick } from 'wait-please'

t('usePrevious: basics', async t => {
  let log = []
  let f = enhook(() => {
    let [foo, setFoo] = useState(1)
    let [fooPrev] = usePrevious(foo)
    log.push(foo, fooPrev)
  })
  f()

  t.deepEqual(log, [ 1, undefined ])

  await tick()
  f()
  t.deepEqual(log, [ 1, undefined, 1, 1 ])

  t.end()
})
