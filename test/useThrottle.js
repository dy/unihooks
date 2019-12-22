import t from 'tst'
import enhook from './enhook.js'
import { useThrottle } from '../src/index'
import { time } from 'wait-please'

t.skip('useThrottle: basics', async t => {
  let log = []
  let f = enhook((x) => {
    let [v] = useThrottle(x, 50)
    log.push(v)
  })
  f(1)
  f(2)
  t.deepEqual(log, [ 1 ])
  await time(10)
  t.deepEqual(log, [ 1 ])
  await time(40)
  t.deepEqual(log, [ 1, 2 ])
  await time(50)
  t.deepEqual(log, [ 1, 2 ])

  t.end()
})
