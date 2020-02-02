import setHooks, * as hooks from "any-hooks"

export * from 'any-hooks'
export default setHooks

const listeners = globalThis.__uhxListeners || (globalThis.__uhxListeners = {}),
  values = globalThis.__uhxValues || (globalThis.__uhxValues = {})

export function useChannel(key, init, deps=[]) {
  let [, setState] = hooks.useState()
  let initKey = hooks.useRef()

  hooks.useMemo(() => {
    (listeners[key] || (listeners[key] = [])).push(setState)

    if (init === undefined) return
    // if (key in values) return console.warn(`Channel ${key} is already initialized.`)
    if (
      !(key in values) || // init run
      initKey.current === key // or deps changed
    ) {
      initKey.current = key
      if (typeof init === 'function') init = init()
      values[key] = init
      if (init && init.then) init.then(init => setState(values[key] = init))
    }
  }, [key, ...deps])

  hooks.useLayoutEffect(() => () => {
    listeners[key].splice(listeners[key].indexOf(setState) >>> 0, 1)
    if (!listeners[key].length) {
      delete values[key]
    }
  }, [key, ...deps])

  return [values[key], (value) => {
    values[key] = typeof value === 'function' ? value(values[key]) : value
    listeners[key].map((setState) => setState(value))
  }]
}

export function useAction(key, init, deps = []) {
  let [action, setAction] = useChannel('__uhx:action-' + key, init !== undefined ? () => init : undefined, deps)
  return hooks.useMemo(() => {
    if (typeof action !== 'function') return [action]
    action[Symbol.iterator] = function*() { yield action; yield setAction; }
    return action
  }, [action, ...deps])
}

export function useStorage(key, init, o) {
  o = { storage: window.localStorage, prefix: '__uhx:storage-', ...(o || {}) }
  let storeKey = o.prefix + key
  let [value, setValue] = useChannel(key, () => {
    // init from stored value, if any
    let storedStr = o.storage.getItem(storeKey), storedValue
    if (storedStr != null) {
      storedValue = JSON.parse(storedStr)
      if (typeof init === 'function') return init(storedValue)
      return storedValue
    }
    return init
  })

  hooks.useMemo(() => {
    // persist initial value, if store is rewired
    if (init === undefined) return
    if (o.storage.getItem(storeKey) == null) o.storage.setItem(storeKey, JSON.stringify(value))
  }, [key])

  hooks.useEffect(() => {
    // notify listeners, subscribe to storage changes
    let update = e => {
      if (e.key !== storeKey) return
      setValue(e.newValue)
    }
    window.addEventListener('storage', update)
    return () => window.removeEventListener('storage', update)
  }, [key])

  return [value, (value) => {
    setValue(value)
    // side-effect write
    o.storage.setItem(storeKey, JSON.stringify(value))
  }]
}

wrapHistory('push')
wrapHistory('replace')
enableNavigateEvent()
export function useSearchParam(key, init) {
  let [value, setValue] = useChannel('__uhx:search-param-' + key, () => {
    let params = new URLSearchParams(window.location.search)
    if (params.has(key)) {
      let paramValue = params.get(key)
      if (typeof init === 'function') return init(paramValue)
      return paramValue
    }
    return init
  })

  hooks.useMemo(() => {
    if (init === undefined) return
    let params = new URLSearchParams(window.location.search)
    if (!params.has(key)) {
      params.set(key, value)
      setURLSearchParams(params)
    }
  }, [key])

  hooks.useEffect(() => {
    const update = (e) => {
      let params = new URLSearchParams(window.location.search)
      let newValue = params.get(key)
      if (newValue !== value) setValue(newValue)
    }

    window.addEventListener('popstate', update)
    window.addEventListener('pushstate', update)
    window.addEventListener('replacestate', update)
    window.addEventListener('navigate', update)

    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener('pushstate', update)
      window.removeEventListener('replacestate', update)
      window.removeEventListener('navigate', update)
    }
  }, [key])

  return [value, value => {
    let params = new URLSearchParams(window.location.search)
    params.set(key, value)
    setURLSearchParams(params)
  }]
}
function setURLSearchParams(params) {
  let str = params.toString()
  window.history.replaceState(null, '', str ? '?' + str : window.location.href.split('?')[0])
}
// https://stackoverflow.com/a/25673946/1052640
// https://github.com/lukeed/navaid/blob/master/src/index.js#L80-L90
function wrapHistory(type) {
  type += 'State'
  const fn = history[type]
  history[type] = function (uri) {
    let result = fn.apply(this, arguments)
    let ev = new Event(type.toLowerCase())
    ev.uri = uri
    ev.arguments = arguments
    window.dispatchEvent(ev)
    return result
  }
  return () => {
    history[type] = fn
  }
}
// https://github.com/WebReflection/onpushstate
// https://github.com/lukeed/navaid/blob/master/src/index.js#L52-L60
function enableNavigateEvent() {
  const handleNavigate = (e) => {
    // find the link node (even if inside an opened Shadow DOM)
    var target = e.target.shadowRoot ? e.path[0] : e.target;
    // find the anchor
    var anchor = target.closest('A')

    // if found
    if (!anchor) return

    // it's not a click with ctrl/shift/alt keys pressed
    // => (let the browser do it's job instead)
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && !e.button && !e.defaultPrevented) return

    // it's for the current page
    if (!/^(?:_self)?$/i.test(anchor.target)) return

    // same origin
    if (anchor.host !== location.host) return

    // it's not a download
    if (anchor.hasAttribute('download')) return

    // it's not a resource handled externally
    if (anchor.getAttribute('rel') === 'external') return

    // let empty links be (see issue #5)
    if (!anchor.href) return

    var e = new Event('navigate');
    window.dispatchEvent(e);
  }
  document.addEventListener('click', handleNavigate, true)
  return () => document.removeEventListener('click', handleNavigate)
}

