import t from 'tst'
import enhook from './enhook.js'
import { useInit } from '../src/index'

t('useInit: basic', t => {
  let log = []

  let f = enhook((i) => {
    useInit(() => {
      log.push('on')
      return () => log.push('off')
    })
  })

  f(1)
  t.deepEqual(log, ['on'])
  f(2)
  t.deepEqual(log, ['on'])

  t.end()
})

