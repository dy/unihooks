import t from 'tst'
import enhook from './enhook.js'
import { tick, frame, time } from 'wait-please'
import { value } from 'observable'
import { useObservable } from '../index.js'

t('useObservable: core', async t => {
  let log = []
  let v = value(0)
  let f = enhook(() => {
    let [val, setVal] = useObservable(v)
    log.push(val)
    setTimeout(() => setVal(1))
  })

  f()
  await frame()
  t.is(log, [0])

  await time(15)
  t.is(log, [0, 1])
  t.is(v(), 1)

  t.end()
})
