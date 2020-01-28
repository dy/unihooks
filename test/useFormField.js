import t from 'tst'
import { useFormField, useEffect } from '../'
import { render } from 'preact'
import { html } from 'htm/preact'
import { tick, time } from 'wait-please'

t.only('useFormField: should control existing input via actions', async t => {
  let el = document.createElement('div')
  document.body.appendChild(el)

  let log = []

  let Comp = () => {
    let field = useFormField('x', 1)
    useEffect(() => {
      log.push(field.value, field.error, field.touched)
      field.set(2)
      setTimeout(() => {
        log.push(field.value, field.error, field.touched)
        field.clear()
      }, 10)
      setTimeout(() => {
        log.push(field.value, field.error, field.touched)
        field.reset()
      }, 20)
      setTimeout(() => {
        log.push(field.value, field.error, field.touched)
      }, 30);
    }, [])
    return html`<input ...${ field.inputProps } />`
  }

  render(html`<${Comp}/>`, el)

  await time(50)
  t.deepEqual(log, [
    1, null, false,
    2, null, false,
    null, null, false,
    1, null, false
  ])

  t.end()
})

t('useFormField: state should reflect interactions', t => {
  t.end()
})

t('useFormField: should be able to create new input', t => {
  t.end()
})

t('useFormField: should be able to set value', t => {
  t.end()
})

t('useFormField: should be able to validate value', t => {
  t.end()
})
