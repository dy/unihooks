import t from 'tst'
import { useFormField, useEffect } from '../'
import { render } from 'preact'
import { html } from 'htm/preact'
import { tick, time, frame } from 'wait-please'

t('useFormField: should control existing input via actions', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

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

  // document.body.removeChild(el)

  t.end()
})

t('useFormField: state should reflect interactions', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let [field, actions] = useFormField('x')
    log.push(field.value, field.touched)
    return html`<input ...${field.inputProps}/>`
  }
  render(html`<${Comp}/>`, el)

  let input = el.querySelector('input')
  input.value = 'a'
  input.dispatchEvent(new Event('input', { data: 'a'}))

  await frame(2)
  t.deepEqual(log, [undefined, false, 'a', true])

  // document.body.removeChild(el)

  t.end()
})

t('useFormField: should be able to set value', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let field = useFormField('x', 'foo')
    useEffect(() => {
      field.set('bar')
    }, [])
    return html`<input ...${field.inputProps}/>`
  }
  render(html`<${Comp}/>`, el)

  let input = el.querySelector('input')
  t.deepEqual(input.value, 'foo')
  await frame(2)
  t.deepEqual(input.value, 'bar')

  // document.body.removeChild(el)

  t.end()
})

t('useFormField: should be able to validate value', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let field = useFormField({ name: 'x', validate: value => !!value })
    log.push(field.error)
    return html`<input ...${field.inputProps}/>`
  }
  render(html`<${Comp}/>`, el)

  let input = el.querySelector('input')
  input.value = ''
  input.dispatchEvent(new Event('input', { data: '' }))
  input.dispatchEvent(new Event('blur'))

  t.deepEqual(log, [null])
  await frame(2)
  t.deepEqual(log, [null, false])

  input.value = 'foo'
  input.dispatchEvent(new Event('input', { data: 'foo' }))
  input.dispatchEvent(new Event('blur'))

  await frame(2)
  t.deepEqual(log, [null, false, null])

  // document.body.removeChild(el)

  t.end()
})

t('useFormField: does not crash on null-validation', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let field = useFormField('x')
    log.push(field.error)
    return html`<input ...${field.inputProps}/>`
  }
  render(html`<${Comp}/>`, el)

  let input = el.querySelector('input')
  input.value = ''
  input.dispatchEvent(new Event('input', { data: '' }))
  input.dispatchEvent(new Event('blur'))

  t.deepEqual(log, [null])
  await frame(2)
  t.deepEqual(log, [null, null])

  input.value = 'foo'
  input.dispatchEvent(new Event('input', { data: 'foo' }))
  input.dispatchEvent(new Event('blur'))

  await frame(2)
  t.deepEqual(log, [null, null, null])

  // document.body.removeChild(el)

  t.end()
})

t.skip('useFormField: persist test', async t => {
  let el = document.createElement('div')
  document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let field = useFormField('y')
    return html`<input ...${field.inputProps}/>`
  }
  render(html`<${Comp}/>`, el)

  await frame(2)

  // document.body.removeChild(el)

  t.end()
})

