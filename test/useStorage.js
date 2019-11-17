import { useStorage, useEffect } from '..'
import t from 'tape'
import enhook from 'enhook'
import { tick } from 'wait-please'

t('useStorage: functional set param', async t => {
  let myStorage = new Map([['x', 1]])

  let log = []

  let f = enhook(() => {
    let [value, setValue] = useStorage(myStorage, 'x', (value) => value + 1)
    log.push(value)
    useEffect(() => {
      setValue((value) => {
        log.push(value)
        return value + 1
      })
    }, [])
  })
  f()
  await tick(3)
  t.deepEqual(log, [2, 2, 3])

  t.end()
})
