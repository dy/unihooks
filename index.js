import setHooks, * as hooks from "any-hooks"

export * from 'any-hooks'
export default setHooks

const listeners = globalThis.__uhxListeners || (globalThis.__uhxListeners = {}),
  values = globalThis.__uhxValues || (globalThis.__uhxValues = {})

export function useValue(key, init) {
  let [, setState] = hooks.useState()

  hooks.useMemo(() => {
    (listeners[key] || (listeners[key] = [])).push(setState)

    if (init === undefined) return
    if (!(key in values)) {
      if (typeof init === 'function') {
        init = init()
      }
      values[key] = init
      if (init && init.then) {
        init.then(init => {
          setState(values[key] = init)
        })
      }
    }
  }, [key])

  hooks.useEffect(() => () => {
    listeners[key].splice(listeners[key].indexOf(setState) >>> 0, 1)
    if (!listeners[key].length) delete values[key]
  }, [key])

  return [values[key], (value) => {
    values[key] = typeof value === 'function' ? value(values[key]) : value
    listeners[key].map((setState) => setState(value))
  }]
}

export function useStorage(key, init, o) {
  o = { storage: window.localStorage, prefix: '__uhx:storage-', ...(o || {})}
  let storeKey = o.prefix + key
  let [value, setValue] = useValue(key, () => {
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
  let [value, setValue] = useValue('__uhx:searchParam-' + key, () => {
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

export function useValidate(validate) {
  let [error, setError] = hooks.useState(null)
  let runValidate = hooks.useCallback((value, check) => {
    try {
      var valid = check(value)
      if (valid === true || valid === undefined) {
        setError(error = null)
        return true
      }
      throw valid
    } catch (e) {
      setError(error = e)
    }
    return false
  }, [])

  return [error, (value = field.value) => {
    if (!validate) return
    if (Array.isArray(validate)) {
      return validate.every(validate => runValidate(value, validate))
    }
    return runValidate(value, validate)
  }]
}

export function useFormField(props={}) {
  const prefix = '__uhx:form-field'

  let { value: init, validate: rules, persist, ...inputProps } = props

  let inputRef = hooks.useRef()
  let [, setValue] = hooks.useState()
  let [, setFocus] = hooks.useState()
  let [ error, validate ] = useValidate(rules)

  let field = hooks.useMemo(() => {
    let field = Object.create({
      value: init,
      error: null,
      touched: false,
      focus: false,
      set: (value) => {
        setValue(field.value = value)
        field.validate(field.value)
      },
      reset: () => {
        setValue(field.value = init)
        field.error = null
        field.touched = false
      },
      validate: (value=field.value) => validate(value),
      valueOf() { return this.value },
      [Symbol.toPrimitive]() { return this.value },
      [Symbol.iterator]: function* () {
        yield field[0]
        yield field
      },
      // inputProps
      [0]: Object.assign(Object.create(null, {
        value: { enumerable: true, get() { return field.value } }
      }), {
        onBlur: e => {
          setFocus(field.focus = false)
        },
        onFocus: e => {
          setFocus(field.focus = true)
        },
        onChange: e => {
          field.touched = true
          field.set(e.target.value)
        },
        onInput: e => {
          field.touched = true
          field.set(e.target.value)
        },
        ref: inputRef,
        ...inputProps
      })
    }, {
      [1]: { enumerable: false, get() { return field } }
    })

    return field
  }, [])

  let key = inputProps.name || inputProps.id || inputProps.key
  hooks.useEffect(() => {
    if (persist && init == null) {
      let storedValue = window.sessionStorage.getItem(prefix + key)
      if (storedValue !== undefined) {
        field.set(field.value = storedValue)
      }
    }
  }, [])
  hooks.useEffect(() => {
    if (persist) {
      window.sessionStorage.setItem(prefix + key, field.value)
    }
  }, [field.value])

  hooks.useMemo(() => {
    field.error = error
  }, [error])

  return field
}

