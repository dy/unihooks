import t from 'tape'
import enhook from 'enhook'
import { useEffect } from '..'
import { tick, frame } from 'wait-please'

t('useEffect: microtask guaranteed', async t => {
  let log = []

  let f = (i) => {
    log.push('call', i)
    useEffect(() => {
      log.push('effect', i)
      return 1
    })
  }

  let f1 = enhook(f)
  let f2 = enhook(f)
  f1(1)
  f2(2)
  await tick(2)
  t.deepEqual(log, ['call', 1, 'call', 2, 'effect', 1, 'effect', 2])

  t.end()
})

t('useEffect: no-deps runs once', async t => {
  let log = []

  let f = enhook((i) => {
    useEffect(() => log.push(1))
  })

  f()
  await tick(2)
  t.deepEqual(log, [1])
  f()
  await tick(2)
  t.deepEqual(log, [1])

  t.end()
})

t('useEffect: async fn is fine', async t => {
  let log = []

  let f = enhook((i) => {
    useEffect(async () => {
      await tick(2)
      log.push(1)
    })
  })

  f()
  await tick(3)
  t.deepEqual(log, [1])
  f()
  await tick(3)
  t.deepEqual(log, [1])

  t.end()
})
