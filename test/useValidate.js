import t from 'tst'
import enhook from './enhook.js'
import { useValidate, useEffect } from '../'
import { tick, frame, time } from 'wait-please'

t('useValidate: validates single', async t => {
  let log = []

  let f = enhook((arg) => {
    let [err, validate] = useValidate(arg => !!arg)
    log.push(arg, validate(arg), err)
  })

  f('')
  await time(10)
  t.deepEqual(log, ['', false, null, '', false, false])

  log = []
  f('ok')
  await time(10)
  t.deepEqual(log, ['ok', true, false, 'ok', true, null])

  t.end()
})

t('useValidate: validates array', async t => {
  let log = []

  let f = enhook((arg) => {
    let [err, validate] = useValidate([v => !!v, v => v === 'b'])
    log.push(arg, validate(arg), err)
  })

  f('')
  await time(10)
  t.deepEqual(log, ['', false, null, '', false, false])

  log = []
  f('a')
  await time(10)
  t.deepEqual(log, ['a', false, false])

  log = []
  f('b')
  await frame(2)
  t.deepEqual(log, ['b', true, false, 'b', true, null])

  t.end()
})

t.skip('useValidate: error in validator', async t => {
  let log = []

  let f = enhook((arg) => {
    let [err, validate] = useValidate(arg => xxx)
    log.push(arg, validate(arg), err)
  })

  f('')
  await time(10)
  log[5] = log[5].name
  t.deepEqual(log, ['', false, null, '', false, 'ReferenceError'])

  t.end()
})

t('useValidate: error in array', async t => {
  let log = []

  let f = enhook((arg) => {
    let [err, validate] = useValidate([v => true, v => v === 'b' ? true : 'ugh'])
    log.push(arg, validate(arg), err)
  })

  await time(10)

  log = []
  f('a')
  await time(10)
  t.deepEqual(log, ["a", false, null, 'a', false, 'ugh'])

  t.end()
})
