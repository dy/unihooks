import { useRef } from './standard'

export default function useFormField (target, props) {
  let stateRef = useRef()

  if (stateRef.current) return stateRef.current

  let state = {}

  // props
  state.value = props.value
  state.error
  state.valid
  state.active
  state.touched
  state.modified
  state.element
  state.initialValue = props.value
  state.ref = el => state.element = el
  state.onChange = e => {
    actions.validate()
  }
  state.inputProps = {
    value: state.value,
    onChange: state.onChange
  }

  // actions
  state.set = state.setValue = (value) => state.value = value
  state.reset = () => state.setValue(state.initialValue)
  state.validate = () => {
    if (Array.isArray(props.validate)) {
      return props.validate.every(validate => validate(state.value))
    }
    let validationResult = props.validate(state.value)
    if (validationResult === true || validationResult === undefined) {
      state.valid = true
      state.error = null
    }
    else {
      state.valid = false
      state.error = validationResult
    }
    return state.valid
  }
  state.focus = () => {}
  state.blur = () => {}
  state.clear = () => state.setValue(null)
  state.setTouched = () => {}
  state.setError = () => {}

  // interface
  state.valueOf = state[Symbol.toPrimitive] = () => state.value
  state[Symbol.iterator] = function*() {
    yield valueState
    yield setValueState
  }

  let valueState = Object.assign(new String(), state)
  let setValueState = Object.assign(value => state.set(value), state)

  // fn state is like value state, but also a function
  return stateRef.current = setValueState
}

