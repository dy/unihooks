import t from 'tape'
import { useInput } from '../src/'
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

  t.end()
})
