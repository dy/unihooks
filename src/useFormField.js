export default function useFormField (descriptor, init) {

  const state = new String()
  state.value
  state.error
  state.invalid
  state.active
  state.touched
  state.modified
  state.element
  state.input
  state.initial


  function actions (value) {
    return actions.set(value)
  }
  actions.set = () => {}
  actions.reset = () => {}
  actions.validate = () => {}
  actions.focus = () => {}
  actions.blur = () => {}

  return [state, actions]
}
