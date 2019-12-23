import t from 'tst'
import enhook from './enhook.js'
import { useChannel, useEffect } from '..'
import { time } from 'wait-please'

t.skip('useChannel: initialize', async t => {
  let log = []

  let a = enhook(() => {
    let [ value, { loading }] = useChannel('charlie')
    log.push('a', value, loading)
  })

  let b = enhook(() => {
    let [ value, { loading }] = useChannel('charlie', 1)
    log.push('b', value, loading)
  })

  let c = enhook(() => {
    let [ value, setValue, { loading }] = useChannel('charlie')
    log.push('c', value, loading)
    useEffect(() => {
      setValue(2)
    }, [])
  })

  a()
  t.deepEqual(log, ['a', undefined, true])
  await time(10)
  t.deepEqual(log, ['a', undefined, true, 'a', undefined, false])

  log = []
  b()
  t.deepEqual(log, ['b', undefined, true])
  await time(10)
  t.deepEqual(log, ['b', undefined, true, 'b', 1, false, 'a', 1, false])

  log = []
  c()
  t.deepEqual(log, ['c', undefined, true])
  await tick()
  t.deepEqual(log, ['c', undefined, true, 'c', 1, false])
  await frame()
  t.deepEqual(log, ['c', undefined, true, 'c', 1, false, 'c', 2, false, 'a', 2, false, 'b', 2, false])

  t.end()
})