export function useCountdown(n, interval = 1000) {
  const [count, set] = hooks.useState(n)

  const reset = hooks.useCallback(() => set(n), [n])

  const schedule = hooks.useMemo(() => {
    return typeof interval === 'function' ? interval : fn => {
      let id = setInterval(fn, interval)
      return () => clearInterval(id)
    }
  }, [interval])

  hooks.useEffect(() => {
    const unschedule = schedule(() => {
      set(count => {
        if (count <= 0) return (unschedule(), 0)
        else return count - 1
      })
    })

    return unschedule
  }, [n, schedule])

  return [count, reset]
}

export function usePrevious(value) {
  let ref = hooks.useRef()

  hooks.useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export function useUpdate() {
  let [, set] = hooks.useState(0)
  let update = hooks.useCallback(() => set(s => ~s), [])
  return update
}

export function useValidate(validator, init) {
  let check = hooks.useCallback((value) => {
    if (!validator) return null

    let check = (value, validator) => {
      try {
        var valid = validator(value)
        if (valid === true || valid == null) {
          return null
        }
        throw valid
      } catch (e) {
        return e
      }
    }
    if (Array.isArray(validator)) return validator.every(validator => check(value, validator))
    return check(value, validator)
  }, [])


  let [error, setError] = hooks.useState(init != null ? () => check(init) : null)

  let validate = hooks.useCallback((value) => {
    let error = check(value, validator)
    setError(error)
    return error == null
  }, [])

  return [error, validate]
}

export function useFormField(props = {}) {
  const prefix = '__uhx:form-field-'

  let { value, validate: rules, required, persist, ...inputProps } = props
  let key = inputProps.name || inputProps.id || inputProps.key

  let inputRef = hooks.useRef()
  let [init, setValue] = persist ? useStorage(key, value, { storage: window.sessionStorage, prefix }) : useChannel(key, value)
  let [focus, setFocus] = hooks.useState(false)
  let [error, validate] = useValidate(rules || (required ? v => !!v : null))

  let field = hooks.useMemo(() => {
    let getValue = () => field.value

    let field = Object.create(
      // invisible, not enumerable (interface)
      {
        valueOf: getValue,
        [Symbol.toPrimitive]: getValue,
        [Symbol.iterator]: function* () {
          yield { ...field } // leave only enumerables (input props)
          yield field
        }
      }, {
      // invisible, enumerable (input props)
      // FIXME: there's no way to define invisible + enumerable for spread
      onBlur: {
        enumerable: true, value: e => {
          setFocus(field.focus = false)
          // revert error to the last value
          field.validate()
        }
      },
      onFocus: {
        enumerable: true, value: e => {
          field.touched = true
          field.error = null
          field.valid = true
          setFocus(field.focus = true)
        }
      },
      onChange: { enumerable: true, value: e => field.set(e.target.value) },
      onInput: { enumerable: true, value: e => field.set(e.target.value) },

      // visible, not enumerable (field state)
      error: { enumerable: false, writable: true, value: null },
      valid: { enumerable: false, writable: true, value: true },
      focus: { enumerable: false, writable: true, value: false },
      touched: { enumerable: false, writable: true, value: false },
      set: {
        enumerable: false, value: (v) => {
          setValue(field.value = v)
          if (!field.focus) field.validate()
        }
      },
      reset: {
        enumerable: false, value: () => {
          setValue(field.value = init)
          field.error = null
          field.valid = true
          field.touched = false
        }
      },
      validate: {
        enumerable: false, value: (value = field.value) => field.valid = validate(value)
      }
    })

    // visible, enumerable (field state + input props)
    Object.assign(field, {
      value: init,
      required,
      ref: inputRef,
    })

    return field
  }, [])

  // sync error with useValidate, recover from focus as well
  hooks.useMemo(() => {
    if (!field.focus) field.error = error
  }, [error, field.focus])

  // update input props whenever they change
  hooks.useMemo(() => {
    Object.assign(field, inputProps)
  }, Object.keys(inputProps).map(key => inputProps[key]))

  return field
}

export function useInput(ref, init) {
  if (ref.nodeType) ref = { current: ref }

  let key = '__uhx:input-' + (ref.current && `${ref.current.id || ''}:${ref.current.type || 'text'}:${ref.current.name || ''}`)

  let [value, setValue] = useChannel(key, () => {
    // init from input
    let value = ref.current && ref.current.value
    if (value != null) {
      if (typeof init === 'function') return init(value)
      return value
    }
    return init
  })

  hooks.useMemo(() => {
    // write value if input is rewired
    if (init === undefined) return
    if (ref.current && ref.current.value == null) {
      ref.current.setAttribute('value', ref.current.value = value)
      if (value == null) ref.current.removeAttribute(value)
    }
  }, [ref.current])

  hooks.useEffect(() => {
    // notify listeners, subscribe to input changes
    let update = e => setValue(e.target.value)
    ref.current.addEventListener('input', update)
    ref.current.addEventListener('change', update)
    return () => {
      ref.current.removeEventListener('input', update)
      ref.current.removeEventListener('change', update)
    }
  }, [ref.current])

  return [value, (value) => {
    setValue(value)
    // main write to input
    ref.current.setAttribute('value', ref.current.value = value)
    if (value == null) ref.current.removeAttribute('value')
  }]
}
