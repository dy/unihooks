import t from 'tape'
import { useInput, useEffect } from '../src/'
import enhook from 'enhook'
import { tick, idle, frame } from 'wait-please'


t('useInput: basic', async t => {
  let log = []
  let input = document.createElement('input')
  input.value = 'foo'

  let f = enhook(() => {
    let [v, setV] = useInput(input, 'bar')
    log.push(v)
    useEffect(() => {
      setV('bar')
    }, [])
  })
  f()

  t.deepEqual(log, ['foo'])

  await frame(2)

  t.deepEqual(log, ['foo', 'bar'])
  t.equal(input.value, 'bar')

  input.value = 'baz'
  input.dispatchEvent(new Event('change'))
  await frame(2)
  t.deepEqual(log, ['foo', 'bar', 'baz'])

  f.unhook()
  t.end()
})


t('useInput: selector', async t => {
  let log = []
  let input = document.createElement('input')
  input.value = 'xyz'

  let f = enhook(() => {
    let [v, setV] = useInput('input', 'foo')
    log.push(v)
    useEffect(() => {
      setV('bar')
    }, [])
  })
  f()

  t.deepEqual(log, ['foo'])
  await frame(2)
  t.deepEqual(log, ['foo', 'bar'])

  document.body.appendChild(input)
  f()
  await frame(2)
  t.deepEqual(log, ['foo', 'bar', 'xyz'])
  t.equal(input.value, 'xyz')

  document.body.removeChild(input)
  f.unhook()
  t.end()
})
