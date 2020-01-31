import t from 'tst'
import { useInput, useEffect, useRef } from '../'
import enhook from './enhook.js'
import { tick, idle, frame } from 'wait-please'
import { render } from 'preact'
import { html } from 'htm/preact'


t('useInput: element', async t => {
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


t('useInput: ref', async t => {
  let log = []
  let el = document.createElement('div')

  render(html`<${() => {
    let ref = useRef()
    let [v, setV] = useInput(ref)
    log.push(v)
    useEffect(() => {
      setV('foo')
    }, [])

    return html`<input ref=${ref}/>`
  }}/>`, el)

  let input = el.querySelector('input')
  await frame(2)
  t.equal(input.value, 'foo')
  t.deepEqual(log, [undefined, 'foo'])

  render(null, el)

  t.end()
})
