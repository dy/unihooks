import t from 'tst'
import { useFormField, useEffect, useState } from '../'
import { render } from 'preact'
import { html } from 'htm/preact'
import { tick, time, frame } from 'wait-please'

t('useFormField: should control existing input via actions', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []

  let Comp = () => {
    let field = useFormField({name: 'x', value: 1})
    useEffect(() => {
      log.push(field.value, field.error, field.touched)
      field.set(2)
      setTimeout(() => {
        log.push(field.value, field.error, field.touched)
        field.set(null)
      }, 10)
      setTimeout(() => {
        log.push(field.value, field.error, field.touched)
        field.reset()
      }, 20)
      setTimeout(() => {
        log.push(field.value, field.error, field.touched)
      }, 30);
    }, [])
    return html`<input ...${ field } />`
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
  render(null, el)

  t.end()
})

t('useFormField: state should reflect interactions', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let [props,field] = useFormField()
    log.push(field.value, field.touched)
    return html`<input ...${props}/>`
  }
  render(html`<${Comp}/>`, el)

  await frame()

  let input = el.querySelector('input')
  input.dispatchEvent(new Event('focus'))
  input.value = 'a'
  input.dispatchEvent(new InputEvent('input', { data: 'a'}))

  await frame(2)
  t.deepEqual(log, ['', false, 'a', true])

  // document.body.removeChild(el)
  render(null, el)

  t.end()
})

t('useFormField: should be able to set value', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let field = useFormField({value: 'foo'})
    useEffect(() => {
      field.set('bar')
    }, [])
    return html`<input ...${field}/>`
  }
  render(html`<${Comp}/>`, el)

  let input = el.querySelector('input')
  t.deepEqual(input.value, 'foo')
  await frame(2)
  t.deepEqual(input.value, 'bar')

  // document.body.removeChild(el)
  render(null, el)

  t.end()
})

t('useFormField: should be able to validate value', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let field = useFormField({ validate: value => !!value })
    log.push(field.error, field.valid)
    return html`<input ...${field}/>`
  }
  render(html`<${Comp}/>`, el)

  let input = el.querySelector('input')
  input.dispatchEvent(new Event('focus'))
  input.value = ''
  input.dispatchEvent(new Event('input', { data: '' }))
  input.dispatchEvent(new Event('blur'))

  t.deepEqual(log, [null, true])
  await frame(2)
  t.deepEqual(log, [null, true, false, false])

  input.dispatchEvent(new Event('focus'))
  input.value = 'foo'
  input.dispatchEvent(new Event('input', { data: 'foo' }))
  input.dispatchEvent(new Event('blur'))

  await frame(2)
  t.deepEqual(log, [null, true, false, false, null, true])

  // document.body.removeChild(el)
  render(null, el)

  t.end()
})

t('useFormField: does not crash on null-validation', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  let Comp = () => {
    let field = useFormField()
    log.push(field.error)
    return html`<input ...${field}/>`
  }
  render(html`<${Comp}/>`, el)

  let input = el.querySelector('input')
  input.dispatchEvent(new Event('focus'))
  input.value = ''
  input.dispatchEvent(new Event('input', { data: '' }))
  input.dispatchEvent(new Event('blur'))

  t.deepEqual(log, [null])
  await frame(2)
  t.deepEqual(log, [null, null])

  input.dispatchEvent(new Event('focus'))
  input.value = 'foo'
  input.dispatchEvent(new Event('input', { data: 'foo' }))
  input.dispatchEvent(new Event('blur'))

  await frame(2)
  t.deepEqual(log, [null, null, null])

  // document.body.removeChild(el)
  render(null, el)

  t.end()
})

t.skip('useFormField: persist test', async t => {
  let el = document.createElement('div')
  document.body.appendChild(el)

  let Comp = () => {
    let field = useFormField({ persist: true })
    return html`<input ...${field}/>`
  }
  render(html`<${Comp}/>`, el)

  await frame(2)

  // document.body.removeChild(el)
  // render(null, el)

  t.end()
})

t('useFormField: focus must reflect focused state', async t => {
  let el = document.createElement('div')

  let log = []
  render(html`<${function () {
    let field = useFormField('')
    log.push(field.focus)
    return html`<input ...${field}/>`
  }}/>`, el)
  let input = el.querySelector('input')
  await frame(1)
  input.dispatchEvent(new Event('focus'))
  await frame(1)
  input.dispatchEvent(new Event('blur'))
  await frame(1)

  t.deepEqual(log, [false, true, false])

  render(null, el)
  t.end()
})

t('useFormField: should not be validated if focused', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  render(html`
    <${function () {
      let field = useFormField({validate(value) { return value ? 'Valid' : 'Invalid' }})
      log.push(field.error)
      return html`<input ...${field} /> ${ field.error + '' }`
    }}/>
  `, el)

  let input = el.querySelector('input')
  input.dispatchEvent(new Event('focus'))
  input.value = 'a'
  input.dispatchEvent(new InputEvent('input'))

  await frame(2)
  // t.deepEqual(log, [null, 'Valid'])
  t.deepEqual(log, [null, null])

  input.value = ''
  input.dispatchEvent(new InputEvent('input'))

  await frame(2)
  t.deepEqual(log, [null, null, null])

  input.dispatchEvent(new Event('blur'))
  await frame(2)
  t.deepEqual(log, [null, null, null, 'Invalid'])

  render(null, el)

  t.end()
})

t('useFormField: `required` should turn initial valid state into false', async t => {
  let el = document.createElement('div')
  // document.body.appendChild(el)

  let log = []
  render(html`
    <${function () {
      let field = useFormField({ required: true })
      log.push(field.valid)
      return html`<input ...${field} /> ${field.error + ''}`
    }}/>
  `, el)
  await frame(2)

  let input = el.querySelector('input')
  t.deepEqual(log, [true])

  input.dispatchEvent(new Event('focus'))
  input.value = 'a'
  input.dispatchEvent(new InputEvent('input'))
  await frame(2)
  t.deepEqual(log, [true, true])

  input.value = ''
  input.dispatchEvent(new InputEvent('input'))
  input.dispatchEvent(new Event('blur'))

  await frame(2)
  t.deepEqual(log, [true, true, false])
  render(null, el)

  t.end()
})

t('useFormField: changed input props must be updated', async t => {
  let el = document.createElement('div')
  let log = []

  render(html`<${function () {
    let [x, setX] = useState([1])
    let field = useFormField({ x })
    log.push(field.x)
    useEffect(() => setX([2]), [])

    return null
  }}/>`, el)

  await frame(3)
  t.deepEqual(log, [[1], [2]])

  render(null, el)

  t.end()
})

t.todo('useFormField: initial value should not be null')
