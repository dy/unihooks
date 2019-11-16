import t from 'tape'
import enhook from 'enhook'
import { useSyncEffect } from '..'
import { tick, frame } from 'wait-please'

t('useSyncEffect: destructor is fine ', t => {
  let log = []

  let f = enhook((i) => {
    useSyncEffect(() => {
      log.push('on')
      return () => log.push('off')
    }, [i])
  })

  f(1)
  t.deepEqual(log, ['on'])
  f(2)
  t.deepEqual(log, ['on', 'off', 'on'])

  t.end()
})

t('useSyncEffect: async fn is fine', async t => {
  let log = []

  let f = enhook((i) => {
    useSyncEffect(async () => {
      await tick(2)
      log.push(1)
    }, [])
  })

  f()
  await tick(3)
  t.deepEqual(log, [1])
  f()
  await tick(3)
  t.deepEqual(log, [1])

  t.end()
})
