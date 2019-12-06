import t from 'tape'
import enhook from 'enhook'
import { useCountdown } from '..'
import { time } from 'wait-please'

t('useCountdown: basics', async t => {
  let log = []
  let f = enhook(() => {
    let [n, reset] = useCountdown(3, 50)
    log.push(n)
  })
  f()

  t.deepEqual(log, [ 3 ])
  await time(300)
  t.deepEqual(log, [ 3, 2, 1, 0 ])

  t.end()
})
