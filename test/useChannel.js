import t from 'tst'
import enhook from './enhook.js'
import { useChannel } from '..'
import { time } from 'wait-please'

t.only('useChannel: initialize', t => {
  let log = []

  let a = enhook(() => {
    let [ value, { loading }] = useChannel('charlie')
    log.push('a', value, loading)
  })

  let b = enhook(() => {
    let [ value, { loading }] = useChannel('charlie', 1)
    log.push('b', value, loading)
  })

  a()
  t.deepEqual(log, ['a', undefined, true])
  await tick()
  t.deepEqual(log, ['a', undefined, true, 'a', undefined, false])

  b()
  t.deepEqual(log, ['a', undefined, true, 'a', undefined, false])
  await time(10)
  t.deepEqual(log, ['a', undefined, true, 'a', undefined, false, 'b', undefined, true, 'b', 1, false, 'a', 1, false])


  t.end()
})
